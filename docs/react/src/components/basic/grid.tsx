import { VirtualList, type VirtualizerInstance } from '@z-cloud/virtual-react';
import { useRef } from 'react';

export default function GridVirtualList() {
  const instanceRef = useRef<VirtualizerInstance>(null);

  return (
    <div>
      <div className="demo-btns">
        <button
          onClick={() =>
            instanceRef.current?.scrollToIndex(2000, { behavior: 'instant' })
          }
        >
          scrollToIndex(2000)
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
        style={{ height: 400, width: 600, fontSize: 14 }}
        itemClassName="demo-list-item"
        count={10000}
        size={60}
        grid
        gridSize={[100, 40]}
        gap={10}
        overscan={5}
        onReady={(virtualizer) => {
          instanceRef.current = virtualizer;
        }}
      >
        {({ index }, colItem) => (
          <div className={index % 2 ? 'demo-list-odd' : 'demo-list-even'}>
            cell {index},{colItem?.index}
          </div>
        )}
      </VirtualList>
    </div>
  );
}
