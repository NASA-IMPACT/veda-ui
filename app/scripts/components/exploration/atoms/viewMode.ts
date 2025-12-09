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

/**
 * Atom that manages the exploration view mode via URL parameter.
 *
 * - 'simple': Minimal view for used primarily for embedding (no navigation/header/footer/dataset selection UI or time series visualization)
 * - 'default': Full exploration and analysis interface
 *
 * URL parameter: `?viewMode=simple` (defaults to 'default')
 *
 * @example
 * const [viewMode] = useAtom(viewModeAtom);
 */
export const viewModeAtom = atomWithUrlValueStability<ViewMode>({
  initialValue: hydrateViewMode(initialParams.get('viewMode')),
  urlParam: 'viewMode',
  hydrate: hydrateViewMode,
  dehydrate: dehydrateViewMode,
  areEqual: (prev, next) => prev === next
});
