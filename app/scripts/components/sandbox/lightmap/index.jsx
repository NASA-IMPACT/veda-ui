import React from 'react';
import { GridContainer, Grid } from '@trussworks/react-uswds';
import LightMap from '$components/common/blocks/light-map';

const layers = [
  {
    status: 'idle',
    data: {
      id: 'no2-monthly',
      stacCol: 'no2-monthly',
      name: 'No2 PT',
      media: {
        src: 'http://localhost:9000/img-placeholder-3.c86f9553.jpg?1748981500503',
        alt: 'Placeholder Image'
      },
      type: 'raster',
      projection: {
        id: 'polarNorth'
      },
      bounds: [-10, 36, -5, 42],
      description:
        'Levels in 10¹⁵ molecules cm⁻². Darker colors indicate higher nitrogen dioxide (NO₂) levels associated and more activity. Lighter colors indicate lower levels of NO₂ and less activity.',
      zoomExtent: [0, 20],
      sourceParams: {
        resampling_method: 'bilinear',
        bidx: 1,
        color_formula: 'gamma r 1.05',
        colormap_name: 'coolwarm',
        rescale: [0, 15000000000000000]
      },
      compare: {
        datasetId: 'nighttime-lights',
        layerId: 'nightlights-hd-monthly'
      },
      legend: {
        unit: {
          label: 'Molecules cm3'
        },
        type: 'text',
        min: 'Less',
        max: 'More',
        stops: [
          '#99c5e0',
          '#f9eaa9',
          '#f7765d',
          '#c13b72',
          '#461070',
          '#050308'
        ]
      },
      parentDataset: {
        id: 'no2'
      }
    }
  },
  {
    status: 'idle',
    data: {
      id: 'nightlights-hd-monthly',
      stacCol: 'nightlights-hd-monthly',
      name: 'Nightlights Monthly',
      type: 'raster',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sodales semper risus, suscipit varius diam facilisis non.',
      zoomExtent: [4, 16],
      sourceParams: {
        bidx: 1,
        colormap_name: 'inferno',
        rescale: [0, 255]
      },
      legend: {
        type: 'gradient',
        min: 'Less',
        max: 'More',
        stops: ['#08041d', '#1f0a46', '#52076c', '#f57c16', '#f7cf39']
      },
      parentDataset: {
        id: 'nighttime-lights'
      }
    }
  }
];

export default function LightMapDemo() {
  return (
    <GridContainer>
      <Grid row gap={3}>
        <Grid col={12} className='margin-top-2 margin-bottom-3'>
          <div style={{ width: '800px' }}>
            <LightMap
              layerProps={layers}
              center={[-84.39, 33.75]}
              zoom={9.5}
              dateTime='2019-06-01'
            />
          </div>
        </Grid>
      </Grid>
    </GridContainer>
  );
}
