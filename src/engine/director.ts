import Lenis from 'lenis'
import gsap from 'gsap'
import { mouse } from './mouse'

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
export const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4)
export const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

export type Scene = { id: string; from: number; to: number; x: number; k: number; label: string }
// The source clip is one continuous take, so "shots" are four pose ranges (see manifest).
export const SCENES: Scene[] = [
  { id: 'hero', from: 0, to: 59, x: 0.7, k: 1.0, label: 'Hello' },
  { id: 'about', from: 60, to: 119, x: 0.27, k: 1.0, label: 'About' },
  { id: 'work', from: 120, to: 179, x: 0.77, k: 0.86, label: 'Work' },
  { id: 'journey', from: 180, to: 215.4, x: 0.26, k: 1.0, label: 'Journey' },
  { id: 'skills', from: 215.4, to: 230.4, x: 0.5, k: 0.98, label: 'Toolkit' },
  { id: 'awards', from: 230.4, to: 239, x: 0.75, k: 1.0, label: 'Awards' },
  { id: 'contact', from: 59, to: 0, x: 0.5, k: 1.0, label: 'Contact' },
]
export const HEIGHTS: Record<string, number> = {
  hero: 230, about: 280, work: 460, journey: 240, skills: 280, awards: 320, contact: 240,
}
export const CONTACT = 6

export type SceneState = { enter: number; p: number; exit: number; vis: number; top: number; h: number }
export type DirState = {
  y: number; vw: number; vh: number; mobile: boolean; progress: number
  scenes: SceneState[]; active: number; prev: number; t: number
  /** fractional frame of the incoming/active scene and the outgoing one */
  frame: number; prevFrame: number
}
type Sub = (s: DirState) => void

class Director {
  lenis: Lenis | null = null
  subs = new Set<Sub>()
  els: HTMLElement[] = []
  tops: number[] = []
  hs: number[] = []
  vw = innerWidth
  vh = innerHeight
  total = 1
  state: DirState = {
    y: 0, vw: innerWidth, vh: innerHeight, mobile: false, progress: 0,
    scenes: SCENES.map(() => ({ enter: 0, p: 0, exit: 0, vis: 0, top: 0, h: 1 })),
    active: 0, prev: 0, t: 1, frame: 0, prevFrame: 0,
  }
  private ro: ResizeObserver | null = null
  private started = false

  init() {
    if (this.lenis) return
    history.scrollRestoration = 'manual'
    scrollTo(0, 0)
    this.lenis = new Lenis({ lerp: 0.075, smoothWheel: true, wheelMultiplier: 0.9, touchMultiplier: 1.4 })
    this.lenis.stop()
    gsap.ticker.add((time) => {
      this.lenis!.raf(time * 1000)
      this.tick()
    })
    gsap.ticker.lagSmoothing(0)
  }

  register(els: HTMLElement[]) {
    this.els = els
    this.ro?.disconnect()
    this.ro = new ResizeObserver(() => this.measure())
    els.forEach((e) => this.ro!.observe(e))
    this.ro.observe(document.documentElement)
    this.measure()
  }

  measure() {
    this.vw = innerWidth
    this.vh = innerHeight
    const sy = scrollY
    this.tops = this.els.map((e) => e.getBoundingClientRect().top + sy)
    this.hs = this.els.map((e) => e.offsetHeight)
    this.total = Math.max(1, document.documentElement.scrollHeight - this.vh)
  }

  start() {
    this.started = true
    this.lenis?.start()
  }
  get isStarted() { return this.started }

  scrollToScene(i: number) {
    const top = this.tops[i]
    if (top == null) return
    // land inside the scene where its content is settled
    const target = i === 0 ? 0 : top + this.vh * 0.04
    this.lenis?.scrollTo(target, { duration: 2.2, easing: easeOutQuart })
  }
  scrollTop() { this.lenis?.scrollTo(0, { duration: 2.4, easing: easeOutQuart }) }

  subscribe(fn: Sub) {
    this.subs.add(fn)
    fn(this.state)
    return () => { this.subs.delete(fn) }
  }

  tick() {
    mouse.step()
    if (!this.tops.length) return
    const y = this.lenis ? this.lenis.scroll : scrollY
    const { vh, vw } = this
    const s = this.state
    s.y = y; s.vh = vh; s.vw = vw; s.mobile = vw < 820
    s.progress = clamp(y / this.total)
    const lead = 0.78 * vh, span = 0.62 * vh
    let active = 0
    for (let i = 0; i < SCENES.length; i++) {
      const top = this.tops[i], h = this.hs[i]
      const sc = s.scenes[i]
      sc.top = top; sc.h = h
      sc.enter = clamp((y - (top - vh)) / vh)
      sc.p = clamp((y - top) / Math.max(1, h - vh))
      sc.exit = clamp((y - (top + h - vh)) / vh)
      sc.vis = clamp(Math.min(sc.enter * 1.6, 1 - sc.exit * 2.2))
      if (y >= top - lead) active = i
    }
    s.active = active
    s.prev = Math.max(0, active - 1)
    const sc = SCENES[active]
    const top = this.tops[active]
    s.t = active === 0 ? 1 : easeInOutSine(clamp((y - (top - lead)) / span))
    s.frame = sc.from + (sc.to - sc.from) * s.scenes[active].p
    s.prevFrame = SCENES[s.prev].to
    this.subs.forEach((f) => f(s))
  }
}
export const director = new Director()
