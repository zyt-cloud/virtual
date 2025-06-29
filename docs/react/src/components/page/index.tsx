import { VirtualList, type VirtualizerInstance } from '@z-cloud/virtual-react'
import { useRef } from 'react'

export default function VirtualListWithPageScroll() {
  const instanceRef = useRef<VirtualizerInstance>(null)

  return (
    <div>
      <div className="demo-btns">
        <button onClick={() => instanceRef.current?.scrollToIndex(2000, { behavior: 'smooth' })}>
          scrollToIndex(2000) with smooth
        </button>
        <button onClick={() => instanceRef.current?.scrollToIndex(3000, { align: 'center' })}>
          scrollToIndex(3000) with align center
        </button>
        <button onClick={() => instanceRef.current?.scrollToOffset(3000, 'smooth')}>
          scrollToOffset(3000) with smooth
        </button>
      </div>
      <VirtualList
        itemClassName="demo-list-item"
        count={10000}
        size={(index) => (index % 2 === 0 ? 60 : 120)}
        followPageScroll
        overscan={5}
        onReady={(virtualizer) => {
          instanceRef.current = virtualizer
        }}
      >
        {({ index }) => (
          <div className={index % 2 ? 'demo-list-odd' : 'demo-list-even'}>第 {index} 行</div>
        )}
      </VirtualList>
    </div>
  )
}
