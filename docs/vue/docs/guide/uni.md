# uni-app

## 使用须知

uni-app 你可以直接使用组件，与web Vue用法一致

但由于小程序诸多限制，(如循环 slot 异常，作用域插槽自动添加一层 view 标签等)。所以组件关闭 key，动态尺寸以及 grid 性能较差。

针对这种情况，你可以参考[这个仓库](https://github.com/zyt-cloud/virtual-list-uni-demo)的 uni-app 示例，直接复制使用。

## 注意事项

跟随页面滚动的虚拟列表需要在页面注册 `onPageScroll` 事件，具体如下

> `Taro React` 不需要的原因是两者实现组件渲染的方式不一致

```ts
onPageScroll((e) => {
  instanceRef.value?.onScroll(e)
})
```
