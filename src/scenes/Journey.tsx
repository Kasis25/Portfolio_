import { useRef } from 'react'
import { Back, Section } from '../App'
import { DATA } from '../data'
import { clamp, easeOutCubic } from '../engine/director'
import { fadeOut, reveal, useScene } from '../engine/hooks'

const smooth = (t: number) => t * t * (3 - 2 * t)

export default function Journey() {
  const year = useRef<HTMLDivElement>(null)
  const cols = useRef<(HTMLSpanElement | null)[]>([])
  const head = useRef<HTMLDivElement>(null)
  const title = useRef<HTMLDivElement>(null)
  const line = useRef<SVGPathElement>(null)
  const items = useRef<(HTMLLIElement | null)[]>([])
  const digits = String(DATA.startYear).split('').map(Number)
  const end = DATA.gradYear % 10, start = DATA.startYear % 10

  useScene('journey', (sc) => {
    if (year.current) {
      const o = easeOutCubic(clamp(sc.vis)) * 1
      year.current.style.opacity = String(o)
      year.current.style.transform = `translate3d(-50%,${(1 - o) * 6}vh,0)`
    }
    const r = smooth(clamp((sc.p - 0.08) / 0.8))
    cols.current.forEach((c, i) => {
      if (!c) return
      const pos = i === 3 ? start + (end - start) * r : digits[i]
      c.style.transform = `translate3d(0,${-(pos / 10) * 100}%,0)`
    })
    reveal(head.current, sc, 0, 30)
    reveal(title.current, sc, 0.05, 40)
    const drawn = clamp((sc.p * 1.25 + 0.05))
    if (line.current) line.current.style.strokeDashoffset = String(1 - drawn)
    const n = items.current.length
    items.current.forEach((it, i) => {
      if (!it) return
      const order = n - 1 - i // oldest (bottom) first
      const r2 = easeOutCubic(clamp((drawn * 1.05 - order / (n + 0.4)) / 0.28))
      const f = fadeOut(sc.exit) * clamp(sc.enter * 2)
      it.style.opacity = String(r2 * f)
      it.style.transform = `translate3d(0,${(1 - r2) * 40}px,0) rotateY(${-55 * (1 - r2)}deg)`
      it.classList.toggle('on', r2 > 0.95)
    })
  })

  return (
    <>
      <Back>
        <div className="big-year" ref={year} aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <span className="by-win" key={i}>
              <span className="by-col" ref={(el) => { cols.current[i] = el }}>{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => <span key={d}>{d}</span>)}</span>
            </span>
          ))}
        </div>
      </Back>
      <Section id="journey">
        <div className="journey-front">
          <div className="label" ref={head}><b>(03)</b> — Journey</div>
          <h2 className="sec-title" ref={title}>LEARNING<br /><span className="red">OUT LOUD.</span></h2>
          <div className="timeline">
            <div className="tl-track" />
            <svg className="tl-line" viewBox="0 0 2 100" preserveAspectRatio="none">
              <path ref={line} d="M1 100 L1 0" pathLength={1} strokeDasharray={1} strokeDashoffset={1} />
            </svg>
            <ul>
              {DATA.journey.map((j, i) => (
                <li key={j.when} ref={(el) => { items.current[i] = el }}>
                  <i className="node" />
                  <div className="tl-when mono">{j.when}</div>
                  <div className="tl-title">{j.title}</div>
                  <div className="tl-org">{j.org}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  )
}
