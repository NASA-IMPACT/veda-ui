import React from 'react';
import DataLayerCardContainer from './data-layer-card-container';
import { TimelineDataset } from '$components/exploration/types.d.ts';

interface CardProps {
  dataset: TimelineDataset;
}

export default function DataLayerCard(props: CardProps) {
  return <DataLayerCardContainer {...props} />;
}
