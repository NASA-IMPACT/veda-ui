import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAtom, useSetAtom } from 'jotai';
import LineGraph from '../../line-graph';
import Constrainer from '$styles/constrainer';
import { PageMainContent } from '$styles/page';
import AOIControl from '$components/common/map/controls/aoi/aoi-control';

import { MapWithDefaultControls } from '$components/exploration/components/map';
import AoiLayer from '$components/exploration/components/map/aoi-layer';
import { externalDatasetsAtom } from '$components/exploration/atoms/datasetLayers';
import useTimelineDatasetAtom from '$components/exploration/hooks/use-timeline-dataset-atom.tsx';
import { useAnalysisDataRequestWithParams } from '$components/exploration/hooks/use-analysis-data-request';
import { DataLayerCardWithDefaultOption } from '$components/exploration/components/datasets/dataset-list-item';
// const DemoExplorationMap = styled(ExplorationMap)`
//   height: 40rem;
// `;/Users/hanbyul/ds/git/veda-config/.veda/ui/app/scripts/components/exploration/components/datasets/dataset-list-item.tsx

const Wrapper = styled.div`
  position: relative;
  grid-column: 1 / -1;
  height: 42rem;
`;

const mockRawData = [
  {
    id: 'casagfed-carbonflux-monthgrid-v3',
    name: 'CASA-GFED3 Land Carbon Flux',
    description:
      'Global, monthly 0.5 degree resolution carbon fluxes from Net Primary Production (NPP), heterotrophic respiration (Rh), wildfire emissions (FIRE), and fuel wood burning emissions (FUEL) derived from the CASA-GFED model, version 3',
    usage: [
      {
        url: 'https://us-ghg-center.github.io/ghgc-docs/cog_transformation/casagfed-carbonflux-monthgrid-v3.html',
        label:
          'Notebook showing data transformation to COG for ingest to the US GHG Center',
        title: 'Data Transformation Notebook'
      },
      {
        url: 'https://us-ghg-center.github.io/ghgc-docs/user_data_notebooks/casagfed-carbonflux-monthgrid-v3_User_Notebook.html',
        label: 'Notebook to read, visualize, and explore data statistics',
        title: 'Sample Data Notebook'
      },
      {
        url: 'https://hub.ghg.center/hub/user-redirect/git-pull?repo=https%3A%2F%2Fgithub.com%2FUS-GHG-Center%2Fghgc-docs&urlpath=tree%2Fghgc-docs%2Fuser_data_notebooks%2Fcasagfed-carbonflux-monthgrid-v3_User_Notebook.ipynb&branch=main',
        label: 'Run example notebook',
        title:
          'Interactive Session in the US GHG Center JupyterHub (requires account)'
      },
      {
        url: 'https://dljsq618eotzp.cloudfront.net/browseui/index.html#casagfed-carbonflux-monthgrid-v3/',
        label: 'Browse and download the data',
        title: 'Data Browser'
      }
    ],
    media: {
      src: 'http://localhost:9000/east_coast_mar_20.4824888d.jpg?1753816512898',
      alt: 'wildfire',
      author: {
        name: 'Marcus Kauffman'
      }
    },
    taxonomy: [
      {
        name: 'Topics',
        values: [
          {
            id: 'natural-emissions-and-sinks',
            name: 'Natural Emissions and Sinks'
          }
        ]
      },
      {
        name: 'Source',
        values: [
          {
            id: 'nasa',
            name: 'NASA'
          }
        ]
      },
      {
        name: 'Gas',
        values: [
          {
            id: 'co₂',
            name: 'CO₂'
          }
        ]
      },
      {
        name: 'Product Type',
        values: [
          {
            id: 'model-output',
            name: 'Model Output'
          }
        ]
      }
    ],
    infoDescription:
      '<ul><li>Temporal Extent: January 2000 - December 2021</li><li>Temporal Resolution: Monthly</li><li>Spatial Extent: Global</li><li>Spatial Resolution: 1 km x 1 km</li><li>Data Units: Tons of carbon per 1 km x 1 km cell (monthly total)</li><li>Data Type: Research</li><li>Data Latency: Updated annually, following the release of an updated [BP Statistical Review of World Energy report]</li></ul>',
    layers: [
      {
        id: 'casa-gfed-co2-flux',
        stacApiEndpoint: 'https://earth.gov/ghgcenter/api/stac',
        tileApiEndpoint: 'https://earth.gov/ghgcenter/api/raster',
        stacCol: 'casagfed-carbonflux-monthgrid-v3',
        name: 'Net Primary Production (NPP)',
        type: 'raster',
        description:
          'Model-estimated net primary production (NPP), which is the amount of carbon available from plants',
        initialDatetime: 'newest',
        projection: {
          id: 'equirectangular'
        },
        basemapId: 'light',
        zoomExtent: [0, 20],
        sourceParams: {
          assets: 'npp',
          rescale: [0, 0.3]
        },
        compare: {
          datasetId: 'nighttime-lights',
          layerId: 'nightlights-hd-monthly'
        },
        legend: {
          unit: {
            label: 'kg Carbon/m²/mon'
          },
          type: 'gradient',
          min: 0,
          max: 0.3,
          stops: ['#000000', '#FFFFFF']
        },
        info: {
          source: 'NASA',
          spatialExtent: 'Global',
          temporalResolution: 'Monthly',
          unit: '10¹⁵ molecules cm⁻²'
        },
        parentDataset: {
          id: 'casagfed-carbonflux-monthgrid-v3'
        }
      },
      {
        id: 'casa-gfed-co2-flux-hr',
        stacApiEndpoint: 'https://earth.gov/ghgcenter/api/stac',
        tileApiEndpoint: 'https://earth.gov/ghgcenter/api/raster',
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
          colormap_name: 'blues',
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
          id: 'casagfed-carbonflux-monthgrid-v3'
        }
      },
      {
        id: 'casa-gfed-co2-flux-nee',
        stacApiEndpoint: 'https://earth.gov/ghgcenter/api/stac',
        tileApiEndpoint: 'https://earth.gov/ghgcenter/api/raster',
        stacCol: 'casagfed-carbonflux-monthgrid-v3',
        name: 'Net Ecosystem Exchange (NEE)',
        type: 'raster',
        description:
          'Model-estimated net ecosystem exchange (NEE), which is the net carbon flux to the atmosphere',
        initialDatetime: 'newest',
        projection: {
          id: 'equirectangular'
        },
        basemapId: 'light',
        zoomExtent: [0, 20],
        sourceParams: {
          assets: 'nee',
          colormap_name: 'seismic',
          rescale: [-0.1, 0.1]
        },
        compare: {
          datasetId: 'casagfed-carbonflux-monthgrid-v3',
          layerId: 'casa-gfed-co2-flux-nee'
        },
        legend: {
          unit: {
            label: 'kg Carbon/m²/mon'
          },
          type: 'gradient',
          min: -0.1,
          max: 0.1,
          stops: [
            '#3B4CC0',
            '#6788EE',
            '#9ABBFF',
            '#C9D7F0',
            '#EDD1C2',
            '#F7A889',
            '#E26952',
            '#B40426'
          ]
        },
        parentDataset: {
          id: 'casagfed-carbonflux-monthgrid-v3'
        }
      },
      {
        id: 'casa-gfed-co2-flux-fe',
        stacApiEndpoint: 'https://earth.gov/ghgcenter/api/stac',
        tileApiEndpoint: 'https://earth.gov/ghgcenter/api/raster',
        stacCol: 'casagfed-carbonflux-monthgrid-v3',
        name: 'Fire Emissions (FIRE)',
        type: 'raster',
        description:
          'Model-estimated flux of carbon to the atmosphere from wildfires',
        initialDatetime: 'newest',
        projection: {
          id: 'equirectangular'
        },
        basemapId: 'light',
        zoomExtent: [0, 20],
        sourceParams: {
          assets: 'fire',
          colormap_name: 'purd',
          rescale: [0, 0.3]
        },
        compare: {
          datasetId: 'casagfed-carbonflux-monthgrid-v3',
          layerId: 'casa-gfed-co2-flux-fe'
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
          id: 'casagfed-carbonflux-monthgrid-v3'
        }
      },
      {
        id: 'casa-gfed-co2-flux-fuel',
        stacApiEndpoint: 'https://earth.gov/ghgcenter/api/stac',
        tileApiEndpoint: 'https://earth.gov/ghgcenter/api/raster',
        stacCol: 'casagfed-carbonflux-monthgrid-v3',
        name: 'Wood Fuel Emissions (FUEL)',
        type: 'raster',
        description:
          'Model-estimated flux of carbon to the atmosphere from wood burned for fuel',
        initialDatetime: 'newest',
        projection: {
          id: 'equirectangular'
        },
        basemapId: 'light',
        zoomExtent: [0, 20],
        sourceParams: {
          assets: 'fuel',
          colormap_name: 'bupu',
          rescale: [0, 0.03]
        },
        compare: {
          datasetId: 'casagfed-carbonflux-monthgrid-v3',
          layerId: 'casa-gfed-co2-flux-fuel'
        },
        legend: {
          unit: {
            label: 'kg Carbon/m²/mon'
          },
          type: 'gradient',
          min: 0,
          max: 0.03,
          stops: [
            '#F7FCFD',
            '#DCE9F2',
            '#B5CCE3',
            '#96ACD2',
            '#8C7DBA',
            '#894DA3',
            '#821580',
            '#4D004B'
          ]
        },
        parentDataset: {
          id: 'casagfed-carbonflux-monthgrid-v3'
        }
      }
    ]
  }
];

const mockDatasets = [
  {
    status: 'success',
    data: {
      id: 'casa-gfed-co2-flux-hr',
      stacApiEndpoint: 'https://earth.gov/ghgcenter/api/stac',
      tileApiEndpoint: 'https://earth.gov/ghgcenter/api/raster',
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
  const [aoi, setAoi] = useState(null);
  const setExternalDatasets = useSetAtom(externalDatasetsAtom);
  const [timelineDatasets, setTimelineDatasets] = useTimelineDatasetAtom();

  useEffect(() => {
    setExternalDatasets(mockRawData);
    setTimelineDatasets(mockDatasets);
  }, [setExternalDatasets, setTimelineDatasets]);

  // const { analysisResult, isLoading, isError } =
  //   useAnalysisDataRequestWithParams({
  //     start: new Date('2017-06-01T00:00:00.000Z'),
  //     end: new Date('2017-12-04T00:00:00.000Z'),
  //     aoi,
  //     datasetId: 'casa-gfed-co2-flux-hr',
  //     dataset: mockDatasets[0]
  //   });

  return (
    <PageMainContent>
      <Constrainer>
        <Wrapper>
          <MapWithDefaultControls
            datasets={timelineDatasets}
            setDatasets={setTimelineDatasets}
            selectedDay={mockSelectedDay}
            selectedCompareDay={mockSelectedCompareDay}
          >
            <AOIControl
              onAOIUpdate={(aoi) => {
                if (aoi?.length) setAoi(aoi[0]);
                else setAoi(null);
              }}
            />
            {aoi && <AoiLayer aoi={aoi} />}
          </MapWithDefaultControls>
          <div
            style={{
              height: '150px',
              width: '300px',
              position: 'absolute',
              bottom: '150px',
              left: 0,
              background: 'white'
            }}
          >
            {timelineDatasets.map((dataset) => (
              <DataLayerCardWithDefaultOption
                key={dataset.data.id}
                dataset={dataset}
              />
            ))}

            {/* {analysisResult.data?.timeseries && (
              <LineGraph
                data={analysisResult.data.timeseries.b1}
                attribute='mean'
                width={300}
                height={150}
              />
            )} */}
          </div>
        </Wrapper>
      </Constrainer>
    </PageMainContent>
  );
}

export default SandboxExplorationMap;
