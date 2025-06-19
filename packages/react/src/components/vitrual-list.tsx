import { VirtualListProps } from '../typings';
import { useVirualizer } from '../hooks/useVirtualizer';
import { GridVirtualList } from './grid';
import { NormalVirtualList } from './normal';

/**
 * @param param0
 * @returns
 */
export function VirtualList(props: VirtualListProps) {
  if (props.grid) {
    return <GridVirtualList {...props} />;
  }

  return <NormalVirtualList {...props} />;
}
