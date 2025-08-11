import React from 'react';
import { USWDSTag } from '$uswds';
import './styles.scss';

interface TagsProps {
  items: string[];
  icon?: JSX.Element;
  classNames?: string;
  cardLabel?: boolean;
}
export const Tags = ({
  items,
  icon,
  classNames,
  cardLabel = false
}: TagsProps) => {
  const defaultClassNames = cardLabel
    ? 'card-type-label text-no-uppercase margin-bottom-1 radius-sm'
    : 'veda-tag-labels text-no-uppercase margin-bottom-1 radius-sm';

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap'
      }}
    >
      {items.map((t) => (
        <USWDSTag key={t} className={classNames ?? defaultClassNames}>
          {icon ? (
            <div
              style={{ display: 'flex', alignItems: 'center' }}
              className='card-type-inner-content'
            >
              {icon}
              <p>{t}</p>
            </div>
          ) : (
            t
          )}
        </USWDSTag>
      ))}
    </div>
  );
};
