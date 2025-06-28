import { useLayoutEffect, useReducer, useState } from 'react'
import { flushSync } from 'react-dom'
import { MiniVirtualizer, type VirtualizerOptions } from '@z-cloud/virtual-mini'

import { VirtualListProps } from '../typings'

export const useIsomorphicLayoutEffect = useLayoutEffect //canUseDom ? useLayoutEffect : useEffect

export function useVirualizer({
  onReady,
  onChange,
  scrollMargin,
  ...props
}: Omit<VirtualListProps, 'children'>) {
  const rerender = useReducer(() => ({}), {})[1]

  const options: VirtualizerOptions = {
    scrollMargin: scrollMargin ?? 0,
    ...props,
    onChange: (scrolling) => {
      if (scrolling) {
        flushSync(rerender)
      } else {
        rerender()
      }
      onChange?.(scrolling)
    },
  }

  const [virtualizer] = useState(() => new MiniVirtualizer(options))

  virtualizer.setOptions(options)

  return virtualizer
}
