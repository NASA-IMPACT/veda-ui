import React from 'react';
import { CardProps } from './types';
import BaseCard from '.';

type FlagCardProps = CardProps & {
  layout?: 'flagDefault' | 'flagMediaRight';
};

export default function FlagCard(props: FlagCardProps) {
  const defaultLayout = props.layout ? props.layout : 'flagDefault';
  const defaultGridLayout = props.gridLayout
    ? props.gridLayout
    : { desktop: { col: 12 } }; // Full Width
  return (
    <BaseCard
      {...props}
      layout={defaultLayout}
      gridLayout={defaultGridLayout}
    />
  );
}
