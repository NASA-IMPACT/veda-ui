import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import useQsStateCreator from 'qs-state-hook';
import { taxonomyAtom } from '../atoms/taxonomy-atom';
import { searchAtom } from '../atoms/search-atom';
import { CatalogActions, CatalogViewAction, onCatalogAction } from '../../utils';

export function useCatalogView() {
  const [search, setSearch] = useAtom(searchAtom);
  const [taxonomies, setTaxonomies] = useAtom(taxonomyAtom);

  const navigate = useNavigate();
  const useQsState = useQsStateCreator({
    commit: navigate
  });

  const [qsSearch, setQsSearch] = useQsState.memo(
    {
      key: CatalogActions.SEARCH,
      default: ''
    },
    []
  );
  
  const [qsTaxonomies, setQsTaxonomies] = useQsState.memo<
  Record<string, string | string[]>
  >(
    {
      key: CatalogActions.TAXONOMY,
      default: {},
      dehydrator: (v) => JSON.stringify(v), // dehydrator defines how a value is stored in the url
      hydrator: (v) => (v ? JSON.parse(v) : {}) // hydrator defines how a value is read from the url
    },
    []
  );

  const onCatalogViewAction = useCallback<CatalogViewAction>(
    (action, value) =>
      onCatalogAction(action, value, taxonomies, setSearch, setTaxonomies),
    [setSearch, setTaxonomies, taxonomies]
  );
  
  const onBrowserControlAction = useCallback<CatalogViewAction>(
    (action, value) =>
      onCatalogAction(action, value, qsTaxonomies, setQsSearch, setQsTaxonomies),
    [setQsSearch, setQsTaxonomies, qsTaxonomies]
  );


  return {
    search,
    qsSearch,
    taxonomies,
    qsTaxonomies,
    onCatalogViewAction,
    onBrowserControlAction,
  };
}
