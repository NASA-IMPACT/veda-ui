import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { listReset, media } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';
import { Overline } from '@devseed-ui/typography';

import deltaThematics from 'delta/thematics';

import { LayoutProps } from '$components/common/layout-root';

import { thematicDatasetsPath, thematicDiscoveriesPath } from '$utils/routes';
import { useThematicArea } from '$utils/thematics';
import Pluralize from '$utils/pluralize';
import { zeroPad } from '$utils/format';

import { resourceNotFound } from '$components/uhoh';

import { VarHeading } from '$styles/variable-components';
import { variableBaseType, variableGlsp } from '$styles/variable-utils';
import {
  PageActions,
  PageLead,
  PageMainContent,
  PageMainTitle
} from '$styles/page';

import PageHero, { PageHeroHGroup } from '$components/common/page-hero';
import { Fold, FoldHeader, FoldTitle } from '$components/common/fold';
import { Card, CardList } from '$components/common/card';

const StatsList = styled.dl`
  display: grid;
  grid-auto-columns: min-content;
  grid-auto-rows: auto;
  grid-auto-flow: column;
  gap: ${variableGlsp(0, 1)};
  align-items: end;

  a,
  a:visited {
    display: block;
    color: inherit;
  }
`;

const StatsListKey = styled(Overline).attrs({
  as: 'dt'
})`
  grid-row: 1;
  opacity: 0.64;
  color: inherit;
  font-size: ${variableBaseType('0.75rem')};
  line-height: ${variableBaseType('1rem')};

  && {
    font-weight: 400;
  }
`;

const StatsListValue = styled(VarHeading).attrs({
  as: 'dd',
  size: 'jumbo'
})`
  grid-row: 2;
`;

const FeaturedSlider = styled.div`
  grid-column: 1 / -1;
  grid-row: 2;
`;

const FeaturedList = styled.ol`
  ${listReset()}

  li > * {
    min-height: 16rem;

    ${media.smallUp`
      min-height: 20rem;
    `}

    ${media.mediumUp`
      min-height: 20rem;
    `}

    ${media.largeUp`
      min-height: 24rem;
    `}

    ${media.xlargeUp`
      min-height: 28rem;
    `}
  }

  li:not(:first-child) {
    display: none;
  }
`;

function Home() {
  const thematic = useThematicArea();
  if (!thematic) throw resourceNotFound();

  const otherThematicAreas = deltaThematics.filter(
    (t) => t.id !== thematic.data.id
  );

  const featuredDatasets = thematic.data.datasets.filter((d) => {
    return d.featuredOn?.find((thematicId) => thematicId === thematic.data.id);
  });

  const featuredDiscoveries = thematic.data.discoveries.filter((d) => {
    return d.featuredOn?.find((thematicId) => thematicId === thematic.data.id);
  });

  return (
    <PageMainContent>
      <LayoutProps title={thematic.data.name} />
      <PageHero
        title={`Welcome to the ${thematic.data.name} thematic area`}
        renderAlphaBlock={() => (
          <>
            <PageHeroHGroup>
              <PageMainTitle>
                Welcome to the {thematic.data.name} thematic area
              </PageMainTitle>
            </PageHeroHGroup>
            <StatsList>
              <StatsListKey>
                <Pluralize
                  singular='Discovery'
                  plural='Discoveries'
                  count={thematic.data.datasets.length}
                  showCount={false}
                />
              </StatsListKey>
              <StatsListValue>
                <Link to='discoveries'>
                  {zeroPad(thematic.data.datasets.length)}
                </Link>
              </StatsListValue>
              <StatsListKey>
                <Pluralize
                  singular='Dataset'
                  count={thematic.data.datasets.length}
                  showCount={false}
                />
              </StatsListKey>
              <StatsListValue>
                <Link to='datasets'>
                  {zeroPad(thematic.data.datasets.length)}
                </Link>
              </StatsListValue>
            </StatsList>
          </>
        )}
        renderBetaBlock={() => (
          <>
            <PageLead>{thematic.data.description}</PageLead>
            <PageActions>
              <Button
                forwardedAs={Link}
                to='about'
                size='large'
                variation='achromic-outline'
              >
                Learn more
              </Button>
            </PageActions>
          </>
        )}
        coverSrc={thematic.data.media?.src}
        coverAlt={thematic.data.media?.alt}
        attributionAuthor={thematic.data.media?.author?.name}
        attributionUrl={thematic.data.media?.author?.url}
      />

      {!!featuredDiscoveries.length && (
        <Fold forwardedAs='section'>
          <FoldHeader as='header'>
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
          <FeaturedSlider>
            <FeaturedList>
              {featuredDiscoveries.map((t) => (
                <li key={t.id}>
                  <Card
                    cardType='featured'
                    linkLabel='View more'
                    linkTo={`${thematicDiscoveriesPath(thematic)}/${t.id}`}
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
            </FeaturedList>
          </FeaturedSlider>
        </Fold>
      )}
      {!!featuredDatasets.length && (
        <Fold forwardedAs='section'>
          <FoldHeader as='header'>
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
          <FeaturedSlider>
            <FeaturedList>
              {featuredDatasets.map((t) => (
                <li key={t.id}>
                  <Card
                    cardType='featured'
                    linkLabel='View more'
                    linkTo={`${thematicDatasetsPath(thematic)}/${t.id}`}
                    title={t.name}
                    parentName='Dataset'
                    parentTo={thematicDatasetsPath(thematic)}
                    description={t.description}
                    imgSrc={t.media.src}
                    imgAlt={t.media.alt}
                  />
                </li>
              ))}
            </FeaturedList>
          </FeaturedSlider>
        </Fold>
      )}

      {!!otherThematicAreas.length && (
        <Fold forwardedAs='section'>
          <FoldHeader as='header'>
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
                  overline={
                    <>
                      <i>Contains </i>
                      <Pluralize
                        zero='no datasets'
                        singular='dataset'
                        count={t.datasets.length}
                      />
                      {' / '}
                      <Pluralize
                        zero='no discoveries'
                        singular='discovery'
                        plural='discoveries'
                        count={t.discoveries.length}
                      />
                    </>
                  }
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
