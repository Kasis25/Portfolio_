import { useEffect, useRef } from 'react'
import { director, SCENES, DirState, lerp } from '../engine/director'
import { frames } from '../engine/frames'
import { useDirector } from '../engine/hooks'

export const BLADE = { t: 1, active: 0 }

export default function Stage() {
  const ref = useRef<HTMLCanvasElement>(null)
  const st = useRef({ key: '', mx: 0, my: 0, cx: 0, cy: 0 })

  useEffect(() => {
    const m = (e: MouseEvent) => {
      st.current.mx = (e.clientX / innerWidth) * 2 - 1
      st.current.my = (e.clientY / innerHeight) * 2 - 1
    }
    addEventListener('mousemove', m)
    return () => removeEventListener('mousemove', m)
  }, [])

  useDirector((s: DirState) => {
    const cv = ref.current
    if (!cv || !frames.manifest) return
    const S = st.current
    S.cx = lerp(S.cx, S.mx, 0.06)
    S.cy = lerp(S.cy, S.my, 0.06)
    const dpr = Math.min(2, devicePixelRatio || 1)
    const W = s.vw, H = s.vh
    const px = Math.round(S.cx * 14 * 10) / 10, py = Math.round(S.cy * 14 * 10) / 10
    const t = Math.round(s.t * 1000) / 1000
    const fa = Math.round(s.frame * 100) / 100, fb = Math.round(s.prevFrame * 100) / 100
    BLADE.t = s.t; BLADE.active = s.active
    const key = [W, H, dpr, s.active, t, fa, fb, px, py, frames.loaded].join('|')
    if (key === S.key) return
    S.key = key
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) {
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr)
      cv.style.width = W + 'px'; cv.style.height = H + 'px'
    }
    const ctx = cv.getContext('2d')!
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, W, H)

    const man = frames.manifest
    const drawScene = (si: number, f: number, dx: number, alpha: number) => {
      const sc = SCENES[si]
      const shotIdx = frames.shotOf(Math.round(f))
      const shot = man.shots[shotIdx]
      const bw = shot.box[2]
      const mobile = W < 820
      const scale = mobile ? Math.min((H * 0.74) / 900, (W * 1.05) / bw) : (H * sc.k) / 900
      const x = mobile ? 0.5 : sc.x
      const offY = H - 900 * scale
      const offX = x * W - shot.cx * 1600 * scale + px + dx
      const base = Math.floor(f)
      const frac = f - base
      const put = (i: number, a: number) => {
        const img = frames.get(i)
        if (!img) return
        ctx.globalAlpha = a
        ctx.drawImage(img, offX + shot.box[0] * scale, offY + py + shot.box[1] * scale, shot.box[2] * scale, shot.box[3] * scale)
      }
      put(base, alpha)
      const next = Math.min(base + 1, shot.to)
      if (frac > 0.001 && next !== base && next >= shot.from) put(next, alpha * frac)
      ctx.globalAlpha = 1
    }

    if (s.active === 0 || s.t >= 1) {
      drawScene(s.active, s.frame, 0, 1)
      return
    }
    // Blade transition
    const skew = 0.2 * H
    const e = -skew + (W + 2 * skew) * s.t
    const big = 4000
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(e + skew, 0); ctx.lineTo(big, 0); ctx.lineTo(big, H); ctx.lineTo(e - skew, H); ctx.closePath()
    ctx.clip()
    drawScene(s.prev, s.prevFrame, 60 * s.t, 1 - 0.35 * s.t)
    ctx.restore()
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(-big, 0); ctx.lineTo(e + skew, 0); ctx.lineTo(e - skew, H); ctx.lineTo(-big, H); ctx.closePath()
    ctx.clip()
    drawScene(s.active, SCENES[s.active].from, -60 * (1 - s.t), 1)
    ctx.restore()
    const col = s.active === 6 ? '255,255,255' : '255,31,31'
    const g = ctx.createLinearGradient(e + skew, 0, e + skew - 90, 0)
    g.addColorStop(0, `rgba(${col},.32)`); g.addColorStop(1, `rgba(${col},0)`)
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.moveTo(e + skew, 0); ctx.lineTo(e + skew - 90, 0); ctx.lineTo(e - skew - 90, H); ctx.lineTo(e - skew, H); ctx.closePath()
    ctx.fill()
    ctx.save()
    ctx.strokeStyle = `rgb(${col})`; ctx.lineWidth = 3
    ctx.shadowColor = `rgba(${col},.9)`; ctx.shadowBlur = 24
    ctx.beginPath(); ctx.moveTo(e + skew, 0); ctx.lineTo(e - skew, H); ctx.stroke()
    ctx.restore()
  })

  useEffect(() => { director.measure() }, [])
  return <canvas ref={ref} className="stage" />
}
