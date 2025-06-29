import { VirtualList, type VirtualizerInstance } from '@z-cloud/virtual-react'
import { useRef } from 'react'

const dynamicSizes = new Array(10000).fill(true).map(() => Math.round(Math.random() * 80 + 60))

export default function DynamicSizeVirtualList() {
  const instanceRef = useRef<VirtualizerInstance>(null)

  return (
    <div>
      <div className="demo-btns">
        <button onClick={() => instanceRef.current?.scrollToIndex(3000, { align: 'center' })}>
          scrollToIndex(3000) with align center
        </button>
        <button onClick={() => instanceRef.current?.scrollToOffset(4000)}>
          scrollToOffset(4000)
        </button>
      </div>
      <VirtualList
        style={{ height: 400 }}
        itemClassName="demo-list-item"
        count={10000}
        dynamicSize
        overscan={5}
        gap={10}
        size={60}
        onReady={(virtualizer) => {
          instanceRef.current = virtualizer
        }}
      >
        {({ index }) => (
          <div
            style={{ height: dynamicSizes[index] }}
            className={index % 2 ? 'demo-list-odd' : 'demo-list-even'}
          >
            第 {index} 行
          </div>
        )}
      </VirtualList>
    </div>
  )
}
