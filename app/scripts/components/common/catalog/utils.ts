import { omit, set } from 'lodash';
import { optionAll } from '$components/common/browse-controls/constants';

export enum FilterActions {
  TAXONOMY_MULTISELECT = 'taxonomy_multiselect',
  CLEAR = 'clear',
  SEARCH = 'search',
  SORT_FIELD = 'sfield',
  SORT_DIR = 'sdir',
  TAXONOMY = 'taxonomy',
  CLEAR_TAXONOMY = 'clear_taxonomy',
  CLEAR_SEARCH = 'clear_search',
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
