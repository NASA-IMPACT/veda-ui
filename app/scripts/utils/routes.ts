import deltaThematics, {
  DatasetData,
  DeltaDatum,
  ThematicData
} from 'delta/thematics';

type ThematicOrString = DeltaDatum<ThematicData> | string;
type DatasetOrString = DeltaDatum<DatasetData> | string;

export const thematicRootPath = (thematic: ThematicOrString, path = '') => {
  const t = typeof thematic === 'string' ? thematic : thematic.data.id;

  const tPath = deltaThematics.length > 1 ? `/${t}` : `/`;
  if (!path) return tPath;

  return `${tPath.replace(/\/$/, '')}/${path}`;
};

export const thematicDiscoveriesPath = (thematic: ThematicOrString) => {
  return thematicRootPath(thematic, 'discoveries');
};

export const thematicDatasetsPath = (thematic: ThematicOrString) => {
  return thematicRootPath(thematic, 'datasets');
};

export const thematicAboutPath = (thematic: ThematicOrString) => {
  return thematicRootPath(thematic, 'about');
};

export const thematicAnalysisPath = (thematic: ThematicOrString) => {
  return thematicRootPath(thematic, 'analysis');
};

export const datasetRootPath = (
  thematic: ThematicOrString,
  dataset: DatasetOrString
) => {
  const d = typeof dataset === 'string' ? dataset : dataset.data.id;
  return `${thematicDatasetsPath(thematic)}/${d}`;
};

export const datasetExplorePath = (
  thematic: ThematicOrString,
  dataset: DatasetOrString
) => {
  return `${datasetRootPath(thematic, dataset)}/explore`;
};

export const datasetOverviewPath = (
  thematic: ThematicOrString,
  dataset: DatasetOrString
) => {
  return `${datasetRootPath(thematic, dataset)}`;
};

export const datasetUsagePath = (
  thematic: ThematicOrString,
  dataset: DatasetOrString
) => {
  return `${datasetRootPath(thematic, dataset)}/usage`;
};
