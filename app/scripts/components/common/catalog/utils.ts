import { omit, set } from 'lodash';

export enum CatalogActions {
  CLEAR = 'clear',
  SEARCH = 'search',
  TAXONOMY_MULTISELECT = 'taxonomy_multiselect'
}

export type CatalogViewAction = (action: CatalogActions, value?: any) => void;

export function onCatalogAction(
  action: CatalogActions,
  value: any,
  taxonomies: any,
  setSearch: (value: string) => void,
  setTaxonomies: (value: any) => void
) {
  switch (action) {
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
          taxonomyGroupValues.push(val);
          setTaxonomies(taxonomies);
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
