import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Button } from '@devseed-ui/button';
import { listReset, media, themeVal } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import vedaThematics from 'veda/thematics';

import rootCoverImage from '../../../graphics/layout/root-welcome--cover.jpg';
import ThematicAreasList from './thematic-areas-list';
import FeaturedDiscoveries from './featured-discoveries';
import ValueProposition from './value-propostion';

import { LayoutProps } from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import {
  Fold,
  FoldHeader,
  FoldTitle,
  FoldLead,
  FoldBody
} from '$components/common/fold';
import { PageMainContent } from '$styles/page';
import { VarProse } from '$styles/variable-components';
import { variableGlsp } from '$styles/variable-utils';
import { PageActions, PageLead } from '$styles/page';
import Hug from '$styles/hug';

const BlockAudience = styled.article`
  display: flex;
  flex-flow: column nowrap;
  gap: ${variableGlsp()};
`;

const BlockAudienceProse = styled(VarProse)`
  /* styled-component */
`;

const BlockAudienceMedia = styled.figure`
  order: -1;
  overflow: hidden;
  border-radius: ${themeVal('shape.ellipsoid')};
`;

const AudienceList = styled.ul`
  ${listReset()};
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: ${variableGlsp()};

  ${media.smallUp`
    grid-template-columns: repeat(2, 1fr);
  `}

  ${media.largeUp`
    grid-template-columns: repeat(4, 1fr);
  `}
`;

const Connections = styled(Hug)`
  background: ${themeVal('color.base-50')};
  padding-top: ${variableGlsp(2)};
  padding-bottom: ${variableGlsp(2)};
  box-shadow: inset 0 -1px 0 0 ${themeVal('color.base-100a')};
`;

const ConnectionsBlock = styled.div`
  /* styled component */
`;

const ConnectionsBlockTitle = styled(Heading).attrs({
  as: 'h2',
  size: 'medium'
})``;

const ConnectionsList = styled.ul`
  ${listReset()};
`;

const PageHeroHome = styled(PageHero)`
  /* styled component */
`;

const appTitle = process.env.APP_TITLE;

function RootHome() {
  return (
    <PageMainContent>
      <LayoutProps title='Welcome' />
      <PageHeroHome
        title={`Welcome to ${appTitle}`}
        renderBetaBlock={() => (
          <>
            <PageLead>
              {appTitle} is NASA&apos;s open-source Earth Science platform in
              the cloud.
            </PageLead>
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
        coverSrc={rootCoverImage}
        coverAlt='Satellite imagery of Dasht-e Kevir, or Great Salt Desert, the largest desert in Iran.'
        attributionAuthor='USGS'
        attributionUrl='https://unsplash.com/photos/hSh_X3kJ4bI'
      />

      <ThematicAreasList />

      <FeaturedDiscoveries />

      <ValueProposition />

      <Fold>
        <FoldHeader>
          <FoldTitle>VEDA serves a wide scientific audience</FoldTitle>
          <FoldLead>
            VEDA makes science based on NASA datasets inclusive, accessible, and
            reproducible.
          </FoldLead>
        </FoldHeader>
        <FoldBody>
          <AudienceList>
            <li>
              <BlockAudience>
                <BlockAudienceProse>
                  <h3>Earth scientists</h3>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Donec dignissim est id odio vehicula pharetra. Praesent id
                    felis ac nulla vulputate dignissim.
                  </p>
                </BlockAudienceProse>
                <BlockAudienceMedia>
                  <img src='https://via.placeholder.com/640' alt='Fold image' />
                </BlockAudienceMedia>
              </BlockAudience>
            </li>

            <li>
              <BlockAudience>
                <BlockAudienceProse>
                  <h3>Advanced researchers</h3>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Donec dignissim est id odio vehicula pharetra. Praesent id
                    felis ac nulla vulputate dignissim.
                  </p>
                </BlockAudienceProse>
                <BlockAudienceMedia>
                  <img src='https://via.placeholder.com/640' alt='Fold image' />
                </BlockAudienceMedia>
              </BlockAudience>
            </li>

            <li>
              <BlockAudience>
                <BlockAudienceProse>
                  <h3>Data producers</h3>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Donec dignissim est id odio vehicula pharetra. Praesent id
                    felis ac nulla vulputate dignissim.
                  </p>
                </BlockAudienceProse>
                <BlockAudienceMedia>
                  <img src='https://via.placeholder.com/640' alt='Fold image' />
                </BlockAudienceMedia>
              </BlockAudience>
            </li>

            <li>
              <BlockAudience>
                <BlockAudienceProse>
                  <h3>General public</h3>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Donec dignissim est id odio vehicula pharetra. Praesent id
                    felis ac nulla vulputate dignissim.
                  </p>
                </BlockAudienceProse>
                <BlockAudienceMedia>
                  <img src='https://via.placeholder.com/640' alt='Fold image' />
                </BlockAudienceMedia>
              </BlockAudience>
            </li>
          </AudienceList>
        </FoldBody>
      </Fold>

      <Connections>
        <ConnectionsBlock>
          <ConnectionsBlockTitle>Thematic Areas</ConnectionsBlockTitle>
          <ConnectionsList>
            {vedaThematics.map((t) => (
              <li key={t.id}>
                <Link to={t.id}>{t.name}</Link>
              </li>
            ))}
          </ConnectionsList>
        </ConnectionsBlock>
      </Connections>
    </PageMainContent>
  );
}

export default RootHome;
