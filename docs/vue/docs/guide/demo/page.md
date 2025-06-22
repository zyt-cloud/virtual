# 页面滚动

::: tip
开启跟随页面滚动只需要配置 `followPageScroll` 为 `true`，并且不需要指定 `VirtualList` 的宽度或者高度
:::

当前虚拟列表跟随页面滚动

```vue
<VirtualList
  itemClassName="demo-list-item"
  followPageScroll
  :overscan="4"
  :size="() => randomSize() + 80"
  :count="10000"
  :lanes="2"
  :gap="8"
>
  <template #default="{ index }">
    <div
      :style="{ backgroundColor: randomColors[index % randomColors.length] }"
      :class="index % 2 ? 'demo-list-odd' : 'demo-list-even'"
    />
  </template>
</VirtualList>
```

<demo vue="page/index.vue" />
