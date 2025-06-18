import type { BasicVirtualizerOptions } from '@z-cloud/vitual-vanilla';

export interface VirtualizerOptions<TScrollElement extends HTMLElement | Window>
  extends BasicVirtualizerOptions {
  getScrollElement: () => TScrollElement | null;
}
