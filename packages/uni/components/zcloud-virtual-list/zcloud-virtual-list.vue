<script setup lang="ts" name="VirtualList">
import type { VirtualizerInstance } from '../../typings'
import { computed, getCurrentInstance, onMounted, unref, type CSSProperties } from 'vue'
import {
  getRectSizeAsync,
  getScrollViewContextNode,
  getWindowRect,
  virtualizerUUID,
} from '../../utils'
import { useVirualizer } from '../../hooks/use-virtualizer'
import ZcloudResizable from '@z-cloud/resizable-uni/components/zcloud-resizable/zcloud-resizable.vue'
import { useVirtualizerStyle } from '../../hooks/use-virtualizer-style'

// 引用外部type报错 只能内部重新声明一遍
export interface IVirtualListProps {
  /**
   * 列表项数量
   */
  count: number
  /**
   * 每一项的大小，竖向滚动为高度，横向滚动为宽度
   */
  size: number | ((index: number) => number)
  /**
   * 可见范围外两端渲染数量，该值越大出现白屏的概率越小。建议跟随页面滚动的虚拟列表该值可稍微配置大一些。
   * @default 1
   */
  overscan?: number
  /**
   * 动态尺寸 grid 模式暂不支持
   */
  dynamicSize?: boolean
  /**
   * girdSize [行尺寸，列尺寸] 提供该值会覆盖 size 配置
   */
  gridSize?: [number, number]
  /**
   * grid 模式
   */
  grid?: boolean
  // 是否跟随页面滚动， 此时不需要设置虚拟列表高度
  followPageScroll?: boolean
  /**
   * 水平滚动
   * @default false
   */
  horizontal?: boolean
  /**
   * 每项之间的间距
   * @default 0
   */
  gap?: number
  /**
   * 应用于虚拟列表起始位置的padding
   */
  paddingStart?: number
  /**
   * 应用于虚拟列表末尾位置的padding
   */
  paddingEnd?: number
  /**
   * 初始滚动位置
   */
  initialOffset?: number | (() => number)
  /**
   * 滚动元素距离页面顶部的距离
   */
  scrollMargin?: number
  /**
   * 列表被分成的列数或行数 (垂直列表对应列数，水平列表对应行数)
   * @default 1
   */
  lanes?: number
  className?: string
  styles?: CSSProperties
  width?: number | string
  height?: number | string
  itemClassName?: string
  itemStyle?: CSSProperties
  scrollViewProps?: Record<string, any>
}

const props = defineProps<IVirtualListProps>()

const emit = defineEmits<{
  (e: 'ready', virtualizer: VirtualizerInstance, colVritualizer?: VirtualizerInstance): void
}>()

const virtualizerRef = useVirualizer(
  computed(() => ({
    ...unref(props),
    // grid模式可以单独设置行高
    size: props.grid ? props.gridSize?.[1] ?? props.size : props.size,
    // grid模式当前虚拟器只能竖向滚动
    horizontal: props.grid ? false : props.horizontal,
  }))
)
// grid 模式才需要创建列虚拟器
const gridColVirtualizerRef = !props.grid
  ? void 0
  : useVirualizer(
      // grid 模式 单独设置列宽 水平滚动
      computed(() => ({
        ...unref(props),
        size: props.gridSize?.[0] ?? props.size,
        horizontal: true,
      }))
    )

const virtualItems = computed(() => {
  return [
    virtualizerRef.value?.getVirtualItems() ?? [],
    gridColVirtualizerRef?.value?.getVirtualItems() ?? [],
  ]
})

const totalSizes = computed(() => {
  return [
    virtualizerRef.value?.getTotalSize() ?? 0,
    gridColVirtualizerRef?.value?.getTotalSize() ?? 0,
  ]
})

const { scrollElementStyle, contentStyle } = useVirtualizerStyle(props)

const scrollId = `zcoud-virtual-list-${virtualizerUUID.value++}`

const onScroll = (e: any) => {
  virtualizerRef.value?.onScroll(e.detail)
  gridColVirtualizerRef?.value?.onScroll(e.detail)
  props.scrollViewProps?.onScroll?.(e)
}

// 监听页面滚动 子组件直接监听无效
// onPageScroll((e) => {
//   if (props.followPageScroll) {
//     virtualizerRef.value?.onScroll(e)
//   }
// })

const instance = getCurrentInstance()
async function init() {
  const windowRect = getWindowRect()
  const elementRect = await getRectSizeAsync(scrollId)
  const scrollNode: any = await getScrollViewContextNode(scrollId, instance?.proxy)

  virtualizerRef.value!.setScrollElementRect(props.followPageScroll ? windowRect : elementRect)

  virtualizerRef.value!.scrollTo = function (offset, behavior) {
    if (!scrollNode) {
      console.warn('获取scrollNode失败')
      return
    }

    scrollNode.scrollTo({
      [this.options.horizontal ? 'left' : 'top']: offset,
      animated: props.dynamicSize ? false : behavior === 'smooth',
    })
  }

  if (props.followPageScroll) {
    virtualizerRef.value!.options.scrollMargin = elementRect.top ?? 0
    virtualizerRef.value!.scrollTo = (offset, behavior) => {
      uni.pageScrollTo({
        scrollTop: offset,
        // 动态尺寸不支持滚动动画
        duration: behavior === 'smooth' && !props.dynamicSize ? 300 : 0,
      })
    }
  }

  virtualizerRef.value!.init()

  if (props.grid && gridColVirtualizerRef?.value) {
    gridColVirtualizerRef.value.setScrollElementRect(elementRect)
    gridColVirtualizerRef.value.scrollTo = virtualizerRef.value!.scrollTo ?? (() => {})
    gridColVirtualizerRef.value.init()
  }

  emit('ready', virtualizerRef.value!, gridColVirtualizerRef?.value)
}

onMounted(() => {
  if (virtualizerRef.value) {
    init()
  }
})

// 问题记录
// 1，循环slot报警告 More than one slot named "" are found inside a single component instance
// 2，slot自动添加一个view标签导致样式异常
// 3，接口声明在当前文件
// 4, attrs 也异常
// shit
</script>

<template>
  <!-- 两种类型的虚拟列表（一般的虚拟列表和 grid 虚拟列表）合在一个文件，拆开各种问题 -->
  <scroll-view
    :id="scrollId"
    :class="className"
    :style="scrollElementStyle"
    :scroll-x="horizontal"
    :scroll-y="!horizontal"
    enhanced
    v-if="!grid"
    @scroll="onScroll"
  >
    <view
      :style="[
        contentStyle,
        {
          height: horizontal ? '100%' : `${totalSizes[0]}px`,
          width: horizontal ? `${totalSizes[0]}px` : '100%',
        },
      ]"
    >
      <view
        v-for="item in virtualItems[0]"
        v-if="!grid"
        :class="itemClassName"
        :style="{
          overflow: 'hidden',
          ...itemStyle,
          gridArea: `lane${item.lane}`,
          height: horizontal || dynamicSize ? void 0 : `${item.size}px`,
          width: !horizontal || dynamicSize ? void 0 : `${item.size}px`,
          transform: horizontal
            ? `translateX(${item.start}px)`
            : `translateY(${item.start - (virtualizerRef?.options.scrollMargin ?? 0)}px)`,
        }"
      >
        <ZcloudResizable
          v-if="dynamicSize"
          :styles="{ width: '100%' }"
          emit-when-mounted
          @resize="
            (res) =>
              virtualizerRef?.onElementSizeChange(item.index, {
                height: res.height,
                width: res.width,
              })
          "
        >
          <!-- shit 不支持 v-bind 为了和 web 端的包保持一致，逐一展开 -->
          <slot
            :key="item.key"
            :index="item.index"
            :size="item.size"
            :lane="item.lane"
            :start="item.start"
            :end="item.end"
          />
        </ZcloudResizable>
        <slot
          v-else
          :key="item.key"
          :index="item.index"
          :size="item.size"
          :lane="item.lane"
          :start="item.start"
          :end="item.end"
        />
      </view>
    </view>
  </scroll-view>

  <!-- grid 模式 -->
  <scroll-view
    :id="scrollId"
    :class="className"
    v-else
    scroll-x
    scroll-y
    ehanced
    :style="scrollElementStyle"
    @scroll="onScroll"
  >
    <view
      class="scroll-container"
      :style="{
        height: `${totalSizes[0]}px`,
        width: `${totalSizes[1]}px`,
      }"
    >
      <template v-if="grid" v-for="rowItem in virtualItems[0]">
        <view
          v-for="colItem in virtualItems[1]"
          :class="itemClassName"
          :style="{
            ...itemStyle,
            gridArea: 'item',
            height: `${rowItem.size}px`,
            width: `${colItem.size}px`,
            transform: `translate(${colItem.start}px,${rowItem.start}px)`,
          }"
        >
          <slot name="grid" :rowItem="rowItem" :colItem="colItem" />
        </view>
      </template>
    </view>
  </scroll-view>
</template>

<style scoped>
.scroll-container {
  display: grid;
  grid-template-areas: 'item';
}
</style>
