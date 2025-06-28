import { computed, unref, type CSSProperties, type MaybeRef } from 'vue'
import type { IVirtualListProps } from '../components/zcloud-virtual-list/zcloud-virtual-list.vue'

export function useVirtualizerStyle(options: MaybeRef<IVirtualListProps>) {
  const gridAreas = computed(() => {
    const props = unref(options)

    const gridAreas = Array.from({ length: props.lanes ?? 1 }, (_, index) =>
      props.horizontal ? `"lane${index}"` : `lane${index}`
    ).join(' ')

    return props.horizontal ? gridAreas : `"${gridAreas}"`
  })

  const scrollElementStyle = computed<CSSProperties>(() => {
    const props = unref(options)
    return {
      width: props.width ? `${Number.isNaN(+props.width) ? props.width : props.width + 'px'}` : '100%',
      height: props.height ? `${Number.isNaN(+props.height) ? props.height : props.height + 'px'}` : 'auto',
      ...props.styles,
    }
  })

  const contentStyle = computed<CSSProperties>(() => {
    const props = unref(options)
    const { lanes = 1, dynamicSize, horizontal, gap } = props

    return {
      display: 'grid',
      gridTemplateAreas: gridAreas.value,
      gridTemplateColumns: `repeat(${horizontal ? 1 : lanes}, 1fr)`,
      gridTemplateRows: `repeat(${horizontal ? lanes : 1}, 1fr)`,
      alignItems: dynamicSize && !horizontal ? 'start' : 'stretch',
      justifyItems: dynamicSize && horizontal ? 'start' : 'stretch',
      columnGap: horizontal ? 0 : `${gap ?? 0}px`,
      rowGap: horizontal ? `${gap ?? 0}px` : 0,
    }
  })

  return {
    scrollElementStyle,
    contentStyle,
  }
}
