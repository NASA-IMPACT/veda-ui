// This is parsed MDX metadata (Type DatasetData)
export const mockRawData = [
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
// This is TimelineDataset data, resolved with stac data
export const mockDatasets = [
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
      },
      isPeriodic: true,
      isTimeless: false,
      timeDensity: 'month',
      timeInterval: 'P1M',
      domain: [
        '2003-01-01T05:00:00.000Z',
        '2003-02-01T05:00:00.000Z',
        '2003-03-01T05:00:00.000Z',
        '2003-04-01T05:00:00.000Z',
        '2003-05-01T04:00:00.000Z',
        '2003-06-01T04:00:00.000Z',
        '2003-07-01T04:00:00.000Z',
        '2003-08-01T04:00:00.000Z',
        '2003-09-01T04:00:00.000Z',
        '2003-10-01T04:00:00.000Z',
        '2003-11-01T05:00:00.000Z',
        '2003-12-01T05:00:00.000Z',
        '2004-01-01T05:00:00.000Z',
        '2004-02-01T05:00:00.000Z',
        '2004-03-01T05:00:00.000Z',
        '2004-04-01T05:00:00.000Z',
        '2004-05-01T04:00:00.000Z',
        '2004-06-01T04:00:00.000Z',
        '2004-07-01T04:00:00.000Z',
        '2004-08-01T04:00:00.000Z',
        '2004-09-01T04:00:00.000Z',
        '2004-10-01T04:00:00.000Z',
        '2004-11-01T05:00:00.000Z',
        '2004-12-01T05:00:00.000Z',
        '2005-01-01T05:00:00.000Z',
        '2005-02-01T05:00:00.000Z',
        '2005-03-01T05:00:00.000Z',
        '2005-04-01T05:00:00.000Z',
        '2005-05-01T04:00:00.000Z',
        '2005-06-01T04:00:00.000Z',
        '2005-07-01T04:00:00.000Z',
        '2005-08-01T04:00:00.000Z',
        '2005-09-01T04:00:00.000Z',
        '2005-10-01T04:00:00.000Z',
        '2005-11-01T05:00:00.000Z',
        '2005-12-01T05:00:00.000Z',
        '2006-01-01T05:00:00.000Z',
        '2006-02-01T05:00:00.000Z',
        '2006-03-01T05:00:00.000Z',
        '2006-04-01T05:00:00.000Z',
        '2006-05-01T04:00:00.000Z',
        '2006-06-01T04:00:00.000Z',
        '2006-07-01T04:00:00.000Z',
        '2006-08-01T04:00:00.000Z',
        '2006-09-01T04:00:00.000Z',
        '2006-10-01T04:00:00.000Z',
        '2006-11-01T05:00:00.000Z',
        '2006-12-01T05:00:00.000Z',
        '2007-01-01T05:00:00.000Z',
        '2007-02-01T05:00:00.000Z',
        '2007-03-01T05:00:00.000Z',
        '2007-04-01T04:00:00.000Z',
        '2007-05-01T04:00:00.000Z',
        '2007-06-01T04:00:00.000Z',
        '2007-07-01T04:00:00.000Z',
        '2007-08-01T04:00:00.000Z',
        '2007-09-01T04:00:00.000Z',
        '2007-10-01T04:00:00.000Z',
        '2007-11-01T04:00:00.000Z',
        '2007-12-01T05:00:00.000Z',
        '2008-01-01T05:00:00.000Z',
        '2008-02-01T05:00:00.000Z',
        '2008-03-01T05:00:00.000Z',
        '2008-04-01T04:00:00.000Z',
        '2008-05-01T04:00:00.000Z',
        '2008-06-01T04:00:00.000Z',
        '2008-07-01T04:00:00.000Z',
        '2008-08-01T04:00:00.000Z',
        '2008-09-01T04:00:00.000Z',
        '2008-10-01T04:00:00.000Z',
        '2008-11-01T04:00:00.000Z',
        '2008-12-01T05:00:00.000Z',
        '2009-01-01T05:00:00.000Z',
        '2009-02-01T05:00:00.000Z',
        '2009-03-01T05:00:00.000Z',
        '2009-04-01T04:00:00.000Z',
        '2009-05-01T04:00:00.000Z',
        '2009-06-01T04:00:00.000Z',
        '2009-07-01T04:00:00.000Z',
        '2009-08-01T04:00:00.000Z',
        '2009-09-01T04:00:00.000Z',
        '2009-10-01T04:00:00.000Z',
        '2009-11-01T04:00:00.000Z',
        '2009-12-01T05:00:00.000Z',
        '2010-01-01T05:00:00.000Z',
        '2010-02-01T05:00:00.000Z',
        '2010-03-01T05:00:00.000Z',
        '2010-04-01T04:00:00.000Z',
        '2010-05-01T04:00:00.000Z',
        '2010-06-01T04:00:00.000Z',
        '2010-07-01T04:00:00.000Z',
        '2010-08-01T04:00:00.000Z',
        '2010-09-01T04:00:00.000Z',
        '2010-10-01T04:00:00.000Z',
        '2010-11-01T04:00:00.000Z',
        '2010-12-01T05:00:00.000Z',
        '2011-01-01T05:00:00.000Z',
        '2011-02-01T05:00:00.000Z',
        '2011-03-01T05:00:00.000Z',
        '2011-04-01T04:00:00.000Z',
        '2011-05-01T04:00:00.000Z',
        '2011-06-01T04:00:00.000Z',
        '2011-07-01T04:00:00.000Z',
        '2011-08-01T04:00:00.000Z',
        '2011-09-01T04:00:00.000Z',
        '2011-10-01T04:00:00.000Z',
        '2011-11-01T04:00:00.000Z',
        '2011-12-01T05:00:00.000Z',
        '2012-01-01T05:00:00.000Z',
        '2012-02-01T05:00:00.000Z',
        '2012-03-01T05:00:00.000Z',
        '2012-04-01T04:00:00.000Z',
        '2012-05-01T04:00:00.000Z',
        '2012-06-01T04:00:00.000Z',
        '2012-07-01T04:00:00.000Z',
        '2012-08-01T04:00:00.000Z',
        '2012-09-01T04:00:00.000Z',
        '2012-10-01T04:00:00.000Z',
        '2012-11-01T04:00:00.000Z',
        '2012-12-01T05:00:00.000Z',
        '2013-01-01T05:00:00.000Z',
        '2013-02-01T05:00:00.000Z',
        '2013-03-01T05:00:00.000Z',
        '2013-04-01T04:00:00.000Z',
        '2013-05-01T04:00:00.000Z',
        '2013-06-01T04:00:00.000Z',
        '2013-07-01T04:00:00.000Z',
        '2013-08-01T04:00:00.000Z',
        '2013-09-01T04:00:00.000Z',
        '2013-10-01T04:00:00.000Z',
        '2013-11-01T04:00:00.000Z',
        '2013-12-01T05:00:00.000Z',
        '2014-01-01T05:00:00.000Z',
        '2014-02-01T05:00:00.000Z',
        '2014-03-01T05:00:00.000Z',
        '2014-04-01T04:00:00.000Z',
        '2014-05-01T04:00:00.000Z',
        '2014-06-01T04:00:00.000Z',
        '2014-07-01T04:00:00.000Z',
        '2014-08-01T04:00:00.000Z',
        '2014-09-01T04:00:00.000Z',
        '2014-10-01T04:00:00.000Z',
        '2014-11-01T04:00:00.000Z',
        '2014-12-01T05:00:00.000Z',
        '2015-01-01T05:00:00.000Z',
        '2015-02-01T05:00:00.000Z',
        '2015-03-01T05:00:00.000Z',
        '2015-04-01T04:00:00.000Z',
        '2015-05-01T04:00:00.000Z',
        '2015-06-01T04:00:00.000Z',
        '2015-07-01T04:00:00.000Z',
        '2015-08-01T04:00:00.000Z',
        '2015-09-01T04:00:00.000Z',
        '2015-10-01T04:00:00.000Z',
        '2015-11-01T04:00:00.000Z',
        '2015-12-01T05:00:00.000Z',
        '2016-01-01T05:00:00.000Z',
        '2016-02-01T05:00:00.000Z',
        '2016-03-01T05:00:00.000Z',
        '2016-04-01T04:00:00.000Z',
        '2016-05-01T04:00:00.000Z',
        '2016-06-01T04:00:00.000Z',
        '2016-07-01T04:00:00.000Z',
        '2016-08-01T04:00:00.000Z',
        '2016-09-01T04:00:00.000Z',
        '2016-10-01T04:00:00.000Z',
        '2016-11-01T04:00:00.000Z',
        '2016-12-01T05:00:00.000Z',
        '2017-01-01T05:00:00.000Z',
        '2017-02-01T05:00:00.000Z',
        '2017-03-01T05:00:00.000Z',
        '2017-04-01T04:00:00.000Z',
        '2017-05-01T04:00:00.000Z',
        '2017-06-01T04:00:00.000Z',
        '2017-07-01T04:00:00.000Z',
        '2017-08-01T04:00:00.000Z',
        '2017-09-01T04:00:00.000Z',
        '2017-10-01T04:00:00.000Z',
        '2017-11-01T04:00:00.000Z',
        '2017-12-01T05:00:00.000Z'
      ],
      renders: {
        rh: {
          assets: ['rh'],
          rescale: [[0, 0.3]],
          colormap_name: 'purd'
        },
        nee: {
          assets: ['nee'],
          rescale: [[-0.1, 0.1]],
          colormap_name: 'coolwarm'
        },
        npp: {
          assets: ['npp'],
          rescale: [[0, 0.3]],
          colormap_name: 'purd'
        },
        fire: {
          assets: ['fire'],
          rescale: [[0, 0.3]],
          colormap_name: 'purd'
        },
        fuel: {
          assets: ['fuel'],
          rescale: [[0, 0.03]],
          colormap_name: 'bupu'
        }
      }
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
      ],
      colorMap: 'blues',
      scale: {
        min: 0,
        max: 0.3
      }
    },
    analysis: {
      status: 'idle',
      error: null,
      data: null,
      meta: {}
    },
    meta: {
      tileUrls: {
        wmtsTileUrl:
          'https://earth.gov/ghgcenter/api/raster/searches/3b46d29dcb49fd2eb8e4a65b5dcde805/WebMercatorQuad/WMTSCapabilities.xml?colormap_name=blues&rescale=0%2C0.3&reScale=0%2C0.3&assets=rh',
        xyzTileUrl:
          'https://earth.gov/ghgcenter/api/raster/searches/3b46d29dcb49fd2eb8e4a65b5dcde805/tiles/WebMercatorQuad/{z}/{x}/{y}?colormap_name=blues&rescale=0%2C0.3&reScale=0%2C0.3&assets=rh'
      }
    }
  },
  {
    status: 'success',
    data: {
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
      },
      isPeriodic: true,
      isTimeless: false,
      timeDensity: 'month',
      timeInterval: 'P1M',
      domain: [
        '2003-01-01T05:00:00.000Z',
        '2003-02-01T05:00:00.000Z',
        '2003-03-01T05:00:00.000Z',
        '2003-04-01T05:00:00.000Z',
        '2003-05-01T04:00:00.000Z',
        '2003-06-01T04:00:00.000Z',
        '2003-07-01T04:00:00.000Z',
        '2003-08-01T04:00:00.000Z',
        '2003-09-01T04:00:00.000Z',
        '2003-10-01T04:00:00.000Z',
        '2003-11-01T05:00:00.000Z',
        '2003-12-01T05:00:00.000Z',
        '2004-01-01T05:00:00.000Z',
        '2004-02-01T05:00:00.000Z',
        '2004-03-01T05:00:00.000Z',
        '2004-04-01T05:00:00.000Z',
        '2004-05-01T04:00:00.000Z',
        '2004-06-01T04:00:00.000Z',
        '2004-07-01T04:00:00.000Z',
        '2004-08-01T04:00:00.000Z',
        '2004-09-01T04:00:00.000Z',
        '2004-10-01T04:00:00.000Z',
        '2004-11-01T05:00:00.000Z',
        '2004-12-01T05:00:00.000Z',
        '2005-01-01T05:00:00.000Z',
        '2005-02-01T05:00:00.000Z',
        '2005-03-01T05:00:00.000Z',
        '2005-04-01T05:00:00.000Z',
        '2005-05-01T04:00:00.000Z',
        '2005-06-01T04:00:00.000Z',
        '2005-07-01T04:00:00.000Z',
        '2005-08-01T04:00:00.000Z',
        '2005-09-01T04:00:00.000Z',
        '2005-10-01T04:00:00.000Z',
        '2005-11-01T05:00:00.000Z',
        '2005-12-01T05:00:00.000Z',
        '2006-01-01T05:00:00.000Z',
        '2006-02-01T05:00:00.000Z',
        '2006-03-01T05:00:00.000Z',
        '2006-04-01T05:00:00.000Z',
        '2006-05-01T04:00:00.000Z',
        '2006-06-01T04:00:00.000Z',
        '2006-07-01T04:00:00.000Z',
        '2006-08-01T04:00:00.000Z',
        '2006-09-01T04:00:00.000Z',
        '2006-10-01T04:00:00.000Z',
        '2006-11-01T05:00:00.000Z',
        '2006-12-01T05:00:00.000Z',
        '2007-01-01T05:00:00.000Z',
        '2007-02-01T05:00:00.000Z',
        '2007-03-01T05:00:00.000Z',
        '2007-04-01T04:00:00.000Z',
        '2007-05-01T04:00:00.000Z',
        '2007-06-01T04:00:00.000Z',
        '2007-07-01T04:00:00.000Z',
        '2007-08-01T04:00:00.000Z',
        '2007-09-01T04:00:00.000Z',
        '2007-10-01T04:00:00.000Z',
        '2007-11-01T04:00:00.000Z',
        '2007-12-01T05:00:00.000Z',
        '2008-01-01T05:00:00.000Z',
        '2008-02-01T05:00:00.000Z',
        '2008-03-01T05:00:00.000Z',
        '2008-04-01T04:00:00.000Z',
        '2008-05-01T04:00:00.000Z',
        '2008-06-01T04:00:00.000Z',
        '2008-07-01T04:00:00.000Z',
        '2008-08-01T04:00:00.000Z',
        '2008-09-01T04:00:00.000Z',
        '2008-10-01T04:00:00.000Z',
        '2008-11-01T04:00:00.000Z',
        '2008-12-01T05:00:00.000Z',
        '2009-01-01T05:00:00.000Z',
        '2009-02-01T05:00:00.000Z',
        '2009-03-01T05:00:00.000Z',
        '2009-04-01T04:00:00.000Z',
        '2009-05-01T04:00:00.000Z',
        '2009-06-01T04:00:00.000Z',
        '2009-07-01T04:00:00.000Z',
        '2009-08-01T04:00:00.000Z',
        '2009-09-01T04:00:00.000Z',
        '2009-10-01T04:00:00.000Z',
        '2009-11-01T04:00:00.000Z',
        '2009-12-01T05:00:00.000Z',
        '2010-01-01T05:00:00.000Z',
        '2010-02-01T05:00:00.000Z',
        '2010-03-01T05:00:00.000Z',
        '2010-04-01T04:00:00.000Z',
        '2010-05-01T04:00:00.000Z',
        '2010-06-01T04:00:00.000Z',
        '2010-07-01T04:00:00.000Z',
        '2010-08-01T04:00:00.000Z',
        '2010-09-01T04:00:00.000Z',
        '2010-10-01T04:00:00.000Z',
        '2010-11-01T04:00:00.000Z',
        '2010-12-01T05:00:00.000Z',
        '2011-01-01T05:00:00.000Z',
        '2011-02-01T05:00:00.000Z',
        '2011-03-01T05:00:00.000Z',
        '2011-04-01T04:00:00.000Z',
        '2011-05-01T04:00:00.000Z',
        '2011-06-01T04:00:00.000Z',
        '2011-07-01T04:00:00.000Z',
        '2011-08-01T04:00:00.000Z',
        '2011-09-01T04:00:00.000Z',
        '2011-10-01T04:00:00.000Z',
        '2011-11-01T04:00:00.000Z',
        '2011-12-01T05:00:00.000Z',
        '2012-01-01T05:00:00.000Z',
        '2012-02-01T05:00:00.000Z',
        '2012-03-01T05:00:00.000Z',
        '2012-04-01T04:00:00.000Z',
        '2012-05-01T04:00:00.000Z',
        '2012-06-01T04:00:00.000Z',
        '2012-07-01T04:00:00.000Z',
        '2012-08-01T04:00:00.000Z',
        '2012-09-01T04:00:00.000Z',
        '2012-10-01T04:00:00.000Z',
        '2012-11-01T04:00:00.000Z',
        '2012-12-01T05:00:00.000Z',
        '2013-01-01T05:00:00.000Z',
        '2013-02-01T05:00:00.000Z',
        '2013-03-01T05:00:00.000Z',
        '2013-04-01T04:00:00.000Z',
        '2013-05-01T04:00:00.000Z',
        '2013-06-01T04:00:00.000Z',
        '2013-07-01T04:00:00.000Z',
        '2013-08-01T04:00:00.000Z',
        '2013-09-01T04:00:00.000Z',
        '2013-10-01T04:00:00.000Z',
        '2013-11-01T04:00:00.000Z',
        '2013-12-01T05:00:00.000Z',
        '2014-01-01T05:00:00.000Z',
        '2014-02-01T05:00:00.000Z',
        '2014-03-01T05:00:00.000Z',
        '2014-04-01T04:00:00.000Z',
        '2014-05-01T04:00:00.000Z',
        '2014-06-01T04:00:00.000Z',
        '2014-07-01T04:00:00.000Z',
        '2014-08-01T04:00:00.000Z',
        '2014-09-01T04:00:00.000Z',
        '2014-10-01T04:00:00.000Z',
        '2014-11-01T04:00:00.000Z',
        '2014-12-01T05:00:00.000Z',
        '2015-01-01T05:00:00.000Z',
        '2015-02-01T05:00:00.000Z',
        '2015-03-01T05:00:00.000Z',
        '2015-04-01T04:00:00.000Z',
        '2015-05-01T04:00:00.000Z',
        '2015-06-01T04:00:00.000Z',
        '2015-07-01T04:00:00.000Z',
        '2015-08-01T04:00:00.000Z',
        '2015-09-01T04:00:00.000Z',
        '2015-10-01T04:00:00.000Z',
        '2015-11-01T04:00:00.000Z',
        '2015-12-01T05:00:00.000Z',
        '2016-01-01T05:00:00.000Z',
        '2016-02-01T05:00:00.000Z',
        '2016-03-01T05:00:00.000Z',
        '2016-04-01T04:00:00.000Z',
        '2016-05-01T04:00:00.000Z',
        '2016-06-01T04:00:00.000Z',
        '2016-07-01T04:00:00.000Z',
        '2016-08-01T04:00:00.000Z',
        '2016-09-01T04:00:00.000Z',
        '2016-10-01T04:00:00.000Z',
        '2016-11-01T04:00:00.000Z',
        '2016-12-01T05:00:00.000Z',
        '2017-01-01T05:00:00.000Z',
        '2017-02-01T05:00:00.000Z',
        '2017-03-01T05:00:00.000Z',
        '2017-04-01T04:00:00.000Z',
        '2017-05-01T04:00:00.000Z',
        '2017-06-01T04:00:00.000Z',
        '2017-07-01T04:00:00.000Z',
        '2017-08-01T04:00:00.000Z',
        '2017-09-01T04:00:00.000Z',
        '2017-10-01T04:00:00.000Z',
        '2017-11-01T04:00:00.000Z',
        '2017-12-01T05:00:00.000Z'
      ],
      renders: {
        rh: {
          assets: ['rh'],
          rescale: [[0, 0.3]],
          colormap_name: 'purd'
        },
        nee: {
          assets: ['nee'],
          rescale: [[-0.1, 0.1]],
          colormap_name: 'coolwarm'
        },
        npp: {
          assets: ['npp'],
          rescale: [[0, 0.3]],
          colormap_name: 'purd'
        },
        fire: {
          assets: ['fire'],
          rescale: [[0, 0.3]],
          colormap_name: 'purd'
        },
        fuel: {
          assets: ['fuel'],
          rescale: [[0, 0.03]],
          colormap_name: 'bupu'
        }
      }
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
    },
    meta: {
      tileUrls: {
        wmtsTileUrl:
          'https://earth.gov/ghgcenter/api/raster/searches/3b46d29dcb49fd2eb8e4a65b5dcde805/WebMercatorQuad/WMTSCapabilities.xml?rescale=0%2C0.3&assets=npp',
        xyzTileUrl:
          'https://earth.gov/ghgcenter/api/raster/searches/3b46d29dcb49fd2eb8e4a65b5dcde805/tiles/WebMercatorQuad/{z}/{x}/{y}?rescale=0%2C0.3&assets=npp'
      }
    }
  }
];
