import { ViewMode } from '$components/exploration/types.d.ts';
import { atomWithUrlValueStability } from '$utils/params-location-atom/atom-with-url-value-stability';

const initialParams = new URLSearchParams(window.location.search);

const hydrateViewMode = (serialized: string | null) => {
  if (serialized === 'simple') return serialized;
  return 'default';
};

const dehydrateViewMode = (value: ViewMode) => {
  return value ?? 'default';
};

export const viewModeAtom = atomWithUrlValueStability<ViewMode>({
  initialValue: hydrateViewMode(initialParams.get('viewMode')),
  urlParam: 'viewMode',
  hydrate: hydrateViewMode,
  dehydrate: dehydrateViewMode,
  areEqual: (prev, next) => prev === next
});
