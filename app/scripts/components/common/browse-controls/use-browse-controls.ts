import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import useQsStateCreator from 'qs-state-hook';
import { set, omit } from 'lodash';

export enum Actions {
  CLEAR = 'clear',
  SEARCH = 'search',
  SORT_FIELD = 'sfield',
  SORT_DIR = 'sdir',
  TAXONOMY = 'taxonomy'
}

export type BrowserControlsAction = (what: Actions, value?: any) => void;

export interface FilterOption {
  id: string;
  name: string;
}

export interface TaxonomyFilterOption {
  taxonomyType: string;
  value: string;
  exclusion?: string;
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
      // If pubDate exists, default sorting to this
      default: sortOptions.find((o) => o.id === 'pubDate')?.id || sortOptions[0]?.id,
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

  const [taxonomies, setTaxonomies] = useQsState.memo<Record<string, string | string[]>>(
    {
      key: Actions.TAXONOMY,
      default: {},
      dehydrator: (v) => JSON.stringify(v), // dehydrator defines how a value is stored in the url
      hydrator: (v) => (v ? JSON.parse(v) : {}) // hydrator defines how a value is read from the url
    },
    []
  );

  const onAction = useCallback<BrowserControlsAction>(
    (what, value) => {
      switch (what) {
        case Actions.CLEAR:
          setSearch('');
          console.log(`setTaxonomies0`);
          console.log(`Actions.CLEAR: ,`, taxonomies);
          setTaxonomies({});
          break;
        case Actions.SEARCH:
          setSearch(value);
          break;
        case Actions.SORT_FIELD:
          setSortField(value);
          break;
        case Actions.SORT_DIR:
          setSortDir(value);
          break;
        // case Actions.TAXONOMY:
        //   { 
        //     console.log(`Actions.TAXONOMY: ,`, taxonomies);
        //     const { key, value: val } = value; // key is taxonomy group and val is the option id
        //     if (!(val instanceof Array)) {
        //       if (val === optionAll.id) {
        //         console.log(`setTaxonomies1 - optionAll`);
        //         setTaxonomies(omit(taxonomies, key));
        //       } else {
        //         console.log(`setTaxonomies2`);
        //         setTaxonomies(set({ ...taxonomies }, key, val));
        //       }
        //     } else {
        //       console.log(`top_level_tax: `, taxonomies);
        //       if(taxonomies && (key in taxonomies)) {
        //         const values = taxonomies[key];
        //         console.log(`values: `, values);
        //         if(values instanceof Array) {
        //           // if value doesn't exist, then add
        //           if (!values.includes(val[0])) {
        //             (values as string[]).push(val[0]);
        //             console.log(`setTaxonomies3 - `, taxonomies);
        //             setTaxonomies(taxonomies);
        //           }
        //           // if value does exist, then remove
        //           else if (values.includes(val[0])) {
        //             const updatedValues = values.filter((x) => x!== val[0]);
        //             if (updatedValues.length > 0) {
        //               console.log(`setTaxonomies4 - `, taxonomies, key, updatedValues);
        //               setTaxonomies(set({ ...taxonomies }, key, updatedValues));
        //             } else {
        //               console.log(`setTaxonomies5 - `, omit(taxonomies, key));
        //               setTaxonomies(omit(taxonomies, key));
        //             }
        //           }
        //         }
        //       } else {
        //         console.log(`setTaxonomies6 - `);
        //         setTaxonomies(set({ ...taxonomies }, key, val));
        //       }
        //     }
        //   }
        //   break;
        case Actions.TAXONOMY:
          {
            const { key, value: val } = value;
            if (!(val instanceof Array)) {
              if (val === optionAll.id) {
                setTaxonomies(omit(taxonomies, key));
              } else {
                setTaxonomies(set({ ...taxonomies }, key, val));
              }
            } else {
              if(taxonomies && (key in taxonomies)) {
                if(taxonomies[key] instanceof Array) {
                  (taxonomies[key] as string[]).push(val[0]);
                  setTaxonomies(set({ ...taxonomies }, key, taxonomies[key]));
                }
              } else {
                setTaxonomies(set({ ...taxonomies }, key, val));
              }
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
