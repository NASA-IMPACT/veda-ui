import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { generalErrorMessage } from '../common/blocks/block-constant';
import { HintedErrorDisplay, docsMessage } from '$utils/hinted-error';
import { BlockComponent } from '$components/common/blocks';

export const MDXBlockError = ({ error }: any) => {
  return (
    <HintedErrorDisplay
      title={generalErrorMessage}
      subtitle={docsMessage}
      message={error.message}
      hints={error.hints}
    />
  );
};

class ErrorBoundaryWithCRAReset extends ErrorBoundary {
  static getDerivedStateFromError(error: Error) {
    (error as any).CRAOverlayIgnore = true;
    return { didCatch: true, error };
  }
}

export const MDXBlockWithError = (props) => {
  // const result = useContext(MDXContext);

  return (
    <ErrorBoundaryWithCRAReset
      FallbackComponent={MDXBlockError}
      // resetKeys={[result]}
    >
      <BlockComponent {...props} />
    </ErrorBoundaryWithCRAReset>
  );
};