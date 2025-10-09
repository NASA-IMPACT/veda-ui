import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Button } from '@devseed-ui/button';
import { getOverride, getSiteAlertFromVedaConfig } from 'veda';

import rootCoverImage from '../../../graphics/layout/root-welcome--cover.jpg';

import FeaturedStories from './featured-stories';
import ValueProposition from './value-propostion';
import Audience from './audience';
import ConnectionsSection from './connections-section';

import { LayoutProps } from '$components/common/layout-root';
import { useFeedbackModal } from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import { PageMainContent } from '$styles/page';
import { PageActions, PageLead } from '$styles/page';
import {
  ComponentOverride,
  ContentOverride
} from '$components/common/page-overrides';
import { checkEnvFlag } from '$utils/utils';

const isUSWDSEnabled = checkEnvFlag(process.env.ENABLE_USWDS_PAGE_FOOTER);

const homeContent = getOverride('homeContent');

const PageHeroHome = styled(PageHero)`
  /* styled component */
`;

const appTitle = process.env.APP_TITLE;

const getCoverProps = () => {
  const { src, alt, author } = homeContent?.data?.cover || {};

  if (src && alt) {
    const coverProps = {
      coverSrc: src,
      coverAlt: alt
    };

    return author
      ? {
          ...coverProps,
          attributionAuthor: author.name,
          attributionUrl: author.url
        }
      : coverProps;
  } else {
    return {
      coverSrc: rootCoverImage,
      coverAlt:
        'Satellite imagery of Dasht-e Kevir, or Great Salt Desert, the largest desert in Iran.',
      attributionAuthor: 'USGS',
      attributionUrl: 'https://unsplash.com/photos/hSh_X3kJ4bI'
    };
  }
};

function RootHome() {
  const { show: showFeedbackModal } = useFeedbackModal();

  const siteAlert = getSiteAlertFromVedaConfig();
  const renderSiteAlert = !!siteAlert && siteAlert.content && siteAlert.expires;

  return (
    <PageMainContent>
      <LayoutProps
        title='Welcome'
        siteAlert={renderSiteAlert ? { ...siteAlert } : null}
      />
      <ComponentOverride with='homeHero'>
        <PageHeroHome
          title={homeContent?.data.title ?? `Welcome to the ${appTitle}`}
          renderBetaBlock={() => (
            <>
              {homeContent?.data.description ? (
                <PageLead>{homeContent.data.description}</PageLead>
              ) : (
                <PageLead>
                  VEDA (Visualization, Exploration, and Data Analysis) is
                  NASA&apos;s open-source Earth Science platform in the cloud.
                </PageLead>
              )}
              <PageActions>
                <Button
                  forwardedAs={Link}
                  to='/about'
                  size='large'
                  variation='achromic-outline'
                >
                  Learn more
                </Button>
              </PageActions>
            </>
          )}
          {...getCoverProps()}
        />
      </ComponentOverride>

      <ContentOverride with='homeContent'>
        <Audience />

        <FeaturedStories />

        <ValueProposition />

        {!isUSWDSEnabled && (
          <ConnectionsSection showFeedbackModal={showFeedbackModal} />
        )}
      </ContentOverride>
    </PageMainContent>
  );
}

export default RootHome;
