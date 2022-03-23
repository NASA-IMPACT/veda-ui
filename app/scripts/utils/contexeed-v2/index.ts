import { useMemo, useCallback } from 'react';

import { useReducerWithThunk } from './use-reducer-thunk';
import { withReducerLogs } from './with-reducer-log';
import { withReducerInterceptor } from './with-reducer-interceptor';
import { makeReducer } from './make-reducer';
import { makeApiAction } from './make-api-action';

type CtxeedStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
type FnType = (...args: Array<any>) => any;

export interface StateSlice<D> {
  status: CtxeedStatus;
  mutationStatus: CtxeedStatus;
  receivedAt: number;
  error: Error | null;
  data: D;
}

interface DispatchedAction {
  [key: string]: any;
  /** The type of the dispatched action */
  type: string;
  /** The key for the state if it is a sliced state */
  key?: string;
}

interface HelpersBag {
  /** State matching the given stateKey */
  state: any;
  /** The whole contexeed state */
  rawState: any;
  /** Action dispatcher */
  dispatch: FnType;
  /** Reducer invalidate action. If the contexeed is defined as slicedState,
   * the slice key must be passed as the function argument. */
  invalidate: FnType;
}

interface OnDoneData extends HelpersBag {
  /** The resulting data if available */
  data: any | null;
  /** The resulting error if any */
  error: Error | null;
}

interface ContexeedApiAction {
  (...args: any[]): {
    /** Url to query */
    url?: string;

    /** Options for the request. See `axios` documentation. */
    requestOptions?: object;

    /** When a sliced state is being used the sliceKey is mandatory. It is a way
     * to store multiple items under the same state in the form os slices. */
    sliceKey?: string;

    /** For "request" action the data is cached. By setting  skipStateCheck to
     * false, the cache is skipped.*/
    skipStateCheck?: boolean;

    /** By default a request will be made to the given url with the given
     * requestOptions. If this request needs to be customized in a specific way,
     * the overrideRequest function can be used for this. This function must
     * return the data to store in the state. */
    overrideRequest?(data: {
      /** Axios */
      axios: any;
      /** Base request option to pass to axios. Useful when decorator functions
       * are used. */
      requestOptions: object;
      /** State matching the given stateKey */
      state: object;
      /** The whole contexeed state */
      rawState: object;
    }): any;

    /** Allows the data from the request response to be transformed before being
     * stored in the state. If an overrideRequest function was provided, the input
     * data will be whatever the overrideRequest returns. */
    transformData?(data: any, helpers: HelpersBag): any;

    /** Allows any error from the request to be transformed before being stored in
     * the state. Errors in the overrideRequest and transformData functions are
     * also captured here. */
    transformError?(data: any, helpers: HelpersBag): any;

    /** There are times when other actions must be dispatched before sending the
     * data to the state and finish the process. The onDone function is the last
     * hook where that can be done.
     *
     * @example
     * onDone: (finish, { dispatch }) => {
     *  dispatch({ type: 'some-action' });
     *
     *  It is important to return finish to send the data to the store. If an
     *  error happened it will send the error instead of the data.
     *  return finish();
     * }
     */
    onDone?(
      /** Finish callback. It will send the data or the error to the state. It is
       * also possible to change the data being sent to the state by passing
       * arguments to the finish function (error, data).
       */
      finish: (replacementError: Error | null, replacementData: any) => DispatchedAction,
      /** Extra data */
      data: OnDoneData
    ): any;
  };
}

interface ContexeedApiConfig {
  /** The name of the contexeed. Helpful for logging. */
  name: string;

  /**
   * Whether to use a sliced state. This allows us to store multiple items in
   * the same state under different keys. Useful to store items by id.
   * False by default
   */
  slicedState?: boolean;

  /** The interceptor is used to modify the action and/or the state before
   * hitting the reducer. Can also be used to respond to custom actions */
  interceptor?(
    state: object,
    action: { type: string }
  ): { state: object; action: { type: string } };

  /** List of request actions to create */
  requests?: {
    /** Functions created from the "requests" definitions */
    [key: string]: ContexeedApiAction;
  };

  /** List of mutation actions to create. Mutations allow us to work with
   * non-get requests when interacting with the api. */
  mutations?: {
    /** Functions created from the "mutation" definitions */
    [key: string]: ContexeedApiAction;
  };
}

type Actions<T extends { [key: string]: ContexeedApiAction }> = {
  [K in keyof T]: (...args: Parameters<T[K]>) => Promise<DispatchedAction>;
};

type ContexeedApi<C extends ContexeedApiConfig> = Actions<C['requests']> & Actions<C['mutations']> & {
  /** Invalidate action already dispatchable. If contexeed is defined as a
   * slicedState a key will be required. */
  invalidate(key?: string): DispatchedAction;

  /** Function to get the current state. If contexeed is defined as a
   * slicedState a key will be required and the returned state will be a state
   * slice. */
  getState<T>(key?: string): StateSlice<T>;

  /** The state in raw format as stored in the reducer. */
  rawState: { [key: string]: StateSlice<any> } | StateSlice<any>;

  /** The reducer's dispatch function. It supports dispatching thunks. */
  dispatch(action: { type: string } | FnType): any;
};

// status: 'idle' | 'loading' | 'succeeded' | 'failed'
const baseContexeedState: StateSlice<null> = {
  status: 'idle',
  mutationStatus: 'idle',
  receivedAt: null,
  error: null,
  data: null
};

// Power to the developer: The several hooks accept the `deps` which get passed
// from the parent. This triggers warning with eslint but it is accounted for.

export function useContexeedApi<C extends ContexeedApiConfig>(
  config: C,
  deps: Array<any> = []
): ContexeedApi<C> {
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
  } as ContexeedApi<C>;
}
