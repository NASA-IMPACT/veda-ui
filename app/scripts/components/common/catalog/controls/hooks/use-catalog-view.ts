import { useAtom } from 'jotai';
import { useCallback, useState } from 'react';
import { taxonomyAtom } from '../atoms/taxonomy-atom';
import { searchAtom } from '../atoms/search-atom';
import { CatalogViewAction, onCatalogAction } from '../../utils';

export function useCatalogView() {
  const [search, setSearch] = useState('');
  const [taxonomies, setTaxonomies] = useState({});

  const onAction = useCallback<CatalogViewAction>(
    (action, value) =>
      onCatalogAction(action, value, taxonomies, setSearch, setTaxonomies),
    [setSearch, setTaxonomies, taxonomies]
  );

  return {
    search,
    taxonomies,
    onAction
  };
}
