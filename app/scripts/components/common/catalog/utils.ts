import { omit, set } from 'lodash';
import { FormatBlock } from '../types';
import { optionAll } from '$components/common/browse-controls/constants';
import { DatasetData, DatasetLayer, StoryData } from '$types/veda';

export enum FilterActions {
  TAXONOMY_MULTISELECT = 'taxonomy_multiselect',
  CLEAR = 'clear',
  SEARCH = 'search',
  SORT_FIELD = 'sfield',
  SORT_DIR = 'sdir',
  TAXONOMY = 'taxonomy',
  CLEAR_TAXONOMY = 'clear_taxonomy',
  CLEAR_SEARCH = 'clear_search'
}

export type FilterAction = (action: FilterActions, value?: any) => void;

export function onFilterAction(
  action: FilterActions,
  value: any,
  taxonomies: any,
  setSearch: (value: string) => void,
  setTaxonomies: (value: any) => void
) {
  switch (action) {
    case FilterActions.CLEAR: {
      setSearch('');
      setTaxonomies({});
      break;
    }
    case FilterActions.SEARCH: {
      setSearch(value);
      break;
    }
    case FilterActions.CLEAR_TAXONOMY: {
      setTaxonomies({});
      break;
    }
    case FilterActions.CLEAR_SEARCH: {
      setSearch('');
      break;
    }
    case FilterActions.TAXONOMY: {
      {
        const { key, value: val } = value;
        if (val === optionAll.id) {
          setTaxonomies(omit(taxonomies, key));
        } else {
          setTaxonomies(set({ ...taxonomies }, key, val));
        }
      }
      break;
    }
    case FilterActions.TAXONOMY_MULTISELECT: {
      const { key, value: val } = value;

      if (taxonomies && key in taxonomies) {
        const taxonomyGroupValues =
          taxonomies[key] instanceof Array
            ? (taxonomies[key] as string[])
            : [taxonomies[key]];

        if (taxonomyGroupValues.includes(val)) {
          const updatedValues = taxonomyGroupValues.filter((x) => x !== val);
          updatedValues.length
            ? setTaxonomies(set({ ...taxonomies }, key, updatedValues))
            : setTaxonomies(omit(taxonomies, key));
        } else {
          const updatedValues = [...taxonomyGroupValues, val];
          setTaxonomies(set({ ...taxonomies }, key, updatedValues));
        }
      } else {
        setTaxonomies(set({ ...taxonomies }, key, [val]));
      }
      break;
    }
    default:
      break;
  }
}

type DataObject = DatasetData | DatasetLayer | StoryData | FormatBlock;

/**
 * Returns the description for a dataset, layer, or story, prioritizing cardDescription
 * @param data - Dataset, layer, or story object
 * @returns The appropriate description string
 */
export const getDescription = (data: DataObject): string => {
  return data.cardDescription ?? data.description;
};

/**
 * Returns the description for a dataset/story and its optional layer
 * Layer description takes precedence over dataset/story description
 * @param layer - Optional layer object
 * @param data - Dataset or story object
 * @returns The appropriate description string
 */
export const getDatasetDescription = (
  layer: DatasetLayer | undefined,
  data: DatasetData | StoryData
): string => {
  if (!layer) {
    return getDescription(data);
  }
  return getDescription(layer);
};

/**
 * Gets media property following strict precedence order:
 * 1. Layer cardMedia
 * 2. Layer media
 * 3. Parent cardMedia
 * 4. Parent media
 *
 * @param layer - Optional layer object
 * @param data - Parent (dataset/story) object
 * @param property - Media property to retrieve ('src' or 'alt')
 * @returns The appropriate media property value
 */
export const getMediaProperty = <T extends 'src' | 'alt'>(
  layer: DatasetLayer | undefined,
  data: DatasetData | StoryData | FormatBlock,
  property: T
): string => {
  return (
    layer?.cardMedia?.[property] ??
    layer?.media?.[property] ??
    data.cardMedia?.[property] ??
    data.media?.[property] ??
    ''
  );
};
