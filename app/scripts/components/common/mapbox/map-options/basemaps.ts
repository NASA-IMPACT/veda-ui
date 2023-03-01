export const BASEMAP_STYLES = [
  {
    id: 'satellite',
    label: 'Satellite',
    url: 'mapbox://styles/covid-nasa/cldu1cb8f00ds01p6gi583w1m',
    thumbnailUrl: `https://api.mapbox.com/styles/v1/covid-nasa/cldac5c2c003k01oebmavw4q3/static/-9.14,38.7,10.5,0/480x320?access_token=${process.env.MAPBOX_TOKEN}`
  },
  {
    id: 'dark',
    label: 'Default dark',
    url: 'mapbox://styles/covid-nasa/cldu14gii006801mgq3dn1jpd',
    thumbnailUrl: `https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-9.14,38.7,10.5,0/480x320?access_token=${process.env.MAPBOX_TOKEN}`
  },
  {
    id: 'light',
    label: 'Default light',
    url: 'mapbox://styles/covid-nasa/cldu0tceb000701qnrl7p9woh',
    thumbnailUrl: `https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-9.14,38.7,10.5,0/480x320?access_token=${process.env.MAPBOX_TOKEN}`
  },
  {
    id: 'topo',
    label: 'Topo',
    url: 'mapbox://styles/covid-nasa/cldu1yayu00au01qqrbdahb3m',
    thumbnailUrl: `https://api.mapbox.com/styles/v1/covid-nasa/cldu1yayu00au01qqrbdahb3m/static/-9.14,38.7,10.5,0/480x320?access_token=${process.env.MAPBOX_TOKEN}`
  }
];

export const GROUPS_BY_OPTION: Record<Option, string[]> = {
  labels: ['Natural features, natural-labels', 'Place labels, place-labels', 'Point of interest labels, poi-labels', 'Road network, road-labels', 'Transit, transit-labels'],
  boundaries: ['Administrative boundaries, admin'],
}

export type Basemap = typeof BASEMAP_STYLES;

export type BasemapId = typeof BASEMAP_STYLES[number]['id'];

export type Option = 'labels' | 'boundaries';
