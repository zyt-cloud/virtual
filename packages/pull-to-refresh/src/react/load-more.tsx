import { classnames } from '../lib/utils'
import classes from '../styles/load-more.module.css'
import type { LoadMoreProps } from './typings'

export function LoadMore({
  loading,
  loadingText,
  finished,
  error,
  className,
  style,
}: LoadMoreProps) {
  const scale = 1.4
  return (
    <div className={classnames(classes.loadMoreWrapper, className)} style={style}>
      {loading && (
        <>
          <div className={classes.loadMoreLoading}>
            <div style={{ '--s1': scale } as any} className={classes.loadMoreBall}></div>
            <div style={{ '--s2': scale } as any} className={classes.loadMoreBall}></div>
            <div style={{ '--s3': scale } as any} className={classes.loadMoreBall}></div>
          </div>
          <div>{loadingText}</div>
        </>
      )}
      {error}
      {finished}
    </div>
  )
}
