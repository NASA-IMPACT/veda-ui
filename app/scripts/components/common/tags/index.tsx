import React from 'react';
import { USWDSTag } from '$uswds';
import './styles.scss';

interface TagsProps {
  items: string[];
  icon?: JSX.Element;
  classNames?: string;
}
export const Tags = ({
  items,
  icon,
  classNames = 'default-veda-tag text-no-uppercase'
}: TagsProps) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap'
      }}
    >
      {items.map((t) => (
        <USWDSTag key={t} className={classNames}>
          {icon ? (
            <div
              style={{ display: 'flex', alignItems: 'center' }}
              className='label-tag'
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
