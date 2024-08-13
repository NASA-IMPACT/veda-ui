import { atomWithUrlValueStability } from '$utils/params-location-atom/atom-with-url-value-stability';

const initialParams = new URLSearchParams(window.location.search);

const hydrateColorMap = (serialized: string | null) => {
  return serialized ?? 'viridis';
};

export const colorMapAtom = atomWithUrlValueStability<string>({
  initialValue: hydrateColorMap(initialParams.get('colorMap')),
  urlParam: 'colorMap',
  hydrate: hydrateColorMap,
  areEqual(prev, next) {
    return prev === next;
  },
  dehydrate: (colorMap) => {
    return colorMap;
  }
});
