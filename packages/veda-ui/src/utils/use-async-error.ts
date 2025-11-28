import { useState, useCallback } from 'react';

// React's api getDerivedStateFromError that we are using to throw an error in
// BlockErrorBoundary doesn't catch async errors. To catch async errors we use
// this workaround - it works if an error is thrown in useState hook. More in
// this thread: https://github.com/facebook/react/issues/14981
const useAsyncError = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setError] = useState();
  return useCallback(
    (e:Error) => {
      setError(() => {
        throw e;
      });
    },
    [setError]
  );
};

export default useAsyncError;