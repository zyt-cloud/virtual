import classes from '../styles/load-more.module.css'

export function LoadMore() {
  return (
    <div className={classes.loadMoreWrapper}>
      <div className={classes.loadMoreLoading}>
        <div style={{ '--delay': '0s' } as any} className={classes.loadMoreBall}></div>
        <div style={{ '--delay': '0.2s' } as any} className={classes.loadMoreBall}></div>
        <div style={{ '--delay': '0.4s' } as any} className={classes.loadMoreBall}></div>
      </div>
      <div>加载中...</div>
    </div>
  )
}
