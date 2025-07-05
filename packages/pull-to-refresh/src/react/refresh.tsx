import { useIsomorphicLayoutEffect, usePullToRefresh } from './hooks/use-pull-to-refresh'
import type { PullToRefreshProps } from './typings'
import classes from './index.module.css'
import { classnames } from '../lib/utils'

export function PullToRefresh({ style, className, ...restProps }: PullToRefreshProps) {
  const pageScroll = !restProps.getScrollElement
  const instance = usePullToRefresh(restProps)

  const arcProgress = Math.min(
    Math.max(0, instance.pullDistance) / instance.options.maxPullDistance,
    1,
  )
  const opacity = ['finished', 'initial'].includes(instance.status)
    ? '0'
    : `${Math.min(0.6 + arcProgress, 1)}`

  useIsomorphicLayoutEffect(() => {
    if (pageScroll) {
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
        [classes.pageScroll as string]: pageScroll,
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
