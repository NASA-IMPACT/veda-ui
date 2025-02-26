import React from 'react';
import { CardProps } from './types';
import BaseCard from '.';

export default function DefaultCard(props: CardProps) {
  const defaultGridLayout = props.gridLayout
    ? props.gridLayout
    : { desktop: { col: 3 } };
  return <BaseCard {...props} gridLayout={defaultGridLayout} />;
}
