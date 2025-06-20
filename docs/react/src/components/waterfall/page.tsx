import { VirtualList } from '@z-cloud/virtual-react';

export default function VirtualListWithPageScroll() {
  return (
    <div>
      <VirtualList
        itemClassName="demo-list-item"
        count={3000}
        gap={8}
        size={(index) => (index % 2 === 0 ? 60 : 120)}
        lanes={4}
        followPageScroll
        overscan={5}
      >
        {({ index }) => (
          <div className={index % 2 ? 'demo-list-odd' : 'demo-list-even'}>
            第 {index} 行
          </div>
        )}
      </VirtualList>
    </div>
  );
}
