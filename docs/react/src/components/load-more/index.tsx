import { LoadMore } from '@z-cloud/pull-to-refresh/react'

export default function LoadMoreDemo() {
  return (
    <div>
      <LoadMore loading />
      <hr />
      <br />
      <h2>设置颜色、大小、加载文本</h2>
      <LoadMore
        style={
          {
            '--load-more-ball-size': '14px',
            '--load-more-ball-color': '#f20',
            color: '#f20',
          } as Record<string, any>
        }
        loading
        loadingText="加载中..."
      />
      <hr />
      <br />
      <h2>finished</h2>
      <LoadMore finished="没有更多了" />
      <hr />
      <br />
      <h2>error</h2>
      <LoadMore error={<a>加载失败，点击重试</a>} />
    </div>
  )
}
