import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { glsp, media, multiply, themeVal } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';

import deltaThematics from 'delta/thematics';

import { LayoutProps } from '$components/common/layout-root';

import { thematicDatasetsPath, thematicDiscoveriesPath } from '$utils/routes';
import { useThematicArea } from '$utils/thematics';

import { resourceNotFound } from '$components/uhoh';

import { VarProse } from '$styles/variable-components';
import { variableGlsp } from '$styles/variable-utils';
import { GridTemplateFull, GridTemplateHalf } from '$styles/grid';
import Hug from '$styles/hug';
import { PageLead, PageMainContent, PageMainTitle } from '$styles/page';

import { Fold } from '$components/common/fold';
import { Card, CardList } from '$components/common/card';

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

const FeatureCard = styled.div`
  padding: ${glsp(1)};
  background: ${themeVal('color.base-50')};
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
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
            Welcome to the {thematic.data.name} dashboard
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
          <h2>Featured discoveries</h2>
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
          <h2>Featured datasets</h2>
          <CardList>
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
          </CardList>
        </Fold>
      )}

      <Fold>
        <GridTemplateFull>
          <h3> Featured Datasets</h3>
        </GridTemplateFull>
        <GridTemplateHalf>
          <FeatureCard>
            <h4> Nitrogen Dioxide</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse facilisis sollicitudin magna, eget accumsan dolor
              molestie quis. Aliquam sit amet erat nec risus dapibus efficitur.
              Sed tristique ultrices libero eu pulvinar. Pellentesque ac auctor
              felis. Vestibulum varius mattis lectus, at dignissim nulla
              interdum.
            </p>
            <Button
              forwardedAs={Link}
              to='about'
              size='large'
              variation='primary-fill'
            >
              Learn more
            </Button>
          </FeatureCard>
          <FeatureCard>
            <h4> Get air quality data</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse facilisis sollicitudin magna, eget accumsan dolor
              molestie quis. Aliquam sit amet erat nec risus dapibus efficitur.
              Sed tristique ultrices libero eu pulvinar. Pellentesque ac auctor
              felis. Vestibulum varius mattis lectus, at dignissim nulla
              interdum.
            </p>
          </FeatureCard>
        </GridTemplateHalf>
      </Fold>
      {!!otherThematicAreas.length && (
        <Fold>
          <h2>Other thematic areas</h2>
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
