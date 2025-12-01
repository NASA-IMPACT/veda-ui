import { atomWithUrlValueStability } from '$utils/params-location-atom/atom-with-url-value-stability';

// Default center is null, meaning the map can set its own default view.
const DEFAULT_CENTER: [number, number] = [0, 0];

const initialParams = new URLSearchParams(window.location.search);

const hydrateCenter = (serialized: string | null): [number, number] => {
  if (!serialized) return DEFAULT_CENTER;
  const cleaned = serialized.replace(/[[\]]/g, '');
  const parts = cleaned.split(',').map(parseFloat);
  // Ensure there are exactly two parts (lng, lat) and both are valid numbers.
  if (parts.length !== 2 || parts.some(isNaN)) {
    return DEFAULT_CENTER;
  }

  return [parts[0], parts[1]];
};

const dehydrateCenter = (value: [number, number]): string => {
  if (value === null) return '';
  return value.map((v) => v.toFixed(6)).join(',');
};

export const centerAtom = atomWithUrlValueStability<[number, number]>({
  initialValue: hydrateCenter(initialParams.get('center')),
  urlParam: 'center',
  hydrate: hydrateCenter,
  dehydrate: dehydrateCenter,
  areEqual: (prev, next) => dehydrateCenter(prev) === dehydrateCenter(next)
});
