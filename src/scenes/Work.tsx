import { useRef } from 'react'
import { Back, Section } from '../App'
import { DATA } from '../data'
import { clamp, easeInOut, easeOutCubic } from '../engine/director'
import { reveal, useScene } from '../engine/hooks'

function Visual({ kind }: { kind: string }) {
  if (kind === 'gauge')
    return (
      <svg viewBox="0 0 200 130" className="vis-gauge">
        <path d="M20 110 A80 80 0 0 1 180 110" fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="14" strokeLinecap="round" />
        <path className="g-arc" d="M20 110 A80 80 0 0 1 180 110" fill="none" stroke="#fff" strokeWidth="14" strokeLinecap="round" pathLength={1} />
        <text x="100" y="104" textAnchor="middle" className="g-txt">98</text>
      </svg>
    )
  if (kind === 'heat')
    return (
      <div className="vis-heat">
        {Array.from({ length: 35 }).map((_, i) => <i key={i} style={{ opacity: 0.18 + ((i * 37) % 11) / 13, animationDelay: `${(i % 7) * 0.12}s` }} />)}
      </div>
    )
  return (
    <div className="vis-page">
      <b /><i className="w1" /><i className="w2" /><div><u /><u /><u /></div><s />
    </div>
  )
}

export default function Work() {
  const head = useRef<HTMLDivElement>(null)
  const cnt = useRef<HTMLSpanElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const deck = useRef<HTMLDivElement>(null)
  const grid = useRef<HTMLDivElement>(null)
  const cards = useRef<(HTMLElement | null)[]>([])
  const N = DATA.projects.length
  const lastC = useRef(-1)

  useScene('work', (sc, s) => {
    if (grid.current) {
      const o = clamp(sc.vis)
      grid.current.style.opacity = String(o)
      grid.current.style.setProperty('--gy', `${sc.p * 540}px`)
    }
    reveal(head.current, sc, 0, 30)
    const P = clamp((sc.p - 0.06) / 0.88) * (N - 1)
    const base = Math.min(Math.floor(P), N - 2)
    const q = base + easeInOut(P - base)
    const ent = easeOutCubic(clamp(sc.enter * 1.3))
    const exitFade = Math.max(0, 1 - sc.exit * 2.4)
    if (deck.current) {
      deck.current.style.opacity = String(ent * exitFade)
      deck.current.style.visibility = ent * exitFade < 0.003 ? 'hidden' : 'visible'
      deck.current.style.transform = `translate3d(0,${(1 - ent) * 55 * (s.vh / 100) - sc.exit * 30}px,0) rotateY(${-25 * (1 - ent)}deg)`
    }
    const vh = s.vh / 100
    cards.current.forEach((c, i) => {
      if (!c) return
      const d = q - i
      let z: number, y: number, rx = 0, o: number
      if (d <= 0) { z = d * 300; y = d * 3.2 * vh; o = clamp(1 + d * 1.15) }
      else { z = d * 900; y = -12 * d * vh; rx = 28 * d; o = clamp(1 - 1.8 * d) }
      c.style.opacity = String(o)
      c.style.visibility = o < 0.01 ? 'hidden' : 'visible'
      c.style.zIndex = String(100 - Math.round(Math.abs(d) * 10))
      c.style.transform = `translate3d(0,${y}px,${z}px) rotateX(${rx}deg)`
      c.classList.toggle('live', Math.abs(d) < 0.5)
    })
    const cur = Math.round(q)
    if (cur !== lastC.current) { lastC.current = cur; if (cnt.current) cnt.current.textContent = `${String(cur + 1).padStart(2, '0')} / ${String(N).padStart(2, '0')}` }
    if (bar.current) bar.current.style.transform = `scaleX(${(q + 1) / N})`
  })

  return (
    <>
      <Back><div className="work-floor" ref={grid} /></Back>
      <Section id="work">
        <div className="work-front">
          <div className="work-head" ref={head}>
            <div className="label"><b>(02)</b> — Work</div>
            <div className="work-count"><span ref={cnt}>01 / 03</span><i className="wbar"><span ref={bar} /></i></div>
          </div>
          <div className="deck-wrap"><div className="deck" ref={deck}>
            {DATA.projects.map((p, i) => (
              <article className="pcard" key={p.n} ref={(el) => { cards.current[i] = el }}>
                <div className="pc-left">
                  <div className="pc-top mono"><b>{p.n}</b> — {p.cat}</div>
                  <h3 className="pc-name">{p.name}</h3>
                  <p className="pc-desc">{p.desc}</p>
                  <ul className="chips">{p.chips.map((c) => <li key={c}>{c}</li>)}</ul>
                  <a className="pc-link" href={p.href} target="_blank" rel="noreferrer" data-cursor="Open">View on GitHub ↗</a>
                </div>
                <div className="pc-vis"><Visual kind={p.visual} /></div>
              </article>
            ))}
          </div></div>
        </div>
      </Section>
    </>
  )
}
