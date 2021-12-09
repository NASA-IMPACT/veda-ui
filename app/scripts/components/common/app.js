import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { reveal } from '@devseed-ui/animation';

import MetaTags from './meta-tags';
import PageHeader from './page-header';
import PageFooter from './page-footer';

const appTitle = process.env.APP_TITLE;
const appDescription = process.env.APP_DESCRIPTION;

const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const PageBody = styled.div`
  flex-grow: 1;
  animation: ${reveal} 0.48s ease 0s 1;
  display: flex;
  flex-direction: column;
`;

function App(props) {
  const { pageTitle, children } = props;

  const truncatedTitle =
    pageTitle?.length > 32 ? `${pageTitle.slice(0, 32)}...` : pageTitle;

  const title = truncatedTitle ? `${truncatedTitle} — ` : '';

  return (
    <Page>
      <MetaTags title={`${title}${appTitle}`} description={appDescription} />
      <PageHeader />
      <PageBody>{children}</PageBody>
      <PageFooter />
    </Page>
  );
}

App.propTypes = {
  pageTitle: T.string,
  children: T.node
};

export default App;
