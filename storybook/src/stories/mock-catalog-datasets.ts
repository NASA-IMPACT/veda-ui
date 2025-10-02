import { DatasetData } from '$types/veda';

// Mock datasets for catalog comparison stories
export const mockCatalogDatasets: Partial<DatasetData>[] = [
  {
    id: 'air-quality-pm25',
    name: 'PM2.5 Air Quality Monitoring',
    description:
      'Fine particulate matter measurements from satellite observations',
    media: {
      src: 'https://placehold.co/400x300/1e40af/white?text=Air+Quality',
      alt: 'Air quality visualization'
    },
    taxonomy: [
      {
        name: 'Topics',
        values: [
          { id: 'air-quality', name: 'Air Quality' },
          { id: 'health', name: 'Health' }
        ]
      },
      { name: 'Source', values: [{ id: 'satellite', name: 'Satellite' }] }
    ],
    layers: []
  },
  {
    id: 'sea-surface-temp',
    name: 'Sea Surface Temperature',
    description: 'Global sea surface temperature from thermal infrared sensors',
    media: {
      src: 'https://placehold.co/400x300/0369a1/white?text=Sea+Temperature',
      alt: 'Sea surface temperature visualization'
    },
    taxonomy: [
      {
        name: 'Topics',
        values: [
          { id: 'oceans', name: 'Oceans' },
          { id: 'climate', name: 'Climate' }
        ]
      },
      { name: 'Source', values: [{ id: 'satellite', name: 'Satellite' }] }
    ],
    layers: []
  },
  {
    id: 'wildfire-emissions',
    name: 'Wildfire Carbon Emissions',
    description:
      'Carbon dioxide and carbon monoxide emissions from active wildfires',
    media: {
      src: 'https://placehold.co/400x300/dc2626/white?text=Wildfire',
      alt: 'Wildfire emissions visualization'
    },
    taxonomy: [
      {
        name: 'Topics',
        values: [
          { id: 'fire', name: 'Fire' },
          { id: 'emissions', name: 'Emissions' }
        ]
      },
      { name: 'Source', values: [{ id: 'model', name: 'Model' }] }
    ],
    layers: []
  },
  {
    id: 'soil-moisture',
    name: 'Soil Moisture Index',
    description: 'Soil moisture content from microwave radiometer observations',
    media: {
      src: 'https://placehold.co/400x300/92400e/white?text=Soil+Moisture',
      alt: 'Soil moisture visualization'
    },
    taxonomy: [
      {
        name: 'Topics',
        values: [
          { id: 'agriculture', name: 'Agriculture' },
          { id: 'water', name: 'Water' }
        ]
      },
      { name: 'Source', values: [{ id: 'satellite', name: 'Satellite' }] }
    ],
    layers: []
  },
  {
    id: 'urban-heat-island',
    name: 'Urban Heat Island Effect',
    description:
      'Land surface temperature differences between urban and rural areas',
    media: {
      src: 'https://placehold.co/400x300/f59e0b/white?text=Urban+Heat',
      alt: 'Urban heat island visualization'
    },
    taxonomy: [
      {
        name: 'Topics',
        values: [
          { id: 'climate', name: 'Climate' },
          { id: 'urban', name: 'Urban' }
        ]
      },
      { name: 'Source', values: [{ id: 'satellite', name: 'Satellite' }] }
    ],
    layers: []
  }
];
