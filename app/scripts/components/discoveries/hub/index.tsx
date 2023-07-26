import React, { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { DiscoveryData, discoveries, discoveryTaxonomies, getString } from 'veda';
import { glsp } from '@devseed-ui/theme-provider';
import { Subtitle } from '@devseed-ui/typography';
import { Button } from '@devseed-ui/button';
import { CollecticonXmarkSmall } from '@devseed-ui/collecticons';
import { VerticalDivider } from '@devseed-ui/toolbar';

import PublishedDate from '$components/common/pub-date';
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
import { FeaturedDiscoveries } from '$components/common/featured-slider-section';
import { CardSourcesList } from '$components/common/card-sources';
import {
  getTaxonomy,
  TAXONOMY_SOURCE,
  TAXONOMY_TOPICS
} from '$utils/veda-data';

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

const sortOptions = [
  { id: 'name', name: 'Name' },
  { id: 'pubDate', name: 'Date' }
];

const prepareDiscoveries = (
  data: DiscoveryData[],
  options: {
    search: string;
    taxonomies: Record<string, string> | null;
    sortField: string | null;
    sortDir: string | null;
  }
) => {
  const { sortField, sortDir, search, taxonomies } = options;

  let filtered = [...data];

  // Does the free text search appear in specific fields?
  if (search.length >= 3) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter((d) => {
      const topicsTaxonomy = d.taxonomy.find((t) => t.name === TAXONOMY_TOPICS);
      return (
        d.name.toLowerCase().includes(searchLower) ||
        d.description.toLowerCase().includes(searchLower) ||
        topicsTaxonomy?.values.some((t) =>
          t.name.toLowerCase().includes(searchLower)
        )
      );
    });
  }

  taxonomies &&
    Object.entries(taxonomies).forEach(([name, value]) => {
      if (value !== optionAll.id) {
        filtered = filtered.filter((d) =>
          d.taxonomy.some(
            (t) => t.name === name && t.values.some((v) => v.id === value)
          )
        );
      }
    });

  sortField &&
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
    sortOptions
  });

  const { taxonomies, sortField, sortDir, onAction } = controlVars;
  const search = controlVars.search ?? '';

  const displayDiscoveries = useMemo(
    () =>
      prepareDiscoveries(allDiscoveries, {
        search,
        taxonomies,
        sortField,
        sortDir
      }),
    [search, taxonomies, sortField, sortDir]
  );

  const isFiltering = !!(
    (taxonomies && Object.keys(taxonomies).length) ||
    search
  );

  const browseControlsHeaderRef = useRef<HTMLDivElement>(null);
  const { headerHeight } = useSlidingStickyHeaderProps();

  return (
    <PageMainContent>
      <LayoutProps
        title={getString('stories').plural}
        description='Explore the guided narratives below to discover how NASA satellites and other Earth observing resources reveal a changing planet.'
      />
      <PageHero
        title={getString('stories').plural}
        description='Explore the guided narratives below to discover how NASA satellites and other Earth observing resources reveal a changing planet.'
      />

      <FeaturedDiscoveries />

      <Fold>
        <FoldHeader
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
            taxonomiesOptions={discoveryTaxonomies}
            sortOptions={sortOptions}
          />
        </FoldHeader>

        <DiscoveryCount>
          <span>
            Showing{' '}
            <Pluralize
              singular={getString('stories').singular}
              plural={getString('stories').plural}
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
              const topics = getTaxonomy(d, TAXONOMY_TOPICS)?.values;
              return (
                <li key={d.id}>
                  <Card
                    cardType='classic'
                    overline={
                      <CardMeta>
                        <CardSourcesList
                          sources={getTaxonomy(d, TAXONOMY_SOURCE)?.values}
                          rootPath={DISCOVERIES_PATH}
                          onSourceClick={(id) => {
                            onAction(Actions.TAXONOMY, {
                              key: TAXONOMY_SOURCE,
                              value: id
                            });
                            browseControlsHeaderRef.current?.scrollIntoView();
                          }}
                        />
                        <VerticalDivider variation='dark' />
                        {!isNaN(pubDate.getTime()) && (
                          <Link
                            to={`${DISCOVERIES_PATH}?${Actions.SORT_FIELD}=pubDate`}
                            onClick={(e) => {
                              e.preventDefault();
                              onAction(Actions.SORT_FIELD, 'pubDate');
                              browseControlsHeaderRef.current?.scrollIntoView();
                            }}
                          >
                            <PublishedDate date={pubDate} />
                          </Link>
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
                        {topics?.length ? (
                          <CardTopicsList>
                            <dt>Topics</dt>
                            {topics.map((t) => (
                              <dd key={t.id}>
                                <Pill
                                  as={Link}
                                  to={`${DISCOVERIES_PATH}?${
                                    Actions.TAXONOMY
                                  }=${encodeURIComponent(
                                    JSON.stringify({ Topics: t.id })
                                  )}`}
                                  onClick={() => {
                                    browseControlsHeaderRef.current?.scrollIntoView();
                                  }}
                                >
                                  <TextHighlight
                                    value={search}
                                    disabled={search.length < 3}
                                  >
                                    {t.name}
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
