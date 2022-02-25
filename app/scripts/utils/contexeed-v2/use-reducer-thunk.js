import { useCallback, useReducer, useRef } from 'react';

/**
 * Creates a reducer that supports dispatching functions.
 *
 * @param {function} reducer Reducer function
 * @param {object} initialState Reducer initial state
 * @returns Array tuple [state, dispatch]
 */
export function useReducerWithThunk(reducer, initialState) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Using a ref for the state to ensure that the dispatch function does not
  // change, but the state is up to date.
  const refState = useRef(state);
  refState.current = state;

  const customDispatch = useCallback((action) => {
    if (typeof action === 'function') {
      return action(customDispatch, refState.current);
    } else {
      dispatch(action);
      return action;
    }
  }, []);

  return [state, customDispatch];
}
