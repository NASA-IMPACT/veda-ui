import React from 'react';
import styled from 'styled-components';
import Constrainer from '$styles/constrainer';
import { PageMainContent } from '$styles/page';
import { ExplorationMap } from '$components/exploration/components/map';

const DemoExplorationMap = styled(ExplorationMap)`
  height: 40rem;
`;

const Wrapper = styled.div`
  position: relative;
  grid-column: 1 / -1;
  height: 42rem;
`;

const mockDatasets = [
  {
    status: 'success',
    data: {
      id: 'casa-gfed-co2-flux-hr',
      stacApiEndpoint: 'https://ghg.center/api/stac',
      tileApiEndpoint: 'https://ghg.center/api/raster',
      stacCol: 'casagfed-carbonflux-monthgrid-v3',
      name: 'Heterotrophic Respiration (Rh)',
      type: 'raster',
      description:
        'Model-estimated heterotrophic respiration (Rh), which is the flux of carbon from the soil to the atmosphere',
      initialDatetime: 'newest',
      projection: {
        id: 'equirectangular'
      },
      basemapId: 'light',
      zoomExtent: [0, 20],
      sourceParams: {
        assets: 'rh',
        colormap_name: 'purd',
        rescale: [0, 0.3]
      },
      compare: {
        datasetId: 'casagfed-carbonflux-monthgrid-v3',
        layerId: 'casa-gfed-co2-flux-hr'
      },
      legend: {
        unit: {
          label: 'kg Carbon/m²/mon'
        },
        type: 'gradient',
        min: 0,
        max: 0.3,
        stops: [
          '#F7F4F9',
          '#E9E3F0',
          '#D9C3DF',
          '#CDA0CD',
          '#D57ABA',
          '#E34A9F',
          '#DF2179',
          '#C10E51',
          '#92003F',
          '#67001F'
        ]
      },
      parentDataset: {
        id: 'casagfed-carbonflux-monthgrid-v3',
        name: 'CASA-GFED3 Land Carbon Flux'
      },
      isPeriodic: true,
      timeDensity: 'month',
      domain: [
        '2017-09-30T22:00:00.000Z',
        '2017-10-31T23:00:00.000Z',
        '2017-11-30T23:00:00.000Z'
      ]
    },
    error: null,
    settings: {
      isVisible: true,
      opacity: 100,
      analysisMetrics: [
        {
          id: 'mean',
          label: 'Average',
          chartLabel: 'Average',
          themeColor: 'infographicB'
        },
        {
          id: 'std',
          label: 'St Deviation',
          chartLabel: 'St Deviation',
          themeColor: 'infographicD'
        }
      ]
    },
    analysis: {
      status: 'idle',
      error: null,
      data: null,
      meta: {}
    }
  }
];

const mockSelectedDay = new Date('2017-12-01T00:00:00.000Z');
const mockSelectedCompareDay = null;
const mockSetDatasets = () => {};

function SandboxExplorationMap() {
  return (
    <PageMainContent>
      <Constrainer>
        <Wrapper>
          <DemoExplorationMap
            datasets={mockDatasets}
            setDatasets={mockSetDatasets}
            selectedDay={mockSelectedDay}
            selectedCompareDay={mockSelectedCompareDay}
          />
        </Wrapper>
      </Constrainer>
    </PageMainContent>
  );
}

export default SandboxExplorationMap;
