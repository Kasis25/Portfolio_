import { useEffect, useMemo, useRef } from 'react'
import { Back, Front, Section } from '../App'
import { DATA } from '../data'
import { clamp } from '../engine/director'
import { mouse } from '../engine/mouse'
import { fadeOut, reveal, useScene } from '../engine/hooks'

export default function Skills() {
  const N = DATA.skills.length
  const pts = useMemo(() => {
    const g = Math.PI * (3 - Math.sqrt(5))
    return Array.from({ length: N }, (_, i) => {
      const y = 1 - (2 * (i + 0.5)) / N, r = Math.sqrt(1 - y * y), th = i * g
      return { x: Math.cos(th) * r, y, z: Math.sin(th) * r }
    })
  }, [N])
  const backEls = useRef<(HTMLSpanElement | null)[]>([])
  const frontEls = useRef<(HTMLSpanElement | null)[]>([])
  const head = useRef<HTMLDivElement>(null)
  const title = useRef<HTMLDivElement>(null)
  const tape = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const spin = useRef({ t: 0, last: 0 })
  const orbitWrap = useRef({ b: null as HTMLElement | null })

  useEffect(() => { spin.current.last = performance.now() }, [])

  useScene('skills', (sc, s) => {
    const now = performance.now()
    spin.current.t += (now - spin.current.last) / 1000
    spin.current.last = now
    const vis = clamp(sc.vis)
    const W = s.vw, H = s.vh
    const R = Math.min(0.27 * W, 0.46 * H) * (s.mobile ? 1.5 : 1)
    const cx = W * 0.5, cy = s.mobile ? H * 0.74 : H * 0.5
    const ang = spin.current.t * 0.28 + sc.p * 5 * Math.PI + mouse.x * 0.9
    const tilt = -0.28 + mouse.y * 0.18
    const ca = Math.cos(ang), sa = Math.sin(ang), ct = Math.cos(tilt), st = Math.sin(tilt)
    for (let i = 0; i < N; i++) {
      const p = pts[i]
      const x1 = p.x * ca + p.z * sa
      const z1 = -p.x * sa + p.z * ca
      const y2 = p.y * ct - z1 * st
      const z2 = p.y * st + z1 * ct
      const X = cx + x1 * R, Y = cy + y2 * R * 0.78
      const sc2 = 0.82 + z2 * 0.22
      const front = z2 > 0
      const a = frontEls.current[i], b = backEls.current[i]
      const o = vis * fadeOut(sc.exit)
      if (a) { a.style.opacity = front ? String(o * (0.75 + 0.25 * z2)) : '0'; a.style.transform = `translate3d(${X}px,${Y}px,0) translate(-50%,-50%) scale(${sc2})` }
      if (b) { b.style.opacity = front ? '0' : String(o * (0.55 + 0.25 * (1 + z2))); b.style.transform = `translate3d(${X}px,${Y}px,0) translate(-50%,-50%) scale(${sc2})` }
    }
    reveal(head.current, sc, 0, 30)
    reveal(title.current, sc, 0.05, 40)
    if (tape.current) {
      const e = clamp(sc.enter * 1.6) * fadeOut(sc.exit)
      tape.current.style.opacity = String(e)
      tape.current.style.transform = `translate3d(0,${(1 - e) * 20}vh,0) rotate(-2deg)`
    }
    if (track.current) {
      const w = track.current.scrollWidth / 2
      const off = (((s.y * 0.8) % w) + w) % w
      track.current.style.transform = `translate3d(${-off}px,0,0)`
    }
  })
  void orbitWrap

  return (
    <>
      <Back>
        {DATA.skills.map((k, i) => (<span className="chip-b" key={k} ref={(el) => { backEls.current[i] = el }}>{k}</span>))}
      </Back>
      <Front>
        {DATA.skills.map((k, i) => (<span className="chip-f" key={k} ref={(el) => { frontEls.current[i] = el }}>{k}</span>))}
      </Front>
      <Section id="skills">
        <div className="skills-front">
          <div className="label" ref={head}><b>(04)</b> — Toolkit</div>
          <h2 className="sec-title" ref={title}>EVERYTHING<br /><span className="red">IN ORBIT.</span></h2>
        </div>
        <div className="tape" ref={tape}>
          <div className="tape-track" ref={track}>
            {[0, 1].map((r) => (
              <span key={r}>{DATA.skills.map((k) => (<em key={k + r}>{k}<i>✦</i></em>))}</span>
            ))}
          </div>
        </div>
      </Section>
    </>
  )
}
