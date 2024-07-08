import { useParams } from 'react-router';
import { 
  DatasetData, StoryData, VedaData
} from "$types/veda";

// @NOTE: Independent of veda faux modules

/**
 * List with the meta information of all datasets.
 */
export const getAllDatasetsProps = (datasets: VedaData<DatasetData>) => Object.values(datasets).map((d) => d!.data);

/**
 * List with the meta information of all stories.
 */
// @QUESTION: This was migrated over from the original /scripts/utils/veda-data file but doesn't seem to be used anywhere, we should get rid of it I think
// Also it does the same thing as getAllDatasetsProps
export const getAllStoriesProps = (stories: VedaData<StoryData>) => Object.values(stories).map(
  (d) => d!.data
);

/**
 * Returns the meta data for a story taking into account the url parameters.
 * If the story does not exist, null is returned.
 * @returns Object
 */
export function useStory(stories: VedaData<StoryData>) {
  const { storyId } = useParams();

  const story = stories[storyId ?? ''];

  // Stop if the story doesn't exist.
  return story ?? null;
}

/**
 * Returns the meta data for a dataset taking into account the url parameters.
 * If the dataset does not exist, null is returned.
 * @returns Object
 */
export function useDataset(datasets: VedaData<DatasetData>) {
  const { datasetId } = useParams();

  const dataset = datasets[datasetId ?? ''];

  // Stop if the datasets doesn't exist.
  return dataset ?? null;
}


