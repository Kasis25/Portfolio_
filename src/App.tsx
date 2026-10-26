import { createContext, ReactNode, useContext, useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { director, HEIGHTS } from './engine/director'
import Stage from './components/Stage'
import { Preloader, HUD, Cursor } from './components/Chrome'
import Hero from './scenes/Hero'
import About from './scenes/About'
import Work from './scenes/Work'
import Journey from './scenes/Journey'
import Skills from './scenes/Skills'
import Awards from './scenes/Awards'
import Contact from './scenes/Contact'

const Ctx = createContext<{ back: HTMLElement | null; front: HTMLElement | null }>({ back: null, front: null })
export const Back = ({ children }: { children: ReactNode }) => { const c = useContext(Ctx); return c.back ? createPortal(children, c.back) : null }
export const Front = ({ children }: { children: ReactNode }) => { const c = useContext(Ctx); return c.front ? createPortal(children, c.front) : null }

export const Section = ({ id, children }: { id: string; children: ReactNode }) => (
  <section className="scene" id={id} data-scene={id} style={{ height: HEIGHTS[id] + 'vh' }}>
    <div className="sticky"><div className="inner">{children}</div></div>
  </section>
)

export default function App() {
  const [layers, setLayers] = useState<{ back: HTMLElement | null; front: HTMLElement | null }>({ back: null, front: null })
  const [back, setBack] = useState<HTMLElement | null>(null)
  const [front, setFront] = useState<HTMLElement | null>(null)
  useLayoutEffect(() => { if (back && front) setLayers({ back, front }) }, [back, front])
  useLayoutEffect(() => {
    if (!layers.back) return
    const els = Array.from(document.querySelectorAll<HTMLElement>('main > .scene'))
    director.register(els)
    const re = () => director.measure()
    addEventListener('resize', re)
    document.fonts?.ready.then(re)
    return () => removeEventListener('resize', re)
  }, [layers])
  return (
    <Ctx.Provider value={layers}>
      <div className="layer-back" ref={setBack} />
      <Stage />
      <div className="layer-front" ref={setFront} />
      <main>
        <Hero /><About /><Work /><Journey /><Skills /><Awards /><Contact />
      </main>
      <HUD />
      <Cursor />
      <Preloader />
    </Ctx.Provider>
  )
}
