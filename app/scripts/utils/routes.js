import deltaThematics from 'delta/thematics';

export const thematicRootPath = (thematic, path = '') => {
  const t = thematic.id || thematic;

  const tPath = deltaThematics.length > 1 ? `/${t}` : `/`;
  if (!path) return tPath;

  return `${tPath.replace(/\/$/, '')}/${path}`;
};

export const thematicDiscoveriesPath = (thematic) => {
  return thematicRootPath(thematic, 'discoveries');
};

export const thematicDatasetsPath = (thematic) => {
  return thematicRootPath(thematic, 'datasets');
};

export const thematicAboutPath = (thematic) => {
  return thematicRootPath(thematic, 'about');
};

export const datasetRootPath = (thematic, dataset) => {
  const d = dataset.data.id || dataset;
  return `${thematicDatasetsPath(thematic)}/${d}`;
};

export const datasetExplorePath = (thematic, dataset) => {
  return `${datasetRootPath(thematic, dataset)}/explore`;
};

export const datasetOverviewPath = (thematic, dataset) => {
  return `${datasetRootPath(thematic, dataset)}`;
};

export const datasetUsagePath = (thematic, dataset) => {
  return `${datasetRootPath(thematic, dataset)}/usage`;
};
