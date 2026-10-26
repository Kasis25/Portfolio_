import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import { Back, Section } from '../App'
import { Btn } from '../components/Chrome'
import { DATA } from '../data'
import { clamp } from '../engine/director'
import { fadeOut, useScene } from '../engine/hooks'

export default function Hero() {
  const nameRef = useRef<HTMLDivElement>(null)
  const frontRef = useRef<HTMLDivElement>(null)
  const letters = useRef<(HTMLSpanElement | null)[]>([])
  const words = useRef<(HTMLSpanElement | null)[]>([])
  const intro = useRef(false)
  const toks = useMemo(() => DATA.tagline.split(' '), [])

  useEffect(() => {
    const go = () => {
      intro.current = true
      gsap.fromTo('.hn-i', { yPercent: 115, rotateX: -80, opacity: 1 }, { yPercent: 0, rotateX: 0, opacity: 1, stagger: 0.07, duration: 1.6, ease: 'expo.out' })
      gsap.fromTo('.h-line > span', { yPercent: 115, opacity: 1 }, { yPercent: 0, opacity: 1, stagger: 0.12, duration: 1.4, ease: 'expo.out', delay: 0.2 })
      gsap.fromTo('.h-fade', { opacity: 0, y: 24 }, { opacity: 1, y: 0, stagger: 0.12, duration: 1.1, ease: 'expo.out', delay: 0.5 })
    }
    window.addEventListener('intro', go)
    return () => window.removeEventListener('intro', go)
  }, [])

  useScene('hero', (sc) => {
    const o = clamp(sc.vis) * fadeOut(sc.exit)
    if (nameRef.current) { nameRef.current.style.opacity = String(o); nameRef.current.style.visibility = o < 0.003 ? 'hidden' : 'visible' }
    letters.current.forEach((l, i) => { if (l) l.style.transform = `translate3d(0,${(i % 2 ? 1 : -1) * sc.p * 22}px,0)` })
    if (frontRef.current) {
      const f = fadeOut(sc.exit)
      frontRef.current.style.opacity = String(f)
      frontRef.current.style.transform = `translate3d(0,${-sc.exit * 40}px,0)`
      frontRef.current.style.visibility = f < 0.003 ? 'hidden' : 'visible'
    }
    const n = words.current.length
    const prog = clamp(sc.p * 1.5 - 0.1) * n
    words.current.forEach((w, i) => { if (w) w.style.backgroundSize = `${clamp(prog - i) * 100}% .36em` })
  })

  return (
    <>
      <Back>
        <div className="hero-name" ref={nameRef} aria-hidden>
          {DATA.first.toUpperCase().split('').map((c, i) => (
            <span className="hn-l" key={i} ref={(el) => { letters.current[i] = el }}><span className="hn-i">{c}</span></span>
          ))}
        </div>
      </Back>
      <Section id="hero">
        <div className="hero-front" ref={frontRef}>
          <p className="h-hi h-fade mono-ish">Hi, I’m <b>{DATA.name}</b> —</p>
          <h1 className="h-title">
            <span className="h-line"><span>{DATA.role[0]}</span></span>
            <span className="h-line red"><span>{DATA.role[1]}</span></span>
          </h1>
          <p className="h-desc h-fade">
            {toks.map((w, i) => (<span key={i}><span className="hl" ref={(el) => { words.current[i] = el }}>{w}</span>{' '}</span>))}
          </p>
          <div className="h-btns h-fade">
            <Btn href="#work" cursor="Go" variant="red"><>See my work ↘</></Btn>
            <Btn href={DATA.resume} cursor="PDF" variant="line" download><>Download résumé</></Btn>
          </div>
        </div>
      </Section>
    </>
  )
}
