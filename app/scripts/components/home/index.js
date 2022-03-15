import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import {
  glsp,
  listReset,
  media,
  multiply,
  themeVal
} from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';

import deltaThematics from 'delta/thematics';

import { LayoutProps } from '$components/common/layout-root';

import { thematicDatasetsPath, thematicDiscoveriesPath } from '$utils/routes';
import { useThematicArea } from '$utils/thematics';

import { resourceNotFound } from '$components/uhoh';

import { VarProse } from '$styles/variable-components';
import { variableGlsp } from '$styles/variable-utils';
import Hug from '$styles/hug';
import { PageLead, PageMainContent, PageMainTitle } from '$styles/page';

import { Fold, FoldHeader, FoldTitle } from '$components/common/fold';
import { Card, CardBody, CardHeader, CardList, CardSelf, CardTitle } from '$components/common/card';

const IntroFold = styled(Hug)`
  padding-top: ${variableGlsp(2)};
  padding-bottom: ${variableGlsp(2)};
  align-items: center;
  background: ${themeVal('color.primary')};
  color: ${themeVal('color.surface')};
  box-shadow: inset 0 1px 0 0 ${themeVal('color.surface-100a')};
`;

const IntroFoldFigure = styled.figure`
  grid-column: content-start / content-end;

  ${media.largeUp`
    grid-column:  content-start / content-7;
    grid-row: 1;
  `}

  img {
    border-radius: ${multiply(themeVal('shape.rounded'), 2)};
  }
`;

const IntroFoldProse = styled(VarProse)`
  grid-column: content-start / content-end;

  ${media.largeUp`
    grid-column: content-8 / content-end;
  `}
`;

const IntroFoldActions = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: ${glsp(0.75)};
  align-items: center;
`;

const FeaturedDatasets = styled.div`
  grid-column: 1 / -1;
  grid-row: 2;

  ${media.largeUp`
    grid-column: 1 / 7;
  `}
`;

const FeaturedDatasetsList = styled.ol`
  ${listReset()}
`;

const FeaturedAnalysis = styled(CardSelf)`
  grid-column: 1 / -1;
  grid-row: 3;

  ${media.largeUp`
    grid-column: 7 / span 6;
    grid-row: 2;
  `}
`;

function Home() {
  const thematic = useThematicArea();
  if (!thematic) throw resourceNotFound();

  const otherThematicAreas = deltaThematics.filter(
    (t) => t.id !== thematic.data.id
  );

  const featuredDatasets = thematic.data.datasets.filter((d) => d.featured);
  const featuredDiscoveries = thematic.data.discoveries.filter(
    (d) => d.featured
  );

  return (
    <PageMainContent>
      <LayoutProps title={thematic.data.name} />

      <IntroFold>
        <IntroFoldFigure>
          <img
            src='https://via.placeholder.com/1024x512'
            alt='Placeholder image'
          />
        </IntroFoldFigure>
        <IntroFoldProse>
          <PageMainTitle>
            Welcome to the {thematic.data.name} thematic area
          </PageMainTitle>
          <PageLead>{thematic.data.description}</PageLead>
          <IntroFoldActions>
            <Button
              forwardedAs={Link}
              to='about'
              size='large'
              variation='achromic-outline'
            >
              Learn more
            </Button>
          </IntroFoldActions>
        </IntroFoldProse>
      </IntroFold>

      {!!featuredDiscoveries.length && (
        <Fold>
          <FoldHeader>
            <FoldTitle>Featured discoveries</FoldTitle>
            <Button
              forwardedAs={Link}
              to='discoveries'
              size='large'
              variation='primary-outline'
            >
              View all
            </Button>
          </FoldHeader>
          <CardList>
            {featuredDiscoveries.map((t) => (
              <li key={t.id}>
                <Card
                  linkLabel='View more'
                  linkTo={t.id}
                  title={t.name}
                  parentName='Discovery'
                  parentTo={thematicDiscoveriesPath(thematic)}
                  description={t.description}
                  date={t.pubDate ? new Date(t.pubDate) : null}
                  imgSrc={t.media.src}
                  imgAlt={t.media.alt}
                />
              </li>
            ))}
          </CardList>
        </Fold>
      )}

      {!!featuredDatasets.length && (
        <Fold>
          <FoldHeader>
            <FoldTitle>Featured datasets</FoldTitle>
            <Button
              forwardedAs={Link}
              to='datasets'
              size='large'
              variation='primary-outline'
            >
              View all
            </Button>
          </FoldHeader>
          <FeaturedDatasets>
            <FeaturedDatasetsList>
              {featuredDatasets.map((t) => (
                <li key={t.id}>
                  <Card
                    cardType='cover'
                    linkLabel='View more'
                    linkTo={t.id}
                    title={t.name}
                    parentName='Dataset'
                    parentTo={thematicDatasetsPath(thematic)}
                    description={t.description}
                    imgSrc={t.media.src}
                    imgAlt={t.media.alt}
                  />
                </li>
              ))}
            </FeaturedDatasetsList>
          </FeaturedDatasets>

          <FeaturedAnalysis>
            <CardHeader>
              <CardTitle>Get air quality data</CardTitle>
            </CardHeader>
            <CardBody>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse facilisis sollicitudin magna, eget accumsan dolor
                molestie quis. Aliquam sit amet erat nec risus dapibus
                efficitur. Sed tristique ultrices libero eu pulvinar.
                Pellentesque ac auctor felis. Vestibulum varius mattis lectus,
                at dignissim nulla interdum.
              </p>
            </CardBody>
          </FeaturedAnalysis>
        </Fold>
      )}

      {!!otherThematicAreas.length && (
        <Fold>
          <FoldHeader>
            <FoldTitle>Other thematic areas</FoldTitle>
          </FoldHeader>
          <CardList>
            {otherThematicAreas.map((t) => (
              <li key={t.id}>
                <Card
                  cardType='cover'
                  linkLabel='View more'
                  linkTo={`/${t.id}`}
                  title={t.name}
                  parentName='Area'
                  parentTo='/'
                  description={t.description}
                  overline={`has ${t.datasets.length} datasets & ${t.discoveries.length} discoveries`}
                  imgSrc={t.media.src}
                  imgAlt={t.media.alt}
                />
              </li>
            ))}
          </CardList>
        </Fold>
      )}
    </PageMainContent>
  );
}

export default Home;
