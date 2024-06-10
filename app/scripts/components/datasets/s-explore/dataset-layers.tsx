import React from 'react';
import styled from 'styled-components';
import { listReset, themeVal } from '@devseed-ui/theme-provider';
import { AccordionManager } from '@devseed-ui/accordion';


import { Layer } from './dataset-layer-single';
import LayerAlert from './layer-alert';
import { InlineLayerLoadingSkeleton } from './layer-loading';
import { S_FAILED, S_IDLE, S_LOADING, S_SUCCEEDED } from '$utils/status';


import { VizDataset } from '$components/exploration/types.d.ts';

const LayerList = styled.ol`
  ${listReset()};

  > li {
    box-shadow: 0 1px 0 0 ${themeVal('color.base-100a')},
      0 -1px 0 0 ${themeVal('color.base-100a')};
    background: ${themeVal('color.surface')};
  }
`;

interface DatasetLayersProps {
  dataset: VizDataset;
  asyncLayers: VizDataset[];
  onAction: (action: string, payload: Record<string, any>) => void;
  selectedLayerId?: string;
}

export default function DatasetLayers(props: DatasetLayersProps) {
  const { dataset, asyncLayers, onAction, selectedLayerId } = props;

  return (
    <AccordionManager>
      <LayerList>
        {asyncLayers.map((l, idx) => {
          // A layer is considered ready when its data and the compare layer
          // data (if any) is also loaded.
          const { status } = l;
          switch (status) {
            case S_IDLE:
            case S_LOADING:
              return (
                /* eslint-disable-next-line react/no-array-index-key */
                <li key={idx}>
                  <InlineLayerLoadingSkeleton />
                </li>
              );
            case S_FAILED: {
              // The order of the asyncLayers is the same as the source layers.
              const sourceLayer = dataset.data.layers[idx];
              return (
                /* eslint-disable-next-line react/no-array-index-key */
                <li key={idx}>
                  <LayerAlert
                    onRetryClick={l.reFetch}
                    name={sourceLayer.name}
                  />
                </li>
              );
            }
            case S_SUCCEEDED: {
              // On succeed the data is never null.
              const lData = l.data!;
              return (
                <li key={lData.id}>
                  <Layer
                    id={lData.id}
                    name={lData.name}
                    info={lData.description}
                    active={lData.id === selectedLayerId}
                    onToggleClick={() => {
                      onAction('layer.toggle', lData);
                    }}
                  />
                </li>
              );
            }
          }
        })}
      </LayerList>
    </AccordionManager>
  );
}
