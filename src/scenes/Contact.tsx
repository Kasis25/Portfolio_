import { useRef } from 'react'
import { Back, Section } from '../App'
import { DATA } from '../data'
import { CONTACT, clamp, easeOutCubic, director } from '../engine/director'
import { fadeOut, reveal, useDirector, useScene } from '../engine/hooks'

export default function Contact() {
  const bg = useRef<HTMLDivElement>(null)
  const big = useRef<HTMLDivElement>(null)
  const mail = useRef<HTMLAnchorElement>(null)
  const links = useRef<HTMLUListElement>(null)
  const foot = useRef<HTMLDivElement>(null)
  const [user, domain] = DATA.email.split('@')

  useDirector((s) => {
    const el = bg.current
    if (!el) return
    if (s.active !== CONTACT) { el.style.clipPath = 'polygon(0 0,0 0,0 0)'; el.style.visibility = 'hidden'; return }
    const H = s.vh, W = s.vw, skew = 0.2 * H
    const e = -skew + (W + 2 * skew) * s.t
    el.style.visibility = 'visible'
    el.style.clipPath = s.t >= 1 ? 'none' : `polygon(-4000px 0,${e + skew}px 0,${e - skew}px ${H}px,-4000px ${H}px)`
  })

  useScene('contact', (sc) => {
    if (big.current) {
      const e = easeOutCubic(clamp((sc.enter - 0.2) / 0.8))
      big.current.style.opacity = String(e * fadeOut(sc.exit))
      big.current.style.transform = `translate3d(-50%,${(1 - e) * 8}vh,0)`
    }
    reveal(mail.current, sc, 0.25, 40)
    reveal(links.current, sc, 0.3, 40)
    reveal(foot.current, sc, 0.35, 20)
  })

  return (
    <>
      <Back>
        <div className="contact-bg" ref={bg} />
        <div className="contact-big" ref={big} aria-hidden>
          <span>LET’S</span><span>TALK</span>
        </div>
      </Back>
      <Section id="contact">
        <div className="contact-front">
          <a className="mail" ref={mail} href={`mailto:${DATA.email}`} data-cursor="Write">
            <span className="ml">{user}</span>
            <span className="ml ink">@{domain}</span>
            <i className="uline" />
          </a>
          <ul className="links" ref={links}>
            {[['GitHub', DATA.github, 'Open'], ['LinkedIn', DATA.linkedin, 'Open'], ['Résumé', DATA.resume, 'PDF']].map(([l, h, c]) => (
              <li key={l}><a href={h} target="_blank" rel="noreferrer" data-cursor={c}><span>{l}</span><b>↗</b></a></li>
            ))}
          </ul>
          <div className="foot mono" ref={foot}>
            <span>© {new Date().getFullYear()} {DATA.name}</span>
            <a href="#" onClick={(e) => { e.preventDefault(); director.scrollTop() }} data-cursor="Top">Back to top ↑</a>
          </div>
        </div>
      </Section>
    </>
  )
}
