import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import useQsStateCreator from 'qs-state-hook';
import { set, omit } from 'lodash';

export enum Actions {
  SEARCH = 'search',
  SORT_FIELD = 'sfield',
  SORT_DIR = 'sdir',
  TAXONOMY = 'taxonomy'
}

export type BrowserControlsAction = (what: Actions, value: any) => void;

export interface FilterOption {
  id: string;
  name: string;
}

interface BrowseControlsHookParams {
  sortOptions: FilterOption[];
}

export const sortDirOptions: FilterOption[] = [
  {
    id: 'asc',
    name: 'Ascending'
  },
  {
    id: 'desc',
    name: 'Descending'
  }
];

export const optionAll = {
  id: 'all',
  name: 'All'
};

export function useBrowserControls({ sortOptions }: BrowseControlsHookParams) {
  // Setup Qs State to store data in the url's query string
  // react-router function to get the navigation.
  const navigate = useNavigate();
  const useQsState = useQsStateCreator({
    commit: navigate
  });

  const [sortField, setSortField] = useQsState.memo(
    {
      key: Actions.SORT_FIELD,
      default: sortOptions[0].id,
      validator: sortOptions.map((d) => d.id)
    },
    [sortOptions]
  );

  const [sortDir, setSortDir] = useQsState.memo(
    {
      key: Actions.SORT_DIR,
      default: sortDirOptions[0].id,
      validator: sortDirOptions.map((d) => d.id)
    },
    []
  );

  const [search, setSearch] = useQsState.memo(
    {
      key: Actions.SEARCH,
      default: ''
    },
    []
  );

  const [taxonomies, setTaxonomies] = useQsState.memo<Record<string, string>>(
    {
      key: Actions.TAXONOMY,
      default: {},
      dehydrator: (v) => JSON.stringify(v),
      hydrator: (v) => (v ? JSON.parse(v) : {})
    },
    []
  );

  const onAction = useCallback<BrowserControlsAction>(
    (what, value) => {
      switch (what) {
        case Actions.SEARCH:
          setSearch(value);
          break;
        case Actions.SORT_FIELD:
          setSortField(value);
          break;
        case Actions.SORT_DIR:
          setSortDir(value);
          break;
        case Actions.TAXONOMY:
          {
            const { key, value: val } = value;
            if (val === optionAll.id) {
              setTaxonomies(omit(taxonomies, key));
            } else {
              setTaxonomies(set({...taxonomies}, key, val));
            }
          }
          break;
      }
    },
    [setSortField, setSortDir, taxonomies, setTaxonomies, setSearch]
  );

  return {
    search,
    sortField,
    sortDir,
    taxonomies,
    onAction
  };
}
