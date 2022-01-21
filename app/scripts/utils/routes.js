import deltaThematics from 'delta/thematics';

export const datasetRootPath = (thematic, dataset) => {
  const t = thematic.id || thematic;
  const d = dataset.data.id || dataset;

  const base = `datasets/${d}`;
  return deltaThematics.length > 1 ? `/${t}/${base}` : `/${base}`;
};

export const datasetExplorePath = (thematic, dataset) => {
  return `${datasetRootPath(thematic, dataset)}`;
};

export const datasetOverviewPath = (thematic, dataset) => {
  return `${datasetRootPath(thematic, dataset)}/overview`;
};

export const datasetUsagePath = (thematic, dataset) => {
  return `${datasetRootPath(thematic, dataset)}/usage`;
};
