# 配置项

:::note
`count`、`size` 为必须配置项，其余可选
:::

```ts title="VirtualListProps"
{
  // 列表项数量
  count: number;
  // 每一项的大小，竖向滚动为高度，横向滚动为宽度，动态尺寸也需要配置一个预估尺寸
  size: number | ((index: number) => number);
  /**
   * 可见范围外两端渲染数量，该值越大出现白屏的概率越小。建议跟随页面滚动的虚拟列表该值可稍微配置大一些。
   * @default 1
   */
  overscan?: number;
  /**
   * 水平滚动 开启 grid 时该配置无效
   * @default false
   */
  horizontal?: boolean;
  /**
   * 每项之间的间距
   * @default 0
   */
  gap?: number;
  /**
   * 应用于虚拟列表起始位置的padding
   */
  paddingStart?: number;
  /**
   * 应用于虚拟列表末尾位置的padding
   */
  paddingEnd?: number;
  /**
   * 初始滚动位置
   */
  initialOffset?: number | (() => number);
  /**
   * 列表被分成的列数或行数 (垂直列表对应列数，水平列表对应行数)
   * @default 1
   */
  lanes?: number;
  // 动态尺寸 grid 模式暂不支持
  dynamicSize?: boolean;
  // grid 模式
  grid?: boolean;
  // grid模式下配置单元的宽高 [width, height] 提供该值会覆盖 size 配置
  gridSize?: [number, number];
  // 是否跟随页面滚动， 此时不需要设置虚拟列表高度
  followPageScroll?: boolean;
  // 容器className
  className?: string;
  // 每一项的className
  itemClassName?: string;
  // 容器style
  style?: React.CSSProperties;
  // 每一项的style
  itemStyle?: React.CSSProperties;
  /**
   * 自定义每一项的 Key 值， 如React中的key
   * @param index 当前项的索引
   * @returns
   */
  getItemKey?: (index: number) => Key;
  /**
   * 自定义截取范围
   * @param range
   * @returns
   */
  customeRange?: (range: Range) => number[];
  /**
   * 元素滚动 尺寸变化等时调用
   * @param scrolling 是否滚动中
   * @returns
   */
  onChange?: (scrolling: boolean) => void;
  /**
   * grid布局时接收第二个参数，列的数据
   */
  children: (item: VirtualItem, colItem?: VirtualItem) => React.ReactNode;
  // 虚拟器实例可用
  onReady?: (
    virtualizer: BrowserVirtualizer<HTMLElement | Window, HTMLElement>,
  ) => void;
}
```
