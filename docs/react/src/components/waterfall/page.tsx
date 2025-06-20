import { VirtualList } from '@z-cloud/virtual-react';
import { randomColors, randomSize } from '../../utils';

export default function VirtualListWithPageScroll() {
  return (
    <div>
      <VirtualList
        itemClassName="demo-list-item"
        count={2000}
        gap={8}
        size={(index) => randomSize() + 80}
        lanes={4}
        followPageScroll
        overscan={5}
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
