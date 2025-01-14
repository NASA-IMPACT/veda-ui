import { DatasetData, StoryData } from '$types/veda';

export const ABOUT_PATH = '/about';
export const STORIES_PATH = '/stories';
export const DATASETS_PATH = '/data-catalog';
export const EXPLORATION_PATH = '/exploration';
export const ANALYSIS_PATH = '/analysis';
export const ANALYSIS_RESULTS_PATH = '/analysis/results';

export const getStoryPath = (d: StoryData | string) =>
  `${STORIES_PATH}/${typeof d === 'string' ? d : d.id}`;

export const getDatasetPath = (
  d: DatasetData | string,
  path: string = DATASETS_PATH
) => `${path}/${typeof d === 'string' ? d : d.id}`;

export const getDatasetExplorePath = (d: DatasetData | string) => {
  const id = typeof d === 'string' ? d : d.id;
  return `${EXPLORATION_PATH}?search=${id}`;
};
