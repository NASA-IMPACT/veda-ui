import React from 'react';
import { GridContainer, Grid } from '@trussworks/react-uswds';

import { useEffect } from 'react';
import {
  LayerSpecification,
  SourceSpecification,
  GeoJSONSourceSpecification
} from 'mapbox-gl';
import LightMap from '$components/common/blocks/light-map';

import useMapStyle from '$components/common/map/hooks/use-map-style';
import useGeneratorParams from '$components/common/map/hooks/use-generator-params';

const sampleGeojson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        coordinates: [
          [
            [-84.4284851853547, 33.78207383698731],
            [-84.4284851853547, 33.729798445954984],
            [-84.34451965871028, 33.729798445954984],
            [-84.34451965871028, 33.78207383698731],
            [-84.4284851853547, 33.78207383698731]
          ]
        ],
        type: 'Polygon'
      }
    }
  ]
};
export function GeoJSONLayer(props) {
  const { id, geojsonData } = props;

  const { updateStyle } = useMapStyle();

  const generatorId = `geojson-layer-${id}`;

  const generatorParams = useGeneratorParams(props);

  useEffect(() => {
    const sources: Record<string, SourceSpecification> = {
      [id]: {
        type: 'geojson',
        data: geojsonData
      } as GeoJSONSourceSpecification
    };

    const layers: LayerSpecification[] = [
      // Line background layer
      {
        id: `${id}-line-bg`,
        type: 'line',
        source: id,
        paint: {
          'line-color': '#f00',
          'line-width': 7
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
  }, [geojsonData, id, generatorId, generatorParams, updateStyle]);

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

  return null;
}

export default function CustomLayerDemo() {
  return (
    <GridContainer>
      <Grid row gap={3}>
        <Grid col={12} className='margin-top-2 margin-bottom-3'>
          <div style={{ width: '800px' }}>
            <LightMap
              stacIDs={['no2-monthly']}
              center={[-84.39, 33.75]}
              zoom={9.5}
              dateTime='2019-06-01'
              // compareDateTime='2021-02-01'
            >
              <GeoJSONLayer
                id='geojson-id'
                geojsonData={sampleGeojson}
                styleOverrides={{
                  lineColor: '#ff4757',
                  fillColor: '#3742fa',
                  fillOpacity: 0.6
                }}
              />
            </LightMap>
          </div>
        </Grid>
      </Grid>
    </GridContainer>
  );
}
