import { atomWithUrlValueStability } from '$utils/params-location-atom/atom-with-url-value-stability';

const hydrateSelectedForEditing = (value) => value === 'true';

const dehydrateSelectedForEditing = (value) => value ? 'true' : 'false';

export const selectedForEditingAtom = atomWithUrlValueStability({
  initialValue: hydrateSelectedForEditing(new URLSearchParams(window.location.search).get('selectedForEditing')),
  urlParam: 'selectedForEditing',
  hydrate: hydrateSelectedForEditing,
  dehydrate: dehydrateSelectedForEditing
});
