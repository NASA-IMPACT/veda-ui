import { useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import { taxonomyAtom } from '../atoms/taxonomy-atom';
import { searchAtom } from '../atoms/search-atom';
import { CatalogViewAction, onCatalogAction } from '../../utils';

import { useNavigate } from 'react-router';
import useQsStateCreator from 'qs-state-hook';

export function useCatalogView(urlRedirect: boolean = true) {
  const [search, setSearch] = useAtom(searchAtom);
  const [taxonomies, setTaxonomies] = useAtom(taxonomyAtom);
  console.log(`TAX_FROM_ATOM: `, taxonomies)

  const navigate = useNavigate();
  const useQsState = useQsStateCreator({
    commit: navigate
  });

  // This hook looks at the url parameters to grab taxonomies, this is needed for when
  // a user navigates back to the data-catalog view direct from clicking on a taxonomy tag
  const [urlTaxonomy, setUrlTaxonomy] = useQsState.memo<
    Record<string, string[]>
  >(
    {
      key: 'taxonomy',
      default: {},
      dehydrator: (v) => JSON.stringify(v), // dehydrator defines how a value is stored in the url
      hydrator: (v) => (v ? JSON.parse(v) : {}) // hydrator defines how a value is read from the url
    },
    []
  );

  console.log(`taxnomies_from_atom: `, taxonomies)
  console.log(`urlTaxonomy_here: `, urlTaxonomy)

  useEffect(() => {
    if (urlRedirect && urlTaxonomy !== taxonomies && urlTaxonomy !== null) {
      // taxononmies from url params take preference
      console.log(`urlTaxonomy_here: `, urlTaxonomy)
      setTaxonomies(urlTaxonomy)
    }
  }, [urlTaxonomy, taxonomies, urlRedirect])

  const onAction = useCallback<CatalogViewAction>(
    (action, value) => {
      console.log(`taxonomies_in_onActions: `, taxonomies)
      onCatalogAction(action, value, taxonomies, setSearch, setTaxonomies)
    },
      
    [setSearch, setTaxonomies, taxonomies]
  );


  return {
    search,
    taxonomies,
    onAction
  };
}
