import { atom, SetStateAction } from 'jotai';
import { atomWithReducer } from 'jotai/utils';
import { setUrlParam, urlAtom } from '$utils/params-location-atom/url';

export function atomWithCompare<Value>(
  initialValue: Value,
  areEqual: (prev: Value, next: Value) => boolean
) {
  return atomWithReducer(initialValue, (prev: Value, next: Value) => {
    if (areEqual(prev, next)) {
      return prev;
    }

    return next;
  });
}

function isEqual(prev, next) {
  if (typeof next === 'object') {
    const nextString = JSON.stringify(next);
    const prevString = JSON.stringify(prev);
    return prevString === nextString;
  }

  return prev === next;
}

/**
 * Options for creating a stable atom with a value that is synced to a URL parameter.
 * @template Value The type of the value being stored in the atom.
 * @template ValueUrl The type of the value being that is dehydrated/hydrated to/from the URL.
 */
interface StableAtomOptions<Value, ValueUrl> {
  /**
   * The initial value of the atom.
   */
  initialValue: Value;
  /**
   * The name of the URL parameter to sync the atom value to.
   */
  urlParam: string;
  /**
   * A function to convert the serialized URL parameter value to the atom value.
   * @param serialized The serialized URL parameter value.
   * @returns The deserialized atom value.
   */
  hydrate: (serialized: string | null | undefined) => ValueUrl;
  /**
   * A function to convert the atom value to a serialized URL parameter value.
   * @param value The atom value.
   * @returns The serialized URL parameter value.
   */
  dehydrate: (value: Value) => string;
  /**
   * An optional function to reconcile the URL parameter value with the atom
   * value. This is important for cases where the atom value is so complex that
   * the information that goes to the url needs to be simplified.
   * @param urlValue The value stored in the URL parameter after hydration.
   * @param storageValue The value stored in the atom.
   * @param get A getter function to access other atom values during reconciliation.
   * @returns The reconciled value. If the function is not provided the urlValue
   * is considered the reconciled value.
   */
  reconcile?: (
    urlValue: ValueUrl,
    storageValue: Value,
    get: (atom: any) => any
  ) => Value;
  /**
   * An optional function to compare two atom values for equality.
   * @param prev The previous atom value.
   * @param next The next atom value.
   * @returns Whether the two values are equal.
   */
  areEqual?: (prev: Value, next: Value) => boolean;
}

export function atomWithUrlValueStability<T, TUrl = T>(
  options: StableAtomOptions<T, TUrl>
) {
  const {
    initialValue,
    urlParam,
    hydrate,
    dehydrate,
    reconcile = (h) => h as unknown as T,
    areEqual = isEqual
  } = options;
  // Store the value in an atom that only updates if the value is different.
  const storage = atomWithCompare<T>(initialValue, areEqual);

  const stableAtom = atom(
    (get) => {
      // Get value from the url according to the urlParam.
      const serialized = get(urlAtom).searchParams?.get(urlParam);
      // Hydrate the value from the url.
      const hydrated = hydrate(serialized);
      const storageValue = get(storage);

      // Reconcile the hydrated value with the storage value.
      const reconciled = reconcile(hydrated, storageValue, get);

      // If the reconciled value is equal to the storage value, return the
      // storage value to ensure equality.
      return areEqual(storageValue, reconciled)
        ? (storageValue as T)
        : reconciled;
    },
    (get, set, updates: SetStateAction<T>) => {
      // Since updates can be a function, we need to get the correct new value.
      const newData =
        typeof updates === 'function'
          ? (updates as (prev: T) => T)(get(stableAtom))
          : updates;

      // Dehydrate the new value to a string for the url.
      const dehydrated = dehydrate(newData);
      // The url atom will take care of debouncing the url updates.
      set(urlAtom, setUrlParam(urlParam, dehydrated));

      // Store value as provided by the user.
      set(storage, newData);
    }
  );

  return stableAtom;
}
