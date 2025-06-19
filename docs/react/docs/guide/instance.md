# 虚拟器实例

通过组件 `onReady` 可获取虚拟列表实例

## `scrollToIndex`

```ts
scrollToIndex(index: number, options?: ScrollToIndexOptions)
```

滚动到指定索引，固定尺寸支持配置 `behavior: smooth` 配置

## `scrollToOffset`

```ts
scrollToOffset(offset: number, options?: ScrollToIndexOptions)
```

滚动到指定便宜，固定尺寸支持配置 `behavior: smooth` 配置

## `getTotalSize`

```ts
getTotalSize();
```

获取虚拟列表总的大小

## `getVirtualItems`

```ts
getVirtualItems();
```

获取当前有效的虚拟项

## `getVirtualIndexes`

```ts
getVirtualIndexes();
```

获取当前有效的虚拟项索引
