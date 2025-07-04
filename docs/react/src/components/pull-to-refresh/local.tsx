import { PullToRefresh, useEventBind } from '@z-cloud/pull-to-refresh/react'

export default function LocalPullToRefresh() {
  const event = useEventBind()

  return (
    <div
      style={{
        position: 'relative',
        padding: 20,
        height: 400,
        overflow: 'auto',
        background: '#f2f2f2',
        border: '1px solid #999',
      }}
      onTouchStart={event.start}
      onTouchMove={event.move}
      onTouchEnd={event.end}
      // PC端使用需要绑定以下事件
      onPointerDown={event.start}
      onPointerMove={event.move}
      onPointerUp={event.end}
    >
      <div>当前属于局部刷新，兼容PC、Mobile</div>
      <br />
      <div>请将当前滚动元素滚动到最顶部，PC端按住鼠标向下拉查看效果</div>
      <PullToRefresh
        event={event}
        onRefresh={() => new Promise((resolve) => setTimeout(() => resolve(true), 3000))}
      />
      <div style={{ height: 2000 }}>我是有很多内容的</div>
    </div>
  )
}
