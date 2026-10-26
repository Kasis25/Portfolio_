import { ReactNode, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { director, SCENES, CONTACT } from '../engine/director'
import { frames } from '../engine/frames'
import { useDirector } from '../engine/hooks'
import { DATA } from '../data'

export function Preloader() {
  const root = useRef<HTMLDivElement>(null)
  const num = useRef<HTMLDivElement>(null)
  useEffect(() => {
    director.init()
    const o = { v: 0 }
    let target = 0
    const tween = () => gsap.to(o, { v: target * 100, duration: 0.5, ease: 'power2.out', overwrite: true, onUpdate: render, onComplete: check })
    const render = () => { if (num.current) num.current.textContent = String(Math.round(o.v)).padStart(3, '0') }
    let finished = false
    const check = () => {
      if (finished || target < 1 || o.v < 99.5) return
      finished = true
      const el = root.current!
      const tl = gsap.timeline({ onComplete: () => { el.style.display = 'none' } })
      tl.to('.pre-line', { yPercent: -120, opacity: 0, duration: 0.5, ease: 'power3.in' })
        .add(() => { window.dispatchEvent(new Event('intro')) }, 0.45)
        .to('.pre-top', { yPercent: -100, duration: 1.2, ease: 'expo.inOut' }, 0.35)
        .to('.pre-bot', { yPercent: 100, duration: 1.2, ease: 'expo.inOut' }, 0.35)
        .to(num.current, { opacity: 0, duration: 0.3 }, 0.3)
        .add(() => director.start(), 1.0)
    }
    frames.init((p) => { target = p; tween() }).catch(() => { target = 1; tween() })
    return () => { gsap.killTweensOf(o) }
  }, [])
  return (
    <div className="preloader" ref={root}>
      <div className="pre-half pre-top" />
      <div className="pre-half pre-bot" />
      <div className="pre-mid">
        <div className="pre-line mono">Loading portfolio</div>
        <div className="pre-num" ref={num}>000</div>
        <div className="pre-line mono">{DATA.name} — Full-stack developer</div>
      </div>
    </div>
  )
}

export function HUD() {
  const root = useRef<HTMLElement>(null)
  const pct = useRef<HTMLSpanElement>(null)
  const rail = useRef<HTMLSpanElement>(null)
  const items = useRef<(HTMLButtonElement | null)[]>([])
  const last = useRef({ a: -1, w: false })
  useDirector((s) => {
    if (pct.current) pct.current.textContent = String(Math.round(s.progress * 100)).padStart(2, '0') + '%'
    if (rail.current) rail.current.style.transform = `scaleY(${s.progress})`
    const white = s.active === CONTACT && s.t > 0.6
    if (white !== last.current.w) { last.current.w = white; root.current?.classList.toggle('white', white) }
    if (s.active !== last.current.a) {
      last.current.a = s.active
      items.current.forEach((b, i) => b?.classList.toggle('on', i === s.active))
    }
  })
  return (
    <header className="hud" ref={root}>
      <a className="logo" href="#" onClick={(e) => { e.preventDefault(); director.scrollTop() }} data-cursor="Top">
        {DATA.first}<sup>®</sup>
      </a>
      <nav className="pill">
        {SCENES.map((s, i) => (
          <button key={s.id} ref={(el) => { items.current[i] = el }} className={i === 0 ? 'on' : ''} onClick={() => director.scrollToScene(i)}>
            {s.label}
          </button>
        ))}
      </nav>
      <div className="prog mono">
        <span ref={pct}>00%</span>
        <i className="rail"><span ref={rail} /></i>
      </div>
    </header>
  )
}

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!matchMedia('(pointer:fine)').matches) return
    document.documentElement.classList.add('has-cursor')
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, size = 42, hover = ''
    const mv = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY
      const t = (e.target as HTMLElement).closest?.('[data-cursor]') as HTMLElement | null
      hover = t ? t.dataset.cursor || '' : ''
    }
    addEventListener('mousemove', mv)
    const tick = () => {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16
      size += ((hover ? 92 : 42) - size) * 0.18
      if (dot.current) dot.current.style.transform = `translate3d(${mx - 4}px,${my - 4}px,0)`
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx - size / 2}px,${ry - size / 2}px,0)`
        ring.current.style.width = ring.current.style.height = size + 'px'
        ring.current.classList.toggle('big', !!hover)
      }
      if (label.current) label.current.textContent = hover
    }
    gsap.ticker.add(tick)
    return () => { removeEventListener('mousemove', mv); gsap.ticker.remove(tick) }
  }, [])
  return (
    <>
      <div className="cur-ring" ref={ring}><span ref={label} /></div>
      <div className="cur-dot" ref={dot} />
    </>
  )
}

type BtnProps = { href: string; children: ReactNode; variant?: 'red' | 'line'; cursor?: string; external?: boolean; download?: boolean }
export function Btn({ href, children, variant = 'red', cursor = 'Go', external, download }: BtnProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  useEffect(() => {
    const el = ref.current!
    if (!matchMedia('(pointer:fine)').matches) return
    const qx = gsap.quickTo(el, 'x', { duration: 1, ease: 'elastic.out(1,0.4)' })
    const qy = gsap.quickTo(el, 'y', { duration: 1, ease: 'elastic.out(1,0.4)' })
    const mv = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      qx((e.clientX - (r.left + r.width / 2)) * 0.35)
      qy((e.clientY - (r.top + r.height / 2)) * 0.35)
    }
    const lv = () => { qx(0); qy(0) }
    el.addEventListener('mousemove', mv); el.addEventListener('mouseleave', lv)
    return () => { el.removeEventListener('mousemove', mv); el.removeEventListener('mouseleave', lv) }
  }, [])
  return (
    <a ref={ref} href={href} className={'btn ' + variant} data-cursor={cursor}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})} {...(download ? { download: true } : {})}>
      <span className="roll"><span>{children}</span><span aria-hidden>{children}</span></span>
    </a>
  )
}
