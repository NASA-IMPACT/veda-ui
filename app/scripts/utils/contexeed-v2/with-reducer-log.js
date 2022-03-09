/**
 * Adds logging capabilities to a reducer function outputting prev/next state.
 * @param {function} reducer The reducer function
 * @returns function
 */
export function withReducerLogs(reducer) {
  /* eslint-disable no-console */
  return (state, action) => {
    const nextState = reducer(state, action);

    console.groupCollapsed(action.type);
    console.log('%c%s', 'color: gray; font-weight: bold', 'prev state ', state);
    console.log('%c%s', 'color: cyan; font-weight: bold', 'action ', action);
    console.log(
      '%c%s',
      'color: green; font-weight: bold',
      'next state ',
      nextState
    );
    console.groupEnd();
    return nextState;
  };
  /* eslint-enable no-console */
}
