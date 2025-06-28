import { VirtualListProps } from '../typings'
import { GridVirtualList } from './grid'
import { NormalVirtualList } from './normal'

/**
 * @param param0
 * @returns
 */
export function VirtualList(props: VirtualListProps) {
  if (props.grid) {
    return <GridVirtualList {...props} />
  }

  return <NormalVirtualList {...props} />
}
