import vedaThematics, {
  DatasetData,
  VedaDatum,
  ThematicData,
  DiscoveryData
} from 'veda';

type ThematicOrString = VedaDatum<ThematicData> | string;

export const ABOUT_PATH = '/about';
export const DISCOVERIES_PATH = '/discoveries';
export const DATASETS_PATH = '/data-catalog';
export const ANALYSIS_PATH = '/analysis';
export const ANALYSIS_RESULTS_PATH = '/analysis/results';

export const getDiscoveryPath = (d: DiscoveryData | string) =>
  `${DISCOVERIES_PATH}/${typeof d === 'string' ? d : d.id}`;
export const getDatasetPath = (d: DatasetData | string) =>
  `${DATASETS_PATH}/${typeof d === 'string' ? d : d.id}`;
export const getDatasetExplorePath = (d: DatasetData | string) =>
  `${DATASETS_PATH}/${typeof d === 'string' ? d : d.id}/explore`;

export const thematicRootPath = (thematic: ThematicOrString, path = '') => {
  const t = typeof thematic === 'string' ? thematic : thematic.data.id;

  const tPath = vedaThematics.length > 1 ? `/${t}` : `/`;
  if (!path) return tPath;

  return `${tPath.replace(/\/$/, '')}/${path}`;
};