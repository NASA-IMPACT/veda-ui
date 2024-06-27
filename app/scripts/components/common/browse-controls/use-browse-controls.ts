import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import useQsStateCreator from 'qs-state-hook';
import { set, omit } from 'lodash';

export enum Actions {
  CLEAR = 'clear',
  SEARCH = 'search',
  TAXONOMY = 'taxonomy',
  TAXONOMY_MULTISELECT = 'taxonomy_multiselect',
  CLEAR_TAXONOMY = 'clear_taxonomy',
  CLEAR_SEARCH = 'clear_search',
}

export type BrowserControlsAction = (action: Actions, value?: any) => void;

export interface FilterOption {
  id: string;
  name: string;
}

export interface TaxonomyFilterOption {
  taxonomyType: string;
  value: string;
  exclusion?: string;
}


export const optionAll = {
  id: 'all',
  name: 'All'
};

export const minSearchLength = 3;

// This hook is only used for the Stories Hub to manage browsing controls
// such as search, sort, and taxonomy filters.
export function useBrowserControls() {
  // Setup Qs State to store data in the url's query string
  // react-router function to get the navigation.
  const navigate = useNavigate();
  const useQsState = useQsStateCreator({
    commit: navigate
  });
  
  const [search, setSearch] = useQsState.memo(
    {
      key: Actions.SEARCH,
      default: '',
      dehydrator: (v) => v!,
      hydrator: (v) => {
        return (v ?? '');
      }
    },
    []
  );

  const [taxonomies, setTaxonomies] = useQsState.memo<
    Record<string, string | string[]>
  >(
    {
      key: Actions.TAXONOMY,
      default: {},
      dehydrator: (v) => JSON.stringify(v), // dehydrator defines how a value is stored in the url
      hydrator: (v) => {
        return (v ? JSON.parse(v) : {});
      } // hydrator defines how a value is read from the url
    },
    []
  );

  const onAction = useCallback<BrowserControlsAction>(
    (action, value) => {
      switch (action) {
        case Actions.CLEAR:
          setSearch('');
          setTaxonomies({});
          break;
        case Actions.CLEAR_TAXONOMY:
          setTaxonomies({});
          break;
        case Actions.CLEAR_SEARCH:
          setSearch('');
          break;
        case Actions.SEARCH:
          setSearch(value);
          break;
        case Actions.TAXONOMY_MULTISELECT:
          {
            const { key, value: val } = value;
            if (val === optionAll.id) {
              setTaxonomies(omit(taxonomies, key));
            } else {
              setTaxonomies(set({ ...taxonomies }, key, val));
            }
          }
          break;
        case Actions.TAXONOMY:
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
    },
    [taxonomies, setTaxonomies, setSearch]
  );

  return {
    search,
    taxonomies,
    onAction
  };
}
