import { useMemo, useCallback } from 'react';

import { useReducerWithThunk } from './use-reducer-thunk';
import { withReducerLogs } from './with-reducer-log';
import { withReducerInterceptor } from './with-reducer-interceptor';
import { makeReducer } from './make-reducer';
import { makeApiAction } from './make-api-action';

// status: 'idle' | 'loading' | 'succeeded' | 'failed'
const baseContexeedState = {
  status: 'idle',
  mutationStatus: 'idle',
  receivedAt: null,
  error: null,
  data: null
};

// Power to the developer: The several hooks accept the `deps` which get passed
// from the parent. This triggers warning with eslint but it is accounted for.

export function useContexeedApi(config, deps = []) {
  const {
    name,
    slicedState,
    interceptor,
    requests = {},
    mutations = {}
  } = config;

  // Memoize values
  const { initialState, reducer, actions } = useMemo(() => {
    // If we're using a sliced state, it needs to start empty. Id keys will be
    // added at a later stage resulting in something like:
    // {
    //   key1: baseContexeedState,
    //   key2: baseContexeedState,
    //   ...
    // }
    const initialState = slicedState ? {} : baseContexeedState;

    const reducer = withReducerLogs(
      withReducerInterceptor(
        makeReducer({
          name,
          // When creating the reducer we need the initial state, to be able to
          // use the invalidate function.
          initialState,
          // The base state is used as the source for missing properties. We
          // start from the base state and replace what's needed. In this way we
          // ensure state consistency.
          baseState: baseContexeedState
        }),
        interceptor
      )
    );

    // Create the actions needed by the thunk (begin and end), and the
    // invalidate action to clean the state.
    const actions = {
      begin: (params) => ({ ...params, type: `begin/${name}` }),
      end: (params) => ({
        receivedAt: Date.now(),
        ...params,
        type: `end/${name}`
      }),
      invalidate: (key) => ({ key, type: `invalidate/${name}` })
    };

    return {
      initialState,
      reducer,
      actions
    };
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [...deps]);

  // useReducerWithThunk is the same as React's useReducer but with support for
  // dispatching functions.
  const [state, dispatch] = useReducerWithThunk(reducer, initialState);

  // Create the dispatchable request actions from the functions defined in the
  // configuration.
  const requestActions = useMemo(
    () =>
      Object.keys(requests).reduce((acc, fnName) => {
        const fn = makeApiAction({
          type: 'requests',
          fn: requests[fnName],
          fnName,
          config,
          actions
        });
        return {
          ...acc,
          [fnName]: (...args) => dispatch(fn(...args))
        };
      }, {}),
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [dispatch, ...deps]
  );

  // Create the dispatchable mutation actions from the functions defined in the
  // configuration.
  const mutationActions = useMemo(
    () =>
      Object.keys(mutations).reduce((acc, fnName) => {
        const fn = makeApiAction({
          type: 'mutations',
          fn: mutations[fnName],
          fnName,
          config,
          actions
        });
        return {
          ...acc,
          [fnName]: (...args) => dispatch(fn(...args))
        };
      }, {}),
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [dispatch, ...deps]
  );

  const invalidate = useCallback(
    (key) => {
      if (slicedState && !key) {
        throw new Error(
          `The contexeed \`${name}\` is setup as a sliced state (slicedState), but you're using invalidate action without a key value.`
        );
      }
      return dispatch(actions.invalidate(key));
    },
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [dispatch, ...deps]
  );

  const getState = useCallback(
    (key) => {
      // If the config defines this contexeed as `slicedState`, the `key` becomes
      // required.
      if (slicedState && !key) {
        throw new Error(
          `The contexeed \`${name}\` is setup as a sliced state (slicedState), but you're using getState without a key value.`
        );
      }
      if (!slicedState && key) {
        throw new Error(
          `The contexeed \`${name}\` is not setup as a sliced state (slicedState), but you're using getState with a key value.`
        );
      }

      return (slicedState ? state[key] : state) || baseContexeedState;
    },
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [state, ...deps]
  );

  return {
    ...requestActions,
    ...mutationActions,
    invalidate,
    getState,
    rawState: state,
    dispatch
  };
}
