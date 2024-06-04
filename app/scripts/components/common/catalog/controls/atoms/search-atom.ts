import { atomWithUrlValueStability } from '$utils/params-location-atom/atom-with-url-value-stability';

export const searchAtom = atomWithUrlValueStability<string, string>({
  initialValue: '',
  urlParam: 'search',
  hydrate: (serialized) => {
    return serialized ?? '';
  },
  dehydrate: (value) => {
    return value;
  },
  reconcile: (urlValue, storageValue) => {
    return urlValue || storageValue;
  }
});
