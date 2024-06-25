import { omit, set } from 'lodash';

export enum CatalogActions {
  CLEAR = 'clear',
  SEARCH = 'search',
  TAXONOMY = 'taxonomy',
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
    // case CatalogActions.TAXONOMY:
    //   {
    //     const { key, value: val } = value;
    //     setTaxonomies(set({ ...taxonomies }, key, val));
    //   }
    case CatalogActions.TAXONOMY_MULTISELECT: {
      const { key, value: val } = value;

      if (taxonomies && key in taxonomies) {
        const taxonomyGroupValues =
          taxonomies[key] instanceof Array
            ? (taxonomies[key] as string[])
            : [taxonomies[key]];

        if (taxonomyGroupValues.includes(val)) {
          const updatedValues = taxonomyGroupValues.filter((x) => x !== val);
          console.log(`1if: `, taxonomyGroupValues, updatedValues)
          updatedValues.length
            ? setTaxonomies(set({ ...taxonomies }, key, updatedValues))
            : setTaxonomies(omit(taxonomies, key));
        } else {
          const updatedValues = [...taxonomyGroupValues, val];
          console.log(`2if: `, taxonomyGroupValues, updatedValues)
          setTaxonomies(set({ ...taxonomies }, key, updatedValues));
        }
      } else {
        console.log(`3if: `, taxonomies)
        setTaxonomies(set({ ...taxonomies }, key, [val]));
      }
      break;
    }
    default:
      break;
  }
}
