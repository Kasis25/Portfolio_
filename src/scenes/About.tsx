import { useMemo, useRef } from 'react'
import { Back, Section } from '../App'
import Odometer, { OdoHandle } from '../components/Odometer'
import TiltCard from '../components/TiltCard'
import { DATA } from '../data'
import { clamp, easeOutCubic } from '../engine/director'
import { fadeOut, reveal, useScene } from '../engine/hooks'

export default function About() {
  const shade = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLDivElement>(null)
  const man = useRef<HTMLParagraphElement>(null)
  const cards = useRef<(HTMLDivElement | null)[]>([])
  const odos = useRef<(OdoHandle | null)[]>([])
  const words = useMemo(() => {
    const out: { t: string; red: boolean }[] = []
    DATA.manifesto.forEach(([s, red]) => s.split(/(\s+)/).forEach((t) => { if (t.trim()) out.push({ t, red }) }))
    return out
  }, [])
  const wEls = useRef<(HTMLSpanElement | null)[]>([])

  useScene('about', (sc) => {
    if (shade.current) {
      const e = easeOutCubic(clamp(sc.vis))
      shade.current.style.opacity = String(e)
      shade.current.style.transform = `translate3d(${(1 - e) * -8}vw,0,0)`
    }
    reveal(label.current, sc, 0.0, 30)
    const n = wEls.current.length
    wEls.current.forEach((w, i) => {
      if (!w) return
      const r = clamp((sc.p * 1.25 - (i / n) * 0.85) / 0.16)
      w.style.opacity = String(0.1 + 0.9 * r)
      w.style.transform = `translate3d(0,${(1 - r) * 0.25}em,0)`
      w.style.filter = r >= 1 ? 'none' : `blur(${(1 - r) * 4}px)`
    })
    if (man.current) man.current.style.opacity = String(fadeOut(sc.exit) * clamp(sc.enter * 3))
    cards.current.forEach((c, i) => reveal(c, sc, 0.2 + i * 0.08, 50))
    odos.current.forEach((o) => o?.set(clamp((sc.p - 0.12) / 0.55)))
  })

  return (
    <>
      <Back><div className="about-shade" ref={shade} /></Back>
      <Section id="about">
        <div className="about-front">
          <div className="about-top">
            <div className="label" ref={label}><b>(01)</b> — About me</div>
            <p className="manifesto" ref={man}>
              {words.map((w, i) => (
                <span key={i}><span className={'mw' + (w.red ? ' red' : '')} ref={(el) => { wEls.current[i] = el }}>{w.t}</span>{' '}</span>
              ))}
            </p>
          </div>
          <div className="stats">
            {DATA.stats.map((s, i) => (
              <div className="stat-wrap" key={s.label} ref={(el) => { cards.current[i] = el }}>
                <TiltCard className="stat">
                  <div className="stat-num"><Odometer ref={(o) => { odos.current[i] = o }} value={s.value} decimals={s.decimals} suffix={s.suffix} /></div>
                  <div className="stat-label mono">{s.label}</div>
                </TiltCard>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  )
}
