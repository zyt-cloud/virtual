import type {
  BrowserVirtualizer,
  VirtualizerOptions,
} from '@z-cloud/virtual-browser';
import type { VirtualItem } from '@z-cloud/virtual-vanilla';

export interface VirtualListProps
  extends Omit<VirtualizerOptions<HTMLElement | Window>, 'getScrollElement'> {
  className?: string;
  itemClassName?: string;
  style?: React.CSSProperties;
  itemStyle?: React.CSSProperties;
  /**
   * 动态尺寸 grid 模式暂不支持
   */
  dynamicSize?: boolean;
  /**
   * girdSize [行尺寸，列尺寸] 提供该值会覆盖 size 配置
   */
  gridSize?: [number, number];
  /**
   * grid 模式
   */
  grid?: boolean;
  /**
   * grid布局时接收第二个参数，列的数据
   * @param item
   * @param colItem
   * @returns
   */
  children: (item: VirtualItem, colItem?: VirtualItem) => React.ReactNode;
  onReady?: (
    virtualizer: BrowserVirtualizer<HTMLElement | Window, HTMLElement>,
    colVirtualizer?: BrowserVirtualizer<HTMLElement | Window, HTMLElement>,
  ) => void;
}
