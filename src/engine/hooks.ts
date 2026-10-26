import { useEffect, useRef } from 'react'
import { director, DirState, SCENES } from './director'

/** Subscribe to scroll state. The callback mutates DOM via refs; React never re-renders on scroll. */
export function useDirector(cb: (s: DirState) => void) {
  const ref = useRef(cb)
  ref.current = cb
  useEffect(() => director.subscribe((s) => ref.current(s)), [])
}

export function sceneIndex(id: string) {
  return SCENES.findIndex((s) => s.id === id)
}

/** Per-scene hook: gives the scene's own enter/p/exit/vis. */
export function useScene(id: string, cb: (sc: DirState['scenes'][number], s: DirState) => void) {
  const idx = sceneIndex(id)
  useDirector((s) => cb(s.scenes[idx], s))
}

export const fadeOut = (exit: number) => Math.max(0, 1 - exit * 2.4)

import { clamp, easeOutCubic, SceneState } from './director'
/** Enter/exit motion rule: fade+translate in on enter, fade fast on exit (opacity × max(0, 1 − exit·2.4)). */
export function reveal(el: HTMLElement | null, sc: SceneState, delay = 0, dy = 40, dx = 0) {
  if (!el) return
  const e = easeOutCubic(clamp((sc.enter - delay) / Math.max(0.01, 1 - delay)))
  const o = e * fadeOut(sc.exit)
  el.style.opacity = String(o)
  el.style.transform = `translate3d(${(1 - e) * dx}px,${(1 - e) * dy - sc.exit * 30}px,0)`
  el.style.visibility = o < 0.003 ? 'hidden' : 'visible'
}
