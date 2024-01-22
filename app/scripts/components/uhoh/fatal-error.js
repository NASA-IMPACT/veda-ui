import React, { Component } from 'react';
import T from 'prop-types';
import { useLocation } from 'react-router-dom';
import nl2br from 'react-nl2br';
import { CollecticonArrowRight } from '@devseed-ui/collecticons';

import UhOh from '.';
import LayoutRoot, {
  LayoutProps,
  LayoutRootContextProvider
} from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import { FoldProse } from '$components/common/fold';
import { PageMainContent } from '$styles/page';

import { makeAbsUrl } from '$utils/history';
import { useEffectPrevious } from '$utils/use-effect-previous';
import { HintedError, HintedErrorDisplay } from '$utils/hinted-error';

export default class ErrorBoundary extends Component {
  static getDerivedStateFromError(error) {
    return { error: error };
  }

  constructor(props) {
    super(props);
    this.state = { error: null };
    this.clearError = this.clearError.bind(this);
  }

  clearError() {
    this.setState({ error: null });
  }

  render() {
    return (
      <Child
        error={this.state.error}
        clearError={this.clearError}
        {...this.props}
      />
    );
  }
}

// Child component only needed to use hooks.
function Child(props) {
  const { children, error, clearError } = props;
  const { pathname } = useLocation();

  // If the pathname changed (because the user navigated) clear the error so the
  // page renders again.
  useEffectPrevious(
    (_, mounted) => {
      if (mounted) clearError();
    },
    [pathname]
  );

  // eslint-disable-next-line react/prop-types
  if (!error) return children;

  // Note (this is a chicken and egg problem)
  // The error boundary wraps all the contexts (via Composer in main.js) to be
  // able to capture errors that happen in them. When an error occurs those
  // contexts are not rendered and so here we have to add the contexts needed by
  // the elements.

  if (error.resNotFound)
    return (
      <LayoutRootContextProvider>
        <LayoutRoot>
          <UhOh />
        </LayoutRoot>
      </LayoutRootContextProvider>
    );

  return (
    <LayoutRootContextProvider>
      <LayoutRoot>
        <LayoutProps title='Something went wrong' />
        <PageMainContent>
          <PageHero
            title='Something went wrong'
            description={`We couldn&apos;t to load your content.`}
          />
          <FoldProse>
            <p>
              This is on our side and we&apos;ll fix it! In the meantime you can
              try again by refreshing the page or visit the{' '}
              <a href={makeAbsUrl('/')} title='Visit homepage'>
                homepage
              </a>
              .
            </p>

            {error instanceof HintedError ? (
              <HintedErrorDisplay
                title='Error details'
                message={error.message}
                hints={error.hints}
              />
            ) : (
              <details>
                <summary>Error details</summary>
                <strong>{error.message}</strong>
                <p>{nl2br(error.stack)}</p>
              </details>
            )}

            <p>
              <strong>
                <a href={makeAbsUrl('/')} title='Go back to homepage'>
                  <CollecticonArrowRight size='small' />
                  <span>&nbsp;Go back to homepage</span>
                </a>
              </strong>
            </p>
          </FoldProse>
        </PageMainContent>
      </LayoutRoot>
    </LayoutRootContextProvider>
  );
}

Child.propTypes = {
  children: T.node,
  error: T.object,
  clearError: T.func
};
