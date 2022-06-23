import React from 'react';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import { CollecticonSpeechBalloon } from '@devseed-ui/collecticons';

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
          NASA started development of the VEDA Dashboard in December 2021. This
          early version reflects the next iteration on work completed for the{' '}
          <a href='https://earthdata.nasa.gov/covid19/'>COVID dashboard</a> and
          will continue to evolve as more functionality is developed.
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
          can use the feedback option on this website.
        </p>
        <ContributeCta>
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
