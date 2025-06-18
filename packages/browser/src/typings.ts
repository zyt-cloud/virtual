import type { BasicVirtualizerOptions } from '@z-cloud/virtual-vanilla';

export interface VirtualizerOptions<TScrollElement extends HTMLElement | Window>
  extends BasicVirtualizerOptions {
  getScrollElement: () => TScrollElement | null;
}
