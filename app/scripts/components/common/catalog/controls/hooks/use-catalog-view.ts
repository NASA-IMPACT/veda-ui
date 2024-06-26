import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { taxonomyAtom } from '../atoms/taxonomy-atom';
import { searchAtom } from '../atoms/search-atom';
import { CatalogViewAction, onCatalogAction } from '../../utils';

export function useCatalogView() {
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
    setSearch,
    setTaxonomies,
    onAction
  };
}
