import { atomWithUrlValueStability } from '$utils/params-location-atom/atom-with-url-value-stability';

const initialParams = new URLSearchParams(window.location.search);

export const reverseAtom = atomWithUrlValueStability<boolean>({
  initialValue: initialParams.get('reverse') === 'true',
  urlParam: 'reverse',
  hydrate: (value) => value === 'true',
  areEqual: (prev, next) => prev === next,
  dehydrate: (value) => (value ? 'true' : 'false')
});
