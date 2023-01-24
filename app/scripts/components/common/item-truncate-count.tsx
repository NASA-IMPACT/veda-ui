import React from 'react';

interface ItemTruncateCountProps {
  items: React.ReactNode[];
  max?: number;
}

export default function ItemTruncateCount(props: ItemTruncateCountProps) {
  const { items, max = 2 } = props;

  if (!items.length) return <React.Fragment />;
  if (items.length === 1) return <>{items[0]}</>;

  const toRender = items.slice(0, max);
  const remaining = items.slice(max);

  if (!remaining.length) {
    return (
      <>
        {toRender.slice(0, -1).join(', ')} and {toRender.last}
      </>
    );
  }

  return (
    <>
      {toRender.join(', ')} (+{remaining.length})
    </>
  );
}
