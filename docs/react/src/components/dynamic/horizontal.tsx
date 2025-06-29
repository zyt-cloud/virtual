import { VirtualList, type VirtualizerInstance } from '@z-cloud/virtual-react'
import { useRef } from 'react'

const dynamicSizes = new Array(10000).fill(true).map(() => Math.round(Math.random() * 80 + 80))

export default function ColumnDynamicVirtualList() {
  const instanceRef = useRef<VirtualizerInstance>(null)

  return (
    <div>
      <div className="demo-btns">
        <button onClick={() => instanceRef.current?.scrollToIndex(3000, { align: 'center' })}>
          scrollToIndex(3000) with align center
        </button>
      </div>
      <VirtualList
        style={{ height: 100 }}
        itemClassName="demo-list-item"
        count={10000}
        size={100}
        overscan={5}
        gap={10}
        horizontal
        dynamicSize
        onReady={(virtualizer) => {
          instanceRef.current = virtualizer
        }}
      >
        {({ index }) => (
          <div
            style={{ width: dynamicSizes[index] }}
            className={index % 2 ? 'demo-list-odd' : 'demo-list-even'}
          >
            第 {index} 列
          </div>
        )}
      </VirtualList>
    </div>
  )
}
