export type Shot = { from: number; to: number; box: [number, number, number, number]; cx: number }
export type Manifest = { w: number; h: number; count: number; shots: Shot[] }

class Frames {
  manifest!: Manifest
  imgs: (HTMLImageElement | null)[] = []
  loaded = 0
  small = false
  ready = false

  shotOf(i: number) {
    const s = this.manifest.shots
    for (let k = 0; k < s.length; k++) if (i >= s[k].from && i <= s[k].to) return k
    return i < s[0].from ? 0 : s.length - 1
  }

  async init(onProgress: (p: number) => void) {
    const res = await fetch('./frames/manifest.json')
    this.manifest = await res.json()
    const { count, shots } = this.manifest
    this.small = innerWidth < 820
    this.imgs = new Array(count).fill(null)
    const dir = this.small ? 'sm' : 'lg'
    const order: number[] = []
    const seen = new Set<number>()
    const add = (i: number) => { if (i >= 0 && i < count && !seen.has(i)) { seen.add(i); order.push(i) } }
    shots.forEach((s) => { add(s.from); add(s.to) })
    for (const stride of [8, 4, 2, 1]) for (let i = 0; i < count; i += stride) add(i)
    const need = Math.ceil(count / 4)
    let resolveReady: () => void
    const ready = new Promise<void>((r) => (resolveReady = r))
    let cursor = 0
    const worker = async () => {
      while (cursor < order.length) {
        const i = order[cursor++]
        const img = new Image()
        img.src = `./frames/${dir}/f${String(i).padStart(3, '0')}.webp`
        try { await img.decode(); this.imgs[i] = img } catch { /* nearest-frame fallback covers misses */ }
        this.loaded++
        onProgress(Math.min(1, this.loaded / need))
        if (this.loaded >= need) resolveReady()
      }
    }
    for (let w = 0; w < 6; w++) worker()
    await ready
    this.ready = true
  }

  get(i: number): HTMLImageElement | null {
    if (!this.imgs.length) return null
    const n = this.manifest.count
    i = Math.max(0, Math.min(n - 1, Math.round(i)))
    if (this.imgs[i]) return this.imgs[i]
    const sh = this.manifest.shots[this.shotOf(i)]
    for (let d = 1; d < n; d++) {
      for (const j of [i - d, i + d]) {
        if (j >= sh.from && j <= sh.to && this.imgs[j]) return this.imgs[j]
      }
      if (i - d < sh.from && i + d > sh.to) break
    }
    return null
  }
}
export const frames = new Frames()
