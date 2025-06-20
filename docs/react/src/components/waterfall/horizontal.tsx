import { VirtualList, type VirtualizerInstance } from '@z-cloud/virtual-react';
import { useRef } from 'react';
import { randomRgb, randomSize } from '../../utils';

export default function ColWaterfallVirtualList() {
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
        style={{ height: 400 }}
        itemClassName="demo-list-item"
        count={10000}
        size={(index) => randomSize()}
        lanes={2}
        gap={8}
        horizontal
        onReady={(virtualizer) => {
          instanceRef.current = virtualizer;
        }}
      >
        {({ index }) => (
          <div
            style={{ backgroundColor: randomRgb() }}
            className={index % 2 ? 'demo-list-odd' : 'demo-list-even'}
          ></div>
        )}
      </VirtualList>
    </div>
  );
}
