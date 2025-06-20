import { VirtualList, type VirtualizerInstance } from '@z-cloud/virtual-react';
import { useRef } from 'react';
import { randomColors, randomSize } from '../../utils';

export default function RowWaterfallVirtualList() {
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
        <button
          onClick={() => instanceRef.current?.scrollToOffset(4000, 'smooth')}
        >
          scrollToOffset(4000) with smooth
        </button>
      </div>
      <VirtualList
        style={{ height: 750, width: 350 }}
        itemClassName="demo-list-item"
        count={10000}
        overscan={4}
        size={(index) => randomSize() + 80}
        lanes={2}
        gap={8}
        onReady={(virtualizer) => {
          instanceRef.current = virtualizer;
        }}
      >
        {({ index }) => (
          <div
            style={{
              backgroundColor: randomColors[index % randomColors.length],
            }}
            className={index % 2 ? 'demo-list-odd' : 'demo-list-even'}
          />
        )}
      </VirtualList>
    </div>
  );
}
