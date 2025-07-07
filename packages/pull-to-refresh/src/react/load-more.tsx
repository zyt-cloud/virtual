import classes from '../styles/load-more.module.css'

export function LoadMore() {
  return (
    <div className={classes.loadMoreWrapper}>
      {/* <div className={classes.loadMoreLoading}>
        <div className={classes.loadMoreBall}></div>
        <div className={classes.loadMoreBall}></div>
        <div className={classes.loadMoreBall}></div>
        <div className={classes.loadMoreBall}></div>
      </div> */}
      <div className={classes.loader}></div>
    </div>
  )
}
