import React from 'react';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import {
  CollecticonBrandGithub,
  CollecticonSpeechBalloon
} from '@devseed-ui/collecticons';

import { LayoutProps } from '$components/common/layout-root';
import { PageMainContent } from '$styles/page';

import PageHero from '$components/common/page-hero';
import { FoldProse } from '$components/common/fold';
import { variableGlsp } from '$styles/variable-utils';

const ContributeCta = styled.div`
  display: flex;
  gap: ${variableGlsp()};
`;

function RootDevelopment() {
  return (
    <PageMainContent>
      <LayoutProps title='Development' />
      <PageHero
        title='Development & contributing'
        description='Visualization, Exploration, and Data Analysis (VEDA): Scalable and Interactive System for Science Data.'
      />
      <FoldProse>
        <p>
          NASA started the development of the Dashboard in May 2020. This
          experimental site reflects a rapid response to COVID-19 currently
          underway and will continue to evolve as more data become available.
        </p>
        <p>
          This dashboard is built by the{' '}
          <a href='https://earthdata.nasa.gov'>
            NASA Earth Science Data Systems program
          </a>{' '}
          with help from various science teams and data providers. We are
          grateful for the many third-party open source projects that we have
          used.
        </p>
        <p>
          We welcome your feedback to help improve the Dashboard. To do so you
          can use the feedback option on this website. For an overview of known
          issues, please consult the Github{' '}
          <a href='https://github.com/NASA-IMPACT/delta-config/issues'>
            issue queue
          </a>
          .
        </p>
      <ContributeCta>
        <Button
          size='large'
          fitting='relaxed'
          forwardedAs='a'
          href='https://github.com/NASA-IMPACT/delta-config'
          variation='primary-fill'
        >
          <CollecticonBrandGithub /> Github
        </Button>
        <Button
          size='large'
          fitting='relaxed'
          variation='primary-fill'
          onClick={() => {
            document.dispatchEvent(new Event('show-feedback-modal'));
          }}
        >
          <CollecticonSpeechBalloon /> Feedback
        </Button>
      </ContributeCta>
      </FoldProse>
    </PageMainContent>
  );
}

export default RootDevelopment;
