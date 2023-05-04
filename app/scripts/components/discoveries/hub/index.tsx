import React, { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { DiscoveryData, discoveries } from 'veda';
import { glsp, media } from '@devseed-ui/theme-provider';
import { Subtitle } from '@devseed-ui/typography';
import { Button } from '@devseed-ui/button';
import { CollecticonXmarkSmall } from '@devseed-ui/collecticons';
import { VerticalDivider } from '@devseed-ui/toolbar';

import FeaturedDiscoveries from './featured-discoveries';
import PublishedDate from './pub-date';

import BrowseControls from '$components/common/browse-controls';
import {
  Actions,
  optionAll,
  useBrowserControls
} from '$components/common/browse-controls/use-browse-controls';
import {
  LayoutProps,
  useSlidingStickyHeaderProps
} from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import {
  Fold,
  FoldHeader,
  FoldHeadline,
  FoldTitle
} from '$components/common/fold';
import {
  Card,
  CardList,
  CardMeta,
  CardTopicsList
} from '$components/common/card';
import EmptyHub from '$components/common/empty-hub';
import { PageMainContent } from '$styles/page';
import { DISCOVERIES_PATH, getDiscoveryPath } from '$utils/routes';
import TextHighlight from '$components/common/text-highlight';
import Pluralize from '$utils/pluralize';
import { Pill } from '$styles/pill';

const allDiscoveries = Object.values(discoveries).map((d) => d!.data);

const DiscoveryCount = styled(Subtitle)`
  grid-column: 1 / -1;
  display: flex;
  gap: ${glsp(0.5)};

  span {
    text-transform: uppercase;
    line-height: 1.5rem;
  }
`;

const BrowseHeader = styled(FoldHeader)`
  ${media.largeUp`
    ${FoldHeadline} {
      align-self: flex-start;
    }

    ${BrowseControls} {
      padding-top: 1rem;
    }
  `}
`;

const topicsOptions = [
  optionAll,
  // TODO: human readable values for Taxonomies
  ...Array.from(new Set(allDiscoveries.flatMap((d) => d.thematics || []))).map(
    (t) => ({
      id: t,
      name: t
    })
  )
];

const sourcesOptions = [optionAll];

const sortOptions = [
  { id: 'name', name: 'Name' },
  { id: 'pubDate', name: 'Date' }
];

const prepareDiscoveries = (data: DiscoveryData[], options) => {
  const { sortField, sortDir, search, topic, source } = options;

  let filtered = [...data];

  // Does the free text search appear in specific fields?
  if (search.length >= 3) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (d) =>
        d.name.toLowerCase().includes(searchLower) ||
        d.description.toLowerCase().includes(searchLower) ||
        d.thematics?.some((t) => t.toLowerCase().includes(searchLower))
    );
  }

  if (topic !== optionAll.id) {
    filtered = filtered.filter((d) => d.thematics?.includes(topic));
  }

  if (source !== optionAll.id) {
    // TODO: Filter source
  }

  /* eslint-disable-next-line fp/no-mutating-methods */
  filtered.sort((a, b) => {
    if (!a[sortField]) return Infinity;

    return a[sortField]?.localeCompare(b[sortField]);
  });

  // In the case of the date, ordering is reversed.
  if (sortField === 'pubDate') {
    /* eslint-disable-next-line fp/no-mutating-methods */
    filtered.reverse();
  }

  if (sortDir === 'desc') {
    /* eslint-disable-next-line fp/no-mutating-methods */
    filtered.reverse();
  }

  return filtered;
};

function DiscoveriesHub() {
  const controlVars = useBrowserControls({
    topicsOptions,
    sourcesOptions,
    sortOptions
  });

  const { topic, source, sortField, sortDir, onAction } = controlVars;
  const search = controlVars.search ?? '';

  const displayDiscoveries = useMemo(
    () =>
      prepareDiscoveries(allDiscoveries, {
        search,
        topic,
        source,
        sortField,
        sortDir
      }),
    [search, topic, source, sortField, sortDir]
  );

  const isFiltering = !!(
    topic !== optionAll.id ||
    source !== optionAll.id ||
    search
  );

  const browseControlsHeaderRef = useRef<HTMLDivElement>(null);
  const { headerHeight } = useSlidingStickyHeaderProps();

  return (
    <PageMainContent>
      <LayoutProps
        title='Discoveries'
        description='Explore the guided narratives below to discover how NASA satellites and other Earth observing resources reveal a changing planet.'
      />
      <PageHero
        title='Discoveries'
        description='Explore the guided narratives below to discover how NASA satellites and other Earth observing resources reveal a changing planet.'
      />

      <FeaturedDiscoveries />

      <Fold>
        <BrowseHeader
          ref={browseControlsHeaderRef}
          style={{
            scrollMarginTop: `${headerHeight + 16}px`
          }}
        >
          <FoldHeadline>
            <FoldTitle>Browse</FoldTitle>
          </FoldHeadline>
          <BrowseControls
            {...controlVars}
            topicsOptions={topicsOptions}
            sourcesOptions={sourcesOptions}
            sortOptions={sortOptions}
          />
        </BrowseHeader>

        <DiscoveryCount>
          <span>
            Showing{' '}
            <Pluralize
              singular='discovery'
              plural='discoveries'
              count={displayDiscoveries.length}
              showCount={true}
            />{' '}
            out of {allDiscoveries.length}.
          </span>
          {isFiltering && (
            <Button forwardedAs={Link} to={DISCOVERIES_PATH} size='small'>
              Clear filters <CollecticonXmarkSmall />
            </Button>
          )}
        </DiscoveryCount>

        {displayDiscoveries.length ? (
          <CardList>
            {displayDiscoveries.map((d) => {
              const pubDate = new Date(d.pubDate);
              return (
                <li key={d.id}>
                  <Card
                    cardType='classic'
                    overline={
                      <CardMeta>
                        <Link
                          to={`${DISCOVERIES_PATH}?${Actions.SOURCE}=${'eis'}`}
                          onClick={(e) => {
                            e.preventDefault();
                            onAction(Actions.SOURCE, 'eis');
                            browseControlsHeaderRef.current?.scrollIntoView();
                          }}
                        >
                          By SOURCE
                        </Link>
                        {!isNaN(pubDate.getTime()) && (
                          <>
                            <VerticalDivider variation='dark' />
                            <Link
                              to={`${DISCOVERIES_PATH}?${Actions.SORT_FIELD}=pubDate`}
                              onClick={(e) => {
                                e.preventDefault();
                                onAction(Actions.SORT_FIELD, 'pubDate');
                              }}
                            >
                              <PublishedDate date={pubDate} />
                            </Link>
                          </>
                        )}
                      </CardMeta>
                    }
                    linkLabel='View more'
                    linkTo={getDiscoveryPath(d)}
                    title={
                      <TextHighlight
                        value={search}
                        disabled={search.length < 3}
                      >
                        {d.name}
                      </TextHighlight>
                    }
                    description={
                      <TextHighlight
                        value={search}
                        disabled={search.length < 3}
                      >
                        {d.description}
                      </TextHighlight>
                    }
                    imgSrc={d.media?.src}
                    imgAlt={d.media?.alt}
                    footerContent={
                      <>
                        {d.thematics?.length ? (
                          <CardTopicsList>
                            <dt>Topics</dt>
                            {d.thematics.map((t) => (
                              <dd key={t}>
                                <Pill
                                  as={Link}
                                  to={`${DISCOVERIES_PATH}?${Actions.TOPIC}=${t}`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    onAction(Actions.TOPIC, t);
                                    browseControlsHeaderRef.current?.scrollIntoView();
                                  }}
                                >
                                  <TextHighlight
                                    value={search}
                                    disabled={search.length < 3}
                                  >
                                    {t}
                                  </TextHighlight>
                                </Pill>
                              </dd>
                            ))}
                          </CardTopicsList>
                        ) : null}
                      </>
                    }
                  />
                </li>
              );
            })}
          </CardList>
        ) : (
          <EmptyHub>
            There are no discoveries to show with the selected filters.
          </EmptyHub>
        )}
      </Fold>
    </PageMainContent>
  );
}

export default DiscoveriesHub;
