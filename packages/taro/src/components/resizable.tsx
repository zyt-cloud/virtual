import { View } from '@tarojs/components'
import Taro, { type IntersectionObserver, getCurrentInstance } from '@tarojs/taro'
import { useLayoutEffect, useState, type CSSProperties } from 'react'
import { getRectSizeAsync } from '../utils'

export type ResizeResult = IntersectionObserver.RelativeRectResult & {
  width: number
  height: number
}

type ResizableProps = {
  children: React.ReactNode
  listId: string
  emitWhenMounted?: boolean
  className?: string
  style?: CSSProperties
  onResize?: (res: ResizeResult) => void
}

const flexStyle: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  zIndex: -10,
  visibility: 'hidden',
  pointerEvents: 'none',
}

export function Resizable({
  children,
  className,
  style,
  emitWhenMounted,
  listId,
  onResize,
}: ResizableProps) {
  const [rect, setRect] = useState({ width: 0, height: 0 })

  const resizeId = `resize-${listId}`
  const resizeFlexClass = `resize-flex-${listId}`

  const [instance] = useState(() => getCurrentInstance())

  useLayoutEffect(() => {
    let observer: Taro.IntersectionObserver | null
    const init = async () => {
      const res = await getRectSizeAsync(resizeId)
      if (res) {
        setRect({ width: res.width, height: res.height })
        if (emitWhenMounted) {
          onResize?.(res as ResizeResult)
        }

        observer = Taro.createIntersectionObserver(instance.page!, {
          observeAll: true,
          // @ts-ignore
          nativeMode: true,
        })

        observer.relativeTo(`#${resizeId}`).observe(`.${resizeFlexClass}`, (res) => {
          if (!res.relativeRect) {
            return
          }
          // TODO 微信文档这里的res 包含 width 和 height，但uni-app类型提示没有，暂时这样计算width 和 height
          const nextRect = {
            width: res.relativeRect.right - res.relativeRect.left,
            height: res.relativeRect.bottom - res.relativeRect.top,
          }

          setRect((prevRect) => {
            if (nextRect.width !== prevRect.width || nextRect.height !== prevRect.height) {
              onResize?.({ ...res.relativeRect!, width: nextRect.width, height: nextRect.height })
              return nextRect
            }
            return prevRect
          })
        })
      }
    }

    init()

    return () => {
      observer?.disconnect()
      observer = null
    }
  }, [])

  const { width, height } = rect

  return (
    <View
      id={resizeId}
      className={className}
      style={{ position: 'relative', width: 'fit-content', ...style }}
    >
      {children}
      <View
        className={resizeFlexClass}
        style={{ ...flexStyle, left: width - 1, top: height - 1 }}
      />
      <View className={resizeFlexClass} style={{ ...flexStyle, left: width - 1, top: height }} />
      <View className={resizeFlexClass} style={{ ...flexStyle, left: width, top: height - 1 }} />
    </View>
  )
}
