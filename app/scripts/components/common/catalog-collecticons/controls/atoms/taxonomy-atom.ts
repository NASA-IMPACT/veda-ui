import { atomWithUrlValueStability } from '$utils/params-location-atom/atom-with-url-value-stability';

export const taxonomyAtom = atomWithUrlValueStability<
  Record<string, string[]>,
  Record<string, string[]>
>({
  initialValue: {},
  urlParam: 'taxonomy',
  hydrate: (serialized) => {
    try {
      return serialized ? JSON.parse(serialized) : {};
    } catch (error) {
      return {};
    }
  },
  dehydrate: (value) => {
    return JSON.stringify(value);
  },
  reconcile: (urlValue, storageValue) => {
    return { ...storageValue, ...urlValue };
  }
});
