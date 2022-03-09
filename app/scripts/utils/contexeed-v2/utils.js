import get from 'lodash.get';

/**
 * Returns an object with a state slice if exist and a prop indicating whether
 * the state is sliced or not.
 * @param {object} state The contextseed state
 * @param {string|array} key The state slice key to return
 */
export const getStateSlice = (state, key) => {
  const hasStateKey = key || key === '';

  return {
    isSliced: hasStateKey,
    // If there's a key that's the slice, otherwise it's the whole state.
    // Empty array or string will look at the root
    stateSlice: hasStateKey && key.length ? get(state, key) : state
  };
};

/**
 * Checks if the given input is a function.
 *
 * @param {function} fn The function to check
 * @returns Boolean
 */
export const isFn = (fn) => typeof fn === 'function';
