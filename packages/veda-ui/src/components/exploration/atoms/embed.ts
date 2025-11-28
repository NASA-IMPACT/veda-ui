import { atomWithUrlValueStability } from '$utils/params-location-atom/atom-with-url-value-stability';

const initialParams = new URLSearchParams(window.location.search);

const hydrateBoolean = (serialized: string | null) => {
  return serialized === 'true';
};

const dehydrateBoolean = (value: boolean) => {
  // Only add the param to the URL if it's true.
  return value ? 'true' : '';
};

export const isEmbeddedAtom = atomWithUrlValueStability<boolean>({
  initialValue: hydrateBoolean(initialParams.get('embed')),
  urlParam: 'embed',
  hydrate: hydrateBoolean,
  dehydrate: dehydrateBoolean,
  areEqual: (prev, next) => prev === next
});
