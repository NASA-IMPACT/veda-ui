import React from 'react';
import T from 'prop-types';
import { useLocation } from 'react-router-dom';
import nl2br from 'react-nl2br';

import UhOh from '.';
import LayoutRoot, {
  LayoutProps,
  LayoutRootContextProvider
} from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import { FoldProse } from '$components/common/fold';
import { PageLead, PageMainContent } from '$styles/page';

import { makeAbsUrl } from '$utils/history';
import { useEffectPrevious } from '$utils/use-effect-previous';

export default class ErrorBoundary extends React.Component {
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
        <LayoutProps title='Critical Error' />
        <PageMainContent>
          <PageHero
            title='Critical Error'
            description={`That's a fatal error.`}
          />
          <FoldProse>
            <p>
              Something went wrong and we were not able to fulfill your request.
              This is on our side and we&apos;ll fix it!
            </p>
            <p>
              In the meantime you can try again by refreshing the page or visit
              the{' '}
              <a href={makeAbsUrl('/')} title='Visit homepage'>
                homepage
              </a>
              .
            </p>
            <p>
              If this error keeps on happening you can reach us via{' '}
              <a
                href={`mailto:${process.env.APP_CONTACT_EMAIL}`}
                title='Send us an email'
              >
                {process.env.APP_CONTACT_EMAIL}
              </a>
            </p>

            <details>
              <summary>Error details</summary>
              <strong>{error.message}</strong>
              <p>{nl2br(error.stack)}</p>
            </details>
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
