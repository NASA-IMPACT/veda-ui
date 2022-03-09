/**
 * Add interceptor capabilities to the reducer.
 * An interceptor is a function that works exactly as a reducer, but allows for
 * both state and action changes. It must return an object with keys { state,
 * action }. These new props will be passed to the reducer.
 *
 * @param {function} reducer The reducer function
 * @param {function} interceptor The interceptor function
 * @returns function
 */
export function withReducerInterceptor(reducer, interceptor) {
  // Sensible default that does nothing.
  const intercept =
    typeof interceptor === 'function'
      ? interceptor
      : (state, action) => ({ state, action });

  return (state, action) => {
    const { state: newState, action: newAction } = intercept(state, action);

    if (!newAction) {
      throw new Error(
        `The \`interceptor\` must return an object with keys \`{ action, state }\``
      );
    }
    return reducer(newState, newAction);
  };
}
