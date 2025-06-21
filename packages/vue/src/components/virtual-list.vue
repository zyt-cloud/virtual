<script setup lang="ts" name="VirtualList">
import type {
  BrowserVirtualizer,
  VirtualizerOptions,
} from '@z-cloud/virtual-browser';
// import type { VirtualItem } from '@z-cloud/virtual-vanilla';
import type { CSSProperties } from 'vue';

export interface VirtualListProps
  extends Omit<VirtualizerOptions<HTMLElement | Window>, 'getScrollElement'> {
  itemClassName?: string;
  itemStyle?: CSSProperties;
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
  // 是否跟随页面滚动， 此时不需要设置虚拟列表高度
  followPageScroll?: boolean;
  onReady?: (
    virtualizer: BrowserVirtualizer<HTMLElement | Window, HTMLElement>,
    colVirtualizer?: BrowserVirtualizer<HTMLElement | Window, HTMLElement>,
  ) => void;
}

const props = withDefaults(defineProps<VirtualListProps>(), {
  dynamicSize: false,
})

console.log(39, props)

</script>

<template>
  <div>
    <div>add test comp</div>

  </div>
</template>
