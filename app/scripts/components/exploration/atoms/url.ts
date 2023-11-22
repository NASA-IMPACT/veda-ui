import { atom } from 'jotai';
import { atomWithLocation } from 'jotai-location';
import { debounce } from 'lodash';

interface JotaiLocation {
  pathname?: string;
  searchParams?: URLSearchParams;
}

export const CLEAR_LOCATION = Symbol('CLEAR_LOCATION');

function atomWithDebouncedLocation() {
  // The locAtom is used to store the data in the url. However it can't be used as
  // the source of truth because there is a limit to how many url changes can be
  // made in a specific amount of time. (This is a browser restriction).
  // The solution is to have a local location storage atom (locStorageAtom) that
  // can have all the updates we want.
  const locAtom = atomWithLocation();
  const locStorageAtom = atom<JotaiLocation | null>(null);
  // The locAtomDebounced is the read/write atom that then updates the other two.
  // It updates the locStorageAtom immediately and the locAtom after a debounce.
  // In summary:
  //   The data is set in locAtomDebounced which updates locStorageAtom and after
  //   a debounce it updates locAtom.
  let setDebounced;
  const urlAtom = atom(
    (get): JotaiLocation => {
      return get(locStorageAtom) ?? get(locAtom);
    },
    (get, set, updates) => {
      // Escape hatch to clear the location, when we move off the page.
      if (updates === CLEAR_LOCATION) {
        set(locStorageAtom, null);
        return;
      }

      const newData =
        typeof updates === 'function' ? updates(get(urlAtom)) : updates;

      if (!setDebounced) {
        setDebounced = debounce(set, 320);
      }

      setDebounced(locAtom, newData);
      set(locStorageAtom, newData);
    }
  );

  return urlAtom;
}

export const urlAtom = atomWithDebouncedLocation();

/**
 * Creates an updater function that sets a given value for the search params of
 * a location. This is to be used to write to a location atom, so we can update
 * a given search parameter without deleting the others.
 *
 * @code
 * ```
 *   const locAtom = atomWithLocation();
 *   const setter = useSetAtom(locAtom);
 *   setter(setUrlParam('page', '2'));
 * ```
 *
 * @param name Name of the url parameter
 * @param value Value for the parameter
 */
export function setUrlParam(name: string, value: string) {
  return (prev) => {
    // Start from what's on the url because another atom might have updated it.
    const searchParams = new URLSearchParams(window.location.search);
    const prevSearchParams = prev.searchParams ?? new URLSearchParams();

    prevSearchParams.forEach((value, name) => {
      searchParams.set(name, value);
    });

    searchParams.set(name, value);

    return { ...prev, searchParams };
  };
}
