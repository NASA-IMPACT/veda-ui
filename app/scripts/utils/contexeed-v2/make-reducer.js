/**
 * Base reducer for an api request, taking into account the action.key If it
 * exists it will store in the state under that path. Allows for page caching.
 *
 * Uses the following actions:
 * - invalidate/<actionName>
 * - begin/<actionName>
 * - end/<actionName>
 *
 * @param {object} op Options
 * @param {string} op.name The action name to use as suffix
 * @param {object} op.initialState Initial state to use. Used by the invalidate
 * action
 * @param {object} op.baseState The base state from where to get the needed
 * properties.
 *
 * @example
 * const resultsReducer = makeReducer({ name: 'results', initialState: {}, baseState: {} });
 */
export function makeReducer({ name: actionName, initialState, baseState }) {
  // Reducer function.
  const contexeedReducer = (state, action) => {
    // The status to update depends on whether is a mutation or not.
    const statusKey = action.isMutation ? 'mutationStatus' : 'status';

    switch (action.type) {
      case `invalidate/${actionName}`:
        return initialState;
      case `begin/${actionName}`: {
        return {
          ...baseState,
          ...state,
          // Reset the mutation state every time there's a fetch request. When
          // working with a mutation the next line will set the correct state.
          mutationStatus: 'idle',
          [statusKey]: 'loading'
        };
      }
      case `end/${actionName}`: {
        // eslint-disable-next-line prefer-const
        let st = {
          ...baseState,
          ...state,
          receivedAt: action.receivedAt
        };

        if (action.error) {
          st[statusKey] = 'failed';
          st.error = action.error;
          // The data remains to what was previously set. This allows to keep
          // the data in the interface even if the request fails.
        } else {
          st[statusKey] = 'succeeded';
          st.data = action.data;
          st.error = null;
        }

        return st;
      }
    }
    return state;
  };

  // Run the reducer and apply the state according to whether there's a key or
  // not.
  return (state, action) => {
    const hasKey = typeof action.key !== 'undefined';
    const stateSlice = hasKey ? state[action.key] : state;
    const newState = contexeedReducer(stateSlice, action);

    return hasKey ? { ...state, [action.key]: newState } : newState;
  };
}
