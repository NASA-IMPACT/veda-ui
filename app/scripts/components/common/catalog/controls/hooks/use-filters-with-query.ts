import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import useQsStateCreator from 'qs-state-hook';
import { taxonomyAtom } from '../atoms/taxonomy-atom';
import { searchAtom } from '../atoms/search-atom';
import { FilterActions, FilterAction, onFilterAction } from '../../utils';

export interface UseFiltersWithQueryResult {
  search: string;
  taxonomies: Record<string, string[]> | Record<string, never>;
  onAction: FilterAction
}

// @TECH-DEBT: We have diverged ways of dealing with query parameters and need to consolidate them.
// useFiltersWithURLAtom uses URLAtoms, while useFiltersWithQS uses QS for query parameters related to filters.
// For more details on why we ended up with these two approaches, see: https://github.com/NASA-IMPACT/veda-ui/pull/1021

export function useFiltersWithURLAtom(): UseFiltersWithQueryResult {
  const [search, setSearch] = useAtom(searchAtom);
  const [taxonomies, setTaxonomies] = useAtom(taxonomyAtom);

  const onAction = useCallback<FilterAction>(
    (action, value) =>
      onFilterAction(action, value, taxonomies, setSearch, setTaxonomies),
    [setSearch, setTaxonomies, taxonomies]
  );

  return {
    search,
    taxonomies,
    onAction,
  };
} 

export function useFiltersWithQS(): UseFiltersWithQueryResult {
  const navigate = useNavigate();
  const useQsState = useQsStateCreator({
    commit: navigate
  });

  const [search, setSearch] = useQsState.memo(
    {
      key: FilterActions.SEARCH,
      default: ''
    },
    []
  );

  const [taxonomies, setTaxonomies] = useQsState.memo(
    {
      key: FilterActions.TAXONOMY,
      default: {},
      dehydrator: (v) => JSON.stringify(v), // dehydrator defines how a value is stored in the url
      hydrator: (v) => (v ? JSON.parse(v) : {}) // hydrator defines how a value is read from the url
    },
    []
  );

  const onAction = useCallback<FilterAction>(
    (action, value) =>
      onFilterAction(action, value, taxonomies, setSearch, setTaxonomies),
    [setSearch, setTaxonomies, taxonomies]
  );

  return {
    search: search?? '',
    taxonomies: taxonomies?? {},
    onAction,
  };
}