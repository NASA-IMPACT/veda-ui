import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { listReset, themeVal } from '@devseed-ui/theme-provider';
import { AccordionManager } from '@devseed-ui/accordion';

import { S_FAILED, S_LOADING, S_SUCCEEDED } from '$utils/status';
import { checkLayerLoadStatus } from '$components/common/mapbox/layers/utils';
import { Layer } from './dataset-layer-single';
import LayerAlert from './layer-alert';
import { InlineLayerLoadingSkeleton } from './layer-loading';

const LayerList = styled.ol`
  ${listReset()};

  > li {
    box-shadow: 0 1px 0 0 ${themeVal('color.base-100a')},
      0 -1px 0 0 ${themeVal('color.base-100a')};
    background: ${themeVal('color.surface')};
  }
`;

export default function DatasetLayers(props) {
  const { asyncLayers, onAction, selectedLayerId } = props;

  return (
    <AccordionManager>
      <LayerList>
        {asyncLayers.map((l, idx) => {
          // A layer is considered ready when its data and the compare layer
          // data (if any) is also loaded.
          const status = checkLayerLoadStatus(l);
          switch (status) {
            case S_LOADING:
              return (
                /* eslint-disable-next-line react/no-array-index-key */
                <li key={idx}>
                  <InlineLayerLoadingSkeleton />
                </li>
              );
            case S_FAILED:
              return (
                /* eslint-disable-next-line react/no-array-index-key */
                <li key={idx}>
                  <LayerAlert onRetryClick={l.reFetch} />
                </li>
              );
            case S_SUCCEEDED:
              return (
                <li key={l.baseLayer.data.id}>
                  <Layer
                    id={l.baseLayer.data.id}
                    name={l.baseLayer.data.name}
                    info={l.baseLayer.data.description}
                    active={l.baseLayer.data.id === selectedLayerId}
                    onToggleClick={() => {
                      onAction('layer.toggle', l.baseLayer.data);
                    }}
                  />
                </li>
              );
          }
        })}
      </LayerList>
    </AccordionManager>
  );
}

DatasetLayers.propTypes = {
  asyncLayers: T.array,
  onAction: T.func,
  selectedLayerId: T.string
};
