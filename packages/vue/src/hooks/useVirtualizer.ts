import {
  BrowserVirtualizer,
  type VirtualizerOptions,
} from '@z-cloud/virtual-browser';
import { canUseDom } from '@z-cloud/virtual-vanilla';
import { VirtualListProps } from '../typings';
import { onMounted, type Ref } from 'vue';

function getOffsetTop(ele: HTMLElement | null) {
  if (!ele) {
    return 0;
  }

  let offsetTop = ele.offsetTop;
  let nextEle = ele.offsetParent as HTMLElement;

  while (nextEle) {
    offsetTop += nextEle.offsetTop;
    nextEle = nextEle.offsetParent as HTMLElement;
  }

  return offsetTop;
}

export function useVirualizer(
  {
    onReady,
    onChange,
    followPageScroll,
    ...props
  }: Omit<VirtualListProps, 'children'>,
  containerRef: Ref<HTMLElement | null>,
) {
  const options: VirtualizerOptions<HTMLElement | Window> = {
    getScrollElement: () => (followPageScroll ? window : containerRef.value),
    scrollMargin: followPageScroll ? getOffsetTop(containerRef.value) : 0,
    ...props,
    onChange: (scrolling) => {
      onChange?.(scrolling);
    },
  };

  const virtualizer = new BrowserVirtualizer(options);

  virtualizer.setOptions(options);

  onMounted(() => {});

  return virtualizer;
}
