import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import useQsStateCreator from 'qs-state-hook';
import { taxonomyAtom } from '../atoms/taxonomy-atom';
import { searchAtom } from '../atoms/search-atom';
import { CatalogActions, CatalogViewAction, onCatalogAction } from '../../utils';

interface UseCatalogViewResult {
  search: string;
  taxonomies: Record<string, string[]> | Record<string, never>;
  onAction: CatalogViewAction
}

export function useCatalogView(): UseCatalogViewResult {
  const [search, setSearch] = useAtom(searchAtom);
  const [taxonomies, setTaxonomies] = useAtom(taxonomyAtom);

  const onAction = useCallback<CatalogViewAction>(
    (action, value) =>
      onCatalogAction(action, value, taxonomies, setSearch, setTaxonomies),
    [setSearch, setTaxonomies, taxonomies]
  );

  return {
    search,
    taxonomies,
    onAction,
  };
} 
// @NOTE: A hook using qs-state for query parameter management for cross-page navigation
// Details: https://github.com/NASA-IMPACT/veda-ui/pull/1021
export function useCatalogViewQS(): UseCatalogViewResult {
  const navigate = useNavigate();
  const useQsState = useQsStateCreator({
    commit: navigate
  });

  const [search, setSearch] = useQsState.memo(
    {
      key: CatalogActions.SEARCH,
      default: ''
    },
    []
  );

  const [taxonomies, setTaxonomies] = useQsState.memo(
    {
      key: CatalogActions.TAXONOMY,
      default: {},
      dehydrator: (v) => JSON.stringify(v), // dehydrator defines how a value is stored in the url
      hydrator: (v) => (v ? JSON.parse(v) : {}) // hydrator defines how a value is read from the url
    },
    []
  );

  const onAction = useCallback<CatalogViewAction>(
    (action, value) =>
      onCatalogAction(action, value, taxonomies, setSearch, setTaxonomies),
    [setSearch, setTaxonomies, taxonomies]
  );

  return {
    search: search?? '',
    taxonomies: taxonomies?? {},
    onAction,
  };
}