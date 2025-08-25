import React from 'react';
import { PrimitiveAtom } from 'jotai';
import DataLayerCardContainer from './data-layer-card-container';
import {
  LayerLegendCategorical,
  LayerLegendGradient,
  LayerLegendText
} from '$types/veda';
import { TimelineDataset } from '$components/exploration/types.d.ts';

interface CardProps {
  dataset: TimelineDataset;
}

export default function DataLayerCard(props: CardProps) {
  return <DataLayerCardContainer {...props} />;
}
