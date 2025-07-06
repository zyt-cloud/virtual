# PullToRefresh组件

下拉刷新组件，支持页面和局部下拉刷新

## 页面刷新示例

<demo vue="pull-to-refresh/page.vue" />

## 局部刷新示例

> 刷新元素使用绝对定位，请确保滚动元素使用定位

<demo vue="pull-to-refresh/local.vue" />

## 配置项

```ts
{
  /**
   * 刷新阈值 达到该值松手即可刷新
   * @default 50
   */
  refreshThreshold?: number
  /**
   * 最大下拉距离
   * @default 100
   */
  maxPullDistance?: number
  /**
   * 下拉角度,角度大于该值则不触发下拉
   * @default 30
   */
  pullAngle?: number
  /**
   * 加载器大小
   * @default 40
   */
  size?: number
  /**
   * 刷新中回调 返回Promise true则关闭刷新
   * @returns
   */
  onRefresh: () => Promise<boolean>
  /**
   * 是否局部滚动需
   * @default false
   */
  local?: boolean
  onChange?: (instance: PullToRefresh) => void
}
```
