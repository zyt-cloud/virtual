import { useIsomorphicLayoutEffect, usePullToRefresh } from './hooks/use-pull-to-refresh'
import type { PullToRefreshProps } from './typings'
import classes from '../styles/index.module.css'
import { classnames } from '../lib/utils'
import { useRef } from 'react'
import { useEventBind } from './hooks/use-event-bind'

export function PullToRefresh({
  style,
  local = false,
  className,
  ...restProps
}: PullToRefreshProps) {
  const refreshDomRef = useRef<HTMLDivElement>(null)
  const instance = usePullToRefresh(restProps)
  useEventBind(instance, local ? refreshDomRef : void 0)

  const arcProgress = Math.min(
    Math.max(0, instance.pullDistance) / instance.options.maxPullDistance,
    1,
  )
  const opacity = ['finished', 'initial'].includes(instance.status)
    ? '0'
    : `${Math.min(0.6 + arcProgress, 1)}`

  useIsomorphicLayoutEffect(() => {
    if (!local) {
      document.body.classList.add(classes.hasPullToRefresh!)
    }

    return () => document.body.classList.remove(classes.hasPullToRefresh!)
  }, [])

  useIsomorphicLayoutEffect(() => {
    document.body.classList.toggle(classes.pullToRefreshPulling!, instance.status === 'pulling')

    return () => document.body.classList.remove(classes.pullToRefreshPulling!)
  }, [instance.status])

  return (
    <div
      ref={refreshDomRef}
      style={
        {
          ...style,
          '--delay': `${instance.status === 'pulling' ? -arcProgress : 0}s`,
          transform: `translate(-50%, ${instance.pullDistance}px) scale(${
            instance.status === 'finished' ? 0.4 : 1
          })`,
          opacity,
        } as React.CSSProperties & Record<string, string>
      }
      onTransitionEnd={() => {
        if (instance.status === 'finished') {
          instance.reset()
        }
      }}
      className={classnames(className, classes.refreshWraper, {
        [classes.pageScroll as string]: !local,
      })}
    >
      <svg
        className={classes.indicator}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          className={classnames(classes.circle, classes[instance.status])}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </div>
  )
}
