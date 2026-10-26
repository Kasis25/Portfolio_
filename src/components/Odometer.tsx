import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react'
import { clamp } from '../engine/director'

const smooth = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t) }

export type OdoHandle = { set: (p: number) => void }
type Props = { value: number; decimals?: number; suffix?: string; className?: string }

const Odometer = forwardRef<OdoHandle, Props>(({ value, decimals = 0, suffix = '', className = '' }, ref) => {
  const target = Math.round(value * Math.pow(10, decimals))
  const digits = useMemo(() => String(target).split('').map(Number), [target])
  const cols = useRef<(HTMLSpanElement | null)[]>([])
  useImperativeHandle(ref, () => ({
    set(p: number) {
      const w = target * clamp(p)
      const n = digits.length
      for (let i = 0; i < n; i++) {
        const k = n - 1 - i
        const pw = Math.pow(10, k)
        let pos: number
        if (k === 0) pos = (Math.floor(w) % 10) + smooth(0.55, 1, w - Math.floor(w))
        else {
          const lower = (w / (pw / 10)) % 10
          pos = (Math.floor(w / pw) % 10) + smooth(0, 1, Math.max(0, lower - 9))
        }
        const el = cols.current[i]
        if (el) el.style.transform = `translate3d(0,${-(pos / 11) * 100}%,0)`
      }
    },
  }))
  const out: JSX.Element[] = []
  digits.forEach((_, i) => {
    if (decimals > 0 && i === digits.length - decimals) out.push(<span key={'dot' + i} className="odo-dot">.</span>)
    out.push(
      <span className="odo-win" key={i}>
        <span className="odo-col" ref={(el) => { cols.current[i] = el }}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, j) => <span key={j}>{d}</span>)}
        </span>
      </span>,
    )
  })
  return <span className={'odo ' + className}>{out}{suffix && <span className="odo-suffix">{suffix}</span>}</span>
})
export default Odometer
