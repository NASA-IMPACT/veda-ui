import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Button } from '@devseed-ui/button';
import { glsp, listReset, media, themeVal } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import { CollecticonChevronRightSmall } from '@devseed-ui/collecticons';
import { getOverride, getBannerFromVedaConfig } from 'veda';

import rootCoverImage from '../../../graphics/layout/root-welcome--cover.jpg';

import FeaturedStories from './featured-stories';
import ValueProposition from './value-propostion';
import Audience from './audience';

import { LayoutProps } from '$components/common/layout-root';
import { useFeedbackModal } from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import { PageMainContent } from '$styles/page';
import { variableGlsp } from '$styles/variable-utils';
import { PageActions, PageLead } from '$styles/page';
import Hug from '$styles/hug';
import {
  ComponentOverride,
  ContentOverride
} from '$components/common/page-overrides';



const homeContent = getOverride('homeContent');

const Connections = styled(Hug)`
  background: ${themeVal('color.base-50')};
  padding-top: ${variableGlsp(2)};
  padding-bottom: ${variableGlsp(2)};
  box-shadow: inset 0 -1px 0 0 ${themeVal('color.base-100a')};
`;

const ConnectionsBlock = styled.div`
  display: flex;
  flex-flow: column nowrap;
  gap: ${variableGlsp()};

  &:nth-child(1) {
    grid-column: content-start / content-3;

    ${media.mediumUp`
      grid-column: content-start / content-4;
    `}

    ${media.largeUp`
      grid-column: content-4 / content-7;
    `}
  }

  &:nth-child(2) {
    grid-column: content-3 / content-end;

    ${media.mediumUp`
      grid-column: content-5 / content-end;
    `}

    ${media.largeUp`
      grid-column: content-7 / content-10;
    `}
  }
`;

const ConnectionsBlockTitle = styled(Heading).attrs({
  as: 'h2',
  size: 'medium'
})``;

const ConnectionsList = styled.ul`
  ${listReset()};

  li {
    margin-bottom: ${glsp(0.25)};
  }

  a {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: ${glsp(0.25)};
    font-weight: ${themeVal('button.type.weight')};
    text-decoration: none;
    transition: opacity 0.24s ease;

    &:visited {
      color: inherit;
    }

    &:hover {
      opacity: 0.64;
    }
  }
`;

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

  const banner = getBannerFromVedaConfig();
  const renderBanner = !!banner && banner.text && banner.url && banner.expires;

  return (
    <PageMainContent>
      <LayoutProps
        title='Welcome'
        banner={renderBanner ? { ...banner } : null}
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

        <Connections>
          <ConnectionsBlock>
            <ConnectionsBlockTitle>About</ConnectionsBlockTitle>
            <ConnectionsList>
              <li>
                <Link to='/about'>
                  <CollecticonChevronRightSmall /> Learn more
                </Link>
              </li>
              <li>
                <a
                  href='#'
                  onClick={(e) => {
                    e.preventDefault();
                    showFeedbackModal();
                  }}
                >
                  <CollecticonChevronRightSmall /> Give feedback
                </a>
              </li>
            </ConnectionsList>
          </ConnectionsBlock>
        </Connections>
      </ContentOverride>
    </PageMainContent>
  );
}

export default RootHome;
