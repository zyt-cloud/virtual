import type { LikeEvent } from '../typings'

export function getPullAngle(event: LikeEvent, startPos: { x: number; y: number }) {
  const deltaX = event.clientX - startPos.x
  const deltaY = event.clientY - startPos.y
  return Math.atan2(deltaY, deltaX) * (180 / Math.PI)
}

export function classnames(...args: (string | undefined | Record<string, boolean>)[]) {
  const cls = []

  for (const arg of args) {
    if (typeof arg === 'string') {
      cls.push(arg)
      continue
    }

    if (typeof arg === 'object') {
      Object.entries(arg).forEach(([key, value]) => {
        if (value) {
          cls.push(key)
        }
      })
    }
  }
  return cls.join(' ')
}
