import { VirtualList, type VirtualizerInstance } from '@z-cloud/virtual-react';
import { useRef } from 'react';
import { randomColors } from '../../utils';

const dynamicSizes = new Array(10000)
  .fill(true)
  .map(() => Math.round(Math.random() * 80 + 80));

export default function DynamicSizeVirtualList() {
  const instanceRef = useRef<VirtualizerInstance>(null);

  return (
    <div>
      <div className="demo-btns">
        <button
          onClick={() =>
            instanceRef.current?.scrollToIndex(3000, { align: 'center' })
          }
        >
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
        size={60}
        gap={8}
        lanes={3}
        onReady={(virtualizer) => {
          instanceRef.current = virtualizer;
        }}
      >
        {({ index }) => (
          <div
            style={{
              height: dynamicSizes[index],
              backgroundColor: randomColors[index % randomColors.length],
            }}
            className={index % 2 ? 'demo-list-odd' : 'demo-list-even'}
          />
        )}
      </VirtualList>
    </div>
  );
}
