import { VirtualList, type VirtualizerInstance } from '@z-cloud/virtual-react';
import { useRef } from 'react';

export default function ColumnVirtualList() {
  const instanceRef = useRef<VirtualizerInstance>(null);

  return (
    <div>
      <div className="demo-btns">
        <button
          onClick={() =>
            instanceRef.current?.scrollToIndex(2000, { behavior: 'smooth' })
          }
        >
          scrollToIndex(2000) with smooth
        </button>
        <button
          onClick={() =>
            instanceRef.current?.scrollToIndex(3000, { align: 'center' })
          }
        >
          scrollToIndex(3000) with align center
        </button>
      </div>
      <VirtualList
        style={{ height: 100 }}
        itemClassName="demo-list-item"
        count={10000}
        size={100}
        horizontal
        onReady={(virtualizer) => {
          instanceRef.current = virtualizer;
        }}
      >
        {({ index }) => (
          <div className={index % 2 ? 'demo-list-odd' : 'demo-list-even'}>
            第 {index} 列
          </div>
        )}
      </VirtualList>
    </div>
  );
}
