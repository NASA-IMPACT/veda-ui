import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import useQsStateCreator from 'qs-state-hook';

export enum Actions {
  SEARCH = 'search',
  SORT_FIELD = 'sfield',
  SORT_DIR = 'sdir',
  TOPIC = 'topic',
  SOURCE = 'source'
}

export type BrowserControlsAction = (what: Actions, value: any) => void;

export interface FilterOption {
  id: string;
  name: string;
}

interface BrowseControlsHookParams {
  topicsOptions: FilterOption[];
  sourcesOptions: FilterOption[];
}

export const sortFieldsOptions: FilterOption[] = [
  {
    id: 'name',
    name: 'Name'
  }
  // TODO: Implement date sorting: https://github.com/NASA-IMPACT/veda-ui/issues/514
  // {
  //   id: 'date',
  //   name: 'Date (n/a)'
  // }
];

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

export function useBrowserControls({
  topicsOptions,
  sourcesOptions
}: BrowseControlsHookParams) {
  // Setup Qs State to store data in the url's query string
  // react-router function to get the navigation.
  const navigate = useNavigate();
  const useQsState = useQsStateCreator({
    commit: navigate
  });

  const [sortField, setSortField] = useQsState.memo(
    {
      key: Actions.SORT_FIELD,
      default: sortFieldsOptions[0].id,
      validator: sortFieldsOptions.map((d) => d.id)
    },
    []
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

  const [topic, setTopic] = useQsState.memo(
    {
      key: Actions.TOPIC,
      default: topicsOptions[0].id,
      validator: topicsOptions.map((d) => d.id)
    },
    [topicsOptions]
  );

  const [source, setSource] = useQsState.memo(
    {
      key: Actions.SOURCE,
      default: sourcesOptions[0].id,
      validator: sourcesOptions.map((d) => d.id)
    },
    [sourcesOptions]
  );

  const onAction = useCallback<BrowserControlsAction>(
    (what, value) => {
      switch (what) {
        case Actions.SEARCH:
          setSearch(value);
          break;
        case Actions.SORT_FIELD:
          setSortField(value);
          break;
        case Actions.SORT_DIR:
          setSortDir(value);
          break;
        case Actions.TOPIC:
          setTopic(value);
          break;
        case Actions.SOURCE:
          setSource(value);
          break;
      }
    },
    [setSortField, setSortDir, setTopic, setSource, setSearch]
  );

  return {
    search,
    sortField,
    sortDir,
    topic,
    source,
    onAction
  };
}
