import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { set } from 'lodash';
import { taxonomyAtom } from '../atoms/taxonomy-atom';
import { searchAtom } from '../atoms/search-atom';

export enum CatalogActions {
  CLEAR = 'clear',
  SEARCH = 'search',
  TAXONOMY_MULTISELECT = 'taxonomy_multiselect',
}

export type useCatalogViewAction = (what: CatalogActions, value?: any) => void;

export function useCatalogView() {
    const [search, setSearch] = useAtom(searchAtom);
    const [taxonomies, setTaxonomies] = useAtom(taxonomyAtom);

    const onAction = useCallback<useCatalogViewAction>(
      (what, value) => {
        switch (what) {
          case CatalogActions.CLEAR: {
            setSearch('');
            setTaxonomies({});
            break;
          }
          case CatalogActions.SEARCH: {
            setSearch(value);
            break;
          }
          case CatalogActions.TAXONOMY_MULTISELECT: {
            {
              const { key, value: val } = value;
              if ((key in taxonomies)) {
                const taxonomyGroupValues = taxonomies[key] instanceof Array ? (taxonomies[key] as string[]) : [taxonomies[key]];

                const updatedValues = taxonomyGroupValues.includes(val) ?
                taxonomyGroupValues.filter((x) => x !== val) :
                taxonomyGroupValues.includes(val) ? [] : [...taxonomyGroupValues, val];

                setTaxonomies(set({ ...taxonomies }, key, updatedValues));
              } else {
                setTaxonomies(set({ ...taxonomies }, key, [val]));
              }
            }
            break;
          }
          default:
            break;
        }
      },
      [setSearch, setTaxonomies, taxonomies]
    );

    return {
      search,
      taxonomies,
      onAction,
    };
  }
