export interface StateSlice {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  mutationStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  receivedAt: number;
  error: Error | null;
  data: any | null;
}

type FnType = (...args: Array<any>) => any;

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

export interface ContexeedApiAction {
  /** Url to query */
  url: string;

  /** Options for the request. See `axios` documentation. */
  requestOptions: object;

  /** When a sliced state is being used the sliceKey is mandatory. It is a way
   * to store multiple items under the same state in the form os slices. */
  sliceKey: string | Array<string | number>;

  /** For "request" action the data is cached. By setting  skipStateCheck to
   * false, the cache is skipped.*/
  skipStateCheck: boolean;

  /** By default a request will be made to the given url with the given
   * requestOptions. If this request needs to be customized in a specific way,
   * the overrideRequest function can be used for this. This function must
   * return the data to store in the state. */
  overrideRequest(data: {
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
  transformData(data: any, helpers: HelpersBag): any;

  /** Allows any error from the request to be transformed before being stored in
   * the state. Errors in the overrideRequest and transformData functions are
   * also captured here. */
  transformError(data: any, helpers: HelpersBag): any;

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
  onDone(
    /** Finish callback. It will send the data or the error to the state. It is
     * also possible to change the data being sent to the state by passing
     * arguments to the finish function (error, data).
     */
    finish: FnType,
    /** Extra data */
    data: OnDoneData
  ): any;
}

export interface ContexeedApiConfig {
  /** The name of the contexeed. Helpful for logging. */
  name: string;

  /**
   * Whether to use a sliced state. This allows us to store multiple items in
   * the same state under different keys. Useful to store items by id.
   * False by default
   */
  slicedState: boolean;

  /** The interceptor is used to modify the action and/or the state before
   * hitting the reducer. Can also be used to respond to custom actions */
  interceptor(
    state: object,
    action: { type: string }
  ): { state: object; action: { type: string } };

  /** List of request actions to create */
  requests: { [key: string]: ContexeedApiAction };

  /** List of mutation actions to create. Mutations allow us to work with
   * non-get requests when interacting with the api. */
  mutations: { [key: string]: ContexeedApiAction };
}

export type ContexeedApi = (data: ContexeedApiConfig) => {
  /** List of functions created from the "requests" and "mutations" definitions
   * provided by the user */
  [key: string]: FnType;

  /** Invalidate action already dispatchable. If contexeed is defined as a
   * slicedState a key will be required. */
  invalidate(key?: string): any;

  /** Function to get the current state. If contexeed is defined as a
   * slicedState a key will be required and the returned state will be a state
   * slice. */
  getState(key?: string): any;

  /** The state in raw format as stored in the reducer. */
  rawState: any;

  /** The reducer's dispatch function. It supports dispatching thunks. */
  dispatch(action: { type: string } | FnType): any;
};
