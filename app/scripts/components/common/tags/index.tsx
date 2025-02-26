import React from 'react';
import { USWDSTag } from '$uswds';
import './styles.scss';

interface TagsProps {
  items: string[];
  classNames?: string;
}
export const Tags = ({ items, classNames = 'default-veda-tag' }: TagsProps) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap'
      }}
    >
      {items.map((t) => (
        <USWDSTag key={t} className={classNames}>
          {t}
        </USWDSTag>
      ))}
    </div>
  );
};
