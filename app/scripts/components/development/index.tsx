import React from 'react';
import styled from 'styled-components';
import { getOverride } from 'veda';
import { Button } from '@devseed-ui/button';
import {
  CollecticonSpeechBalloon,
  CollecticonBrandGithub
} from '@devseed-ui/collecticons';

import { LayoutProps, useFeedbackModal } from '$components/common/layout-root';
import { PageMainContent } from '$styles/page';

import PageHero from '$components/common/page-hero';
import { FoldProse } from '$components/common/fold';
import { variableGlsp } from '$styles/variable-utils';
import { ContentOverride } from '$components/common/page-overrides';

const ContributeCta = styled.div`
  display: flex;
  gap: ${variableGlsp()};
`;

const developmentContent = getOverride('developmentContent');

function Development() {
  const { show: showFeedbackModal } = useFeedbackModal();

  return (
    <PageMainContent>
      <LayoutProps title='Development' />
      <PageHero
        title={developmentContent?.data.title || 'Development & contributing'}
        description={
          developmentContent?.data.description ||
          'Visualization, Exploration, and Data Analysis (VEDA): Scalable and Interactive System for Science Data.'
        }
      />

      <ContentOverride with='developmentContent'>
        <FoldProse>
          <p>
            NASA started development of the VEDA Dashboard in December 2021.
            This early version reflects the next iteration on work completed for
            the{' '}
            <a href='https://earthdata.nasa.gov/covid19/'>COVID dashboard</a>{' '}
            and will continue to evolve as more functionality is developed.
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
                showFeedbackModal();
              }}
            >
              <CollecticonSpeechBalloon /> Feedback
            </Button>
            <Button
              size='large'
              fitting='relaxed'
              forwardedAs='a'
              href='https://github.com/NASA-IMPACT/veda-config/releases'
              variation='primary-fill'
            >
              <CollecticonBrandGithub /> Releases
            </Button>
          </ContributeCta>
        </FoldProse>
      </ContentOverride>
    </PageMainContent>
  );
}

export default Development;
