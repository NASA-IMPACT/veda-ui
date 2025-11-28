import { atomWithUrlValueStability } from '$utils/params-location-atom/atom-with-url-value-stability';
const DEFAULT_ZOOM = 1;

const initialParams = new URLSearchParams(window.location.search);
const hydrateZoom = (serialized: string | null) => {
  if (serialized === null) return DEFAULT_ZOOM;
  const num = parseFloat(serialized);
  return isNaN(num) ? DEFAULT_ZOOM : num;
};

const dehydrateZoom = (value: number) => {
  return value === DEFAULT_ZOOM ? '' : value.toString();
};

export const zoomAtom = atomWithUrlValueStability<number>({
  initialValue: hydrateZoom(initialParams.get('zoom')),
  urlParam: 'zoom',
  hydrate: hydrateZoom,
  dehydrate: dehydrateZoom,
  areEqual: (prev, next) => prev === next
});
