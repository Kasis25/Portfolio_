import { useRef } from 'react'
import { Section } from '../App'
import Odometer, { OdoHandle } from '../components/Odometer'
import { DATA } from '../data'
import { clamp, easeOutCubic } from '../engine/director'
import { fadeOut, reveal, useScene } from '../engine/hooks'

export default function Awards() {
  const N = DATA.creds.length
  const head = useRef<HTMLDivElement>(null)
  const cnts = useRef<(HTMLDivElement | null)[]>([])
  const odos = useRef<(OdoHandle | null)[]>([])
  const ring = useRef<HTMLDivElement>(null)
  const ringWrap = useRef<HTMLDivElement>(null)
  const sub = useRef<HTMLDivElement>(null)

  useScene('awards', (sc, s) => {
    reveal(head.current, sc, 0, 30)
    const f = fadeOut(sc.exit)
    cnts.current.forEach((c, i) => {
      if (!c) return
      const r = easeOutCubic(clamp((sc.enter * 1.1 + sc.p * 0.6 - 0.25 - i * 0.12) / 0.4))
      c.style.opacity = String(r * f)
      c.style.transform = `rotateX(${-100 * (1 - r)}deg)`
    })
    odos.current.forEach((o) => o?.set(clamp((sc.p + sc.enter * 0.4 - 0.2) / 0.5)))
    reveal(sub.current, sc, 0.25, 30)
    if (ringWrap.current) {
      const e = easeOutCubic(clamp(sc.enter * 1.2))
      ringWrap.current.style.opacity = String(e * f)
      ringWrap.current.style.transform = `scale(${s.mobile ? 0.7 : 1}) translate3d(0,${(1 - e) * 30}px,0)`
    }
    if (ring.current) ring.current.style.transform = `translateZ(-360px) rotateX(-14deg) rotateY(${-sc.p * (360 - 360 / N)}deg)`
  })

  return (
    <Section id="awards">
      <div className="awards-front">
        <div className="label" ref={head}><b>(05)</b> — Awards</div>
        <div className="counters">
          {DATA.counters.map((c, i) => (
            <div className={'counter ' + (i % 2 ? 'dark' : 'redc')} key={c.label} ref={(el) => { cnts.current[i] = el }}>
              <div className="c-num"><Odometer ref={(o) => { odos.current[i] = o }} value={c.n} decimals={c.d} suffix={c.suffix} /></div>
              <div className="c-label mono">{c.label}</div>
            </div>
          ))}
        </div>
        <div className="sub mono" ref={sub}>Credentials &amp; core stack</div>
        <div className="ring-wrap" ref={ringWrap}>
          <div className="ring" ref={ring}>
            {DATA.creds.map((c, i) => (
              <div className="rcard" key={c.t} style={{ transform: `rotateY(${(360 / N) * i}deg) translateZ(360px)` }}>
                <div className={'face front' + (i % 3 === 2 ? ' red' : '')}>
                  <div className="rc-t">{c.t}</div>
                  <div className="rc-i mono">{c.i}</div>
                  <span className="seal">✓</span>
                </div>
                <div className="face back" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
