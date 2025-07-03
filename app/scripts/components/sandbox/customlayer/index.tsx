import React, { useState } from 'react';
import { GridContainer, Grid } from '@trussworks/react-uswds';

import { useEffect } from 'react';
import {
  LayerSpecification,
  SourceSpecification,
  GeoJSONSourceSpecification
} from 'mapbox-gl';

import { CollecticonShrinkToLeft } from '@devseed-ui/collecticons';
import BlockMap from '$components/common/blocks/block-map';
import { veda_faux_module_datasets } from '$data-layer/datasets';

import useMapStyle from '$components/common/map/hooks/use-map-style';
import useGeneratorParams from '$components/common/map/hooks/use-generator-params';
import useLayerInteraction from '$components/common/map/hooks/use-layer-interaction';
export function GeoJSONLayer(props) {
  const { id, geojsonURL, onClick } = props;

  const { updateStyle } = useMapStyle();

  const generatorId = `geojson-layer-${id}`;

  const generatorParams = useGeneratorParams(props);

  useEffect(() => {
    const sources: Record<string, SourceSpecification> = {
      [id]: {
        type: 'geojson',
        data: geojsonURL
      } as GeoJSONSourceSpecification
    };

    const layers: LayerSpecification[] = [
      {
        id: `${id}-fill`,
        source: id,
        type: 'fill',
        paint: {
          'fill-color': '#eee',
          'fill-opacity': 0.3
        },
        metadata: {
          layerOrderPosition: 'markers'
        }
      },
      {
        id: `${id}-line-bg`,
        source: id,
        type: 'line',
        paint: {
          'line-color': '#666',
          'line-opacity': 0.3,
          'line-width': 3
        },
        metadata: {
          layerOrderPosition: 'markers'
        }
      },
      {
        id: `${id}-line-dash`,
        source: id,
        type: 'line',
        paint: {
          'line-color': '#eee',
          'line-dasharray': [3, 1],
          'line-width': 3
        },
        metadata: {
          layerOrderPosition: 'markers'
        }
      },
      {
        id: `${id}-line-text`,
        source: id,
        type: 'symbol',
        layout: {
          'symbol-placement': 'line',
          'text-field': 'Custom area',
          'text-size': 12
        },
        paint: {
          'text-color': '#222',
          'text-halo-color': '#fff',
          'text-halo-width': 3
        },
        metadata: {
          layerOrderPosition: 'markers'
        }
      }
    ];

    updateStyle({
      generatorId,
      sources,
      layers,
      params: generatorParams
    });
  }, [geojsonURL, id, generatorId, generatorParams, updateStyle]);

  //
  // Cleanup layers on unmount
  //
  useEffect(() => {
    return () => {
      updateStyle({
        generatorId,
        sources: {},
        layers: []
      });
    };
  }, [updateStyle, generatorId]);

  const onPointsClick = (features) => {
    if (features && features.length)
      onClick(JSON.stringify(features[0].properties));
  };
  useLayerInteraction({
    layerId: `${id}-fill`,
    onClick: onPointsClick
  });

  return null;
}

export default function CustomLayerDemo() {
  const [info, setInfo] = useState('');
  return (
    <GridContainer>
      <Grid row gap={3}>
        <Grid col={12} className='margin-top-2 margin-bottom-3'>
          <div style={{ width: '800px' }}>
            <BlockMap
              datasetId='no2'
              layerId='no2-monthly'
              datasets={veda_faux_module_datasets}
              center={[111.383, 42.465]}
              zoom={4}
              dateTime='2019-06-01'
            >
              <GeoJSONLayer
                id='geojson-id'
                geojsonURL='/public/geo-data/sample.geojson'
                onClick={(feature) => {
                  setInfo(feature);
                }}
              />
            </BlockMap>
            {info && <div className='margin-top-1 '>Clicked Info: {info}</div>}
          </div>
        </Grid>
      </Grid>
    </GridContainer>
  );
}
