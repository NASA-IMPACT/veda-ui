/**
 * Basemap style requirements (followed by standaard Mapbox Studio styles)
 * - have a layer named "admin-0-boundary-bg". Data will be added below
 *   this layer to ensure country oulines and labels are visible.
 * - for label and boundaries layers to be toggled on and off, they must 
 *   belong to a group specifically named - see GROUPS_BY_OPTION for the 
 *   list of accepted group names
 */

export const BASE_STYLE_PATH = 'https://api.mapbox.com/styles/v1/covid-nasa';

export const getStyleUrl = (mapboxId: string) => `${BASE_STYLE_PATH}/${mapboxId}?access_token=${process.env.MAPBOX_TOKEN}`;

export const BASEMAP_STYLES = [
  {
    id: 'satellite',
    label: 'Satellite',
    mapboxId: 'ckb01h6f10bn81iqg98ne0i2y',
    thumbnailUrl: `https://api.mapbox.com/styles/v1/covid-nasa/ckb01h6f10bn81iqg98ne0i2y/static/-9.14,38.7,10.5,0/480x320?access_token=${process.env.MAPBOX_TOKEN}`
  },
  {
    id: 'dark',
    label: 'Default dark',
    mapboxId: 'cldu14gii006801mgq3dn1jpd',
    thumbnailUrl: `https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-9.14,38.7,10.5,0/480x320?access_token=${process.env.MAPBOX_TOKEN}`
  },
  {
    id: 'light',
    label: 'Default light',
    mapboxId: 'cldu0tceb000701qnrl7p9woh',
    thumbnailUrl: `https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-9.14,38.7,10.5,0/480x320?access_token=${process.env.MAPBOX_TOKEN}`
  },
  {
    id: 'topo',
    label: 'Topo',
    mapboxId: 'cldu1yayu00au01qqrbdahb3m',
    thumbnailUrl: `https://api.mapbox.com/styles/v1/covid-nasa/cldu1yayu00au01qqrbdahb3m/static/-9.14,38.7,10.5,0/480x320?access_token=${process.env.MAPBOX_TOKEN}`
  }
];

// Default style used in discoveries and analysis, satellite no labels
export const DEFAULT_MAP_STYLE_URL =
  'mapbox://styles/covid-nasa/ckb01h6f10bn81iqg98ne0i2y';

export const GROUPS_BY_OPTION: Record<Option, string[]> = {
  labels: [
    'Natural features, natural-labels',
    'Place labels, place-labels',
    'Point of interest labels, poi-labels',
    'Road network, road-labels',
    'Transit, transit-labels'
  ],
  boundaries: ['Administrative boundaries, admin']
};

export type Basemap = typeof BASEMAP_STYLES;

export type BasemapId = typeof BASEMAP_STYLES[number]['id'];

export type Option = 'labels' | 'boundaries';
