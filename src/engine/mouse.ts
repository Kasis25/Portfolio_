import { lerp } from './director'
/** Smoothed normalized mouse (-1..1). step() is called from the director's single tick. */
export const mouse = {
  x: 0, y: 0, tx: 0, ty: 0,
  step() { this.x = lerp(this.x, this.tx, 0.05); this.y = lerp(this.y, this.ty, 0.05) },
}
if (typeof window !== 'undefined') {
  addEventListener('mousemove', (e) => { mouse.tx = (e.clientX / innerWidth) * 2 - 1; mouse.ty = (e.clientY / innerHeight) * 2 - 1 })
}
