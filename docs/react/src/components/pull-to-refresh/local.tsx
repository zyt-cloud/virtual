import { PullToRefresh } from '@z-cloud/pull-to-refresh/react'
import { useRef } from 'react'

export default function LocalPullToRefresh() {
  const scrollElementRef = useRef<HTMLDivElement>(null)

  return (
    <div
      style={{
        padding: 20,
        height: 400,
        overflow: 'auto',
        background: '#f2f2f2',
        border: '1px solid #999',
      }}
      ref={scrollElementRef}
    >
      <div>当前属于局部刷新，兼容PC、Mobile</div>
      <br />
      <div>请将当前滚动元素滚动到最顶部，PC端按住鼠标向下拉查看效果</div>
      <PullToRefresh
        getScrollElement={() => scrollElementRef.current}
        onRefresh={() => new Promise((resolve) => setTimeout(() => resolve(true), 3000))}
      />
      <div style={{ height: 2000 }}>我是有很多内容的</div>
    </div>
  )
}
