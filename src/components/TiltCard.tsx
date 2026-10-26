import { ReactNode, useRef } from 'react'

export default function TiltCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const move = (e: React.MouseEvent) => {
    const el = ref.current!
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height
    el.style.transition = 'transform .08s linear'
    el.style.transform = `perspective(900px) rotateY(${(x - 0.5) * 28}deg) rotateX(${(0.5 - y) * 28}deg) translateZ(0)`
    el.style.setProperty('--gx', x * 100 + '%')
    el.style.setProperty('--gy', y * 100 + '%')
    el.style.setProperty('--go', '1')
  }
  const leave = () => {
    const el = ref.current!
    el.style.transition = 'transform .7s cubic-bezier(.2,.8,.2,1)'
    el.style.transform = 'perspective(900px) rotateX(0) rotateY(0)'
    el.style.setProperty('--go', '0')
  }
  return (
    <div className={'tilt ' + className} ref={ref} onMouseMove={move} onMouseLeave={leave}>
      {children}
      <span className="glare" />
    </div>
  )
}
