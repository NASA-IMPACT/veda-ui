import React, { useRef, useMemo } from 'react';

import styled from 'styled-components';
import { glsp } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';
import { CollecticonXmarkSmall } from '@devseed-ui/collecticons';
import { VerticalDivider } from '@devseed-ui/toolbar';
import { Subtitle } from '@devseed-ui/typography';
import PublishedDate from '$components/common/pub-date';
import BrowseControls from '$components/common/browse-controls';
import {
  FilterActions,
  getDescription,
  getMediaProperty
} from '$components/common/catalog/utils';
import {
  Fold,
  FoldHeader,
  FoldHeadline,
  FoldTitle
} from '$components/common/fold';
import { useSlidingStickyHeaderProps } from '$components/common/layout-root/useSlidingStickyHeaderProps';
import { Card, LinkProperties } from '$components/common/card';
import {
  CardListGrid,
  CardMeta,
  CardTopicsList
} from '$components/common/card/styles';
import EmptyHub from '$components/common/empty-hub';
import { prepareDatasets } from '$components/common/catalog/prepare-datasets';

import TextHighlight from '$components/common/text-highlight';
import Pluralize from '$utils/pluralize';
import { Pill } from '$styles/pill';

import { CardSourcesList } from '$components/common/card-sources';
import {
  getTaxonomy,
  TAXONOMY_SOURCE,
  TAXONOMY_TOPICS
} from '$utils/veda-data/taxonomies';
import { generateTaxonomies } from '$utils/veda-data/taxonomies';
import { StoryData } from '$types/veda';
import { UseFiltersWithQueryResult } from '$components/common/catalog/controls/hooks/use-filters-with-query';

const StoryCount = styled(Subtitle)`
  grid-column: 1 / -1;
  display: flex;
  gap: ${glsp(0.5)};
  span {
    text-transform: uppercase;
    line-height: 1.5rem;
  }
`;

const BrowseFoldHeader = styled(FoldHeader)`
  flex-flow: column nowrap;
  align-items: flex-start;
`;

const FoldWithTopMargin = styled(Fold)`
  margin-top: ${glsp()};
`;

interface StoryDataWithPath extends StoryData {
  path: string;
}
interface HubContentProps {
  allStories: StoryDataWithPath[];
  linkProperties: LinkProperties;
  pathname: string;
  storiesString: { one: string; other: string };
  onFilterchanges: () => UseFiltersWithQueryResult;
}

export default function HubContent(props: HubContentProps) {
  const {
    allStories,
    linkProperties,
    pathname,
    storiesString,
    onFilterchanges
  } = props;
  const browseControlsHeaderRef = useRef<HTMLDivElement>(null);
  const { headerHeight } = useSlidingStickyHeaderProps();
  const { search, taxonomies, onAction } = onFilterchanges();

  const { LinkElement, pathAttributeKeyName } = linkProperties;
  const storyTaxonomies = generateTaxonomies(allStories);

  const ButtonLinkProps = {
    forwardedAs: LinkElement,
    [pathAttributeKeyName]: pathname
  };

  function getPillLinkProps(t) {
    return {
      as: LinkElement,
      [pathAttributeKeyName]: `${pathname}?${
        FilterActions.TAXONOMY
      }=${encodeURIComponent(JSON.stringify({ Topics: t.id }))}`
    };
  }
  const displayStories = useMemo(
    () =>
      prepareDatasets(allStories, {
        search,
        taxonomies,
        sortField: 'pubDate',
        sortDir: 'desc'
      }) as StoryDataWithPath[],
    [search, taxonomies, allStories]
  );

  const isFiltering = !!(
    (taxonomies && Object.keys(taxonomies).length) ||
    search
  );

  return (
    <FoldWithTopMargin>
      <BrowseFoldHeader
        ref={browseControlsHeaderRef}
        style={{
          scrollMarginTop: `${headerHeight + 16}px`
        }}
      >
        <FoldHeadline>
          <FoldTitle>Browse</FoldTitle>
        </FoldHeadline>
        <BrowseControls
          search={search}
          taxonomies={taxonomies}
          onAction={onAction}
          taxonomiesOptions={storyTaxonomies}
        />
      </BrowseFoldHeader>

      <StoryCount>
        <span>
          Showing{' '}
          <Pluralize
            singular={storiesString.one}
            plural={storiesString.other}
            count={displayStories.length}
            showCount={true}
          />{' '}
          out of {allStories.length}.
        </span>
        {isFiltering && (
          <Button {...ButtonLinkProps} size='small'>
            Clear filters <CollecticonXmarkSmall />
          </Button>
        )}
      </StoryCount>

      {displayStories.length ? (
        <CardListGrid>
          {displayStories.map((d) => {
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
                        rootPath={pathname}
                        onSourceClick={(id) => {
                          onAction(FilterActions.TAXONOMY_MULTISELECT, {
                            key: TAXONOMY_SOURCE,
                            value: id
                          });
                          browseControlsHeaderRef.current?.scrollIntoView();
                        }}
                      />
                      <VerticalDivider variation='dark' />

                      {!isNaN(pubDate.getTime()) && (
                        <PublishedDate date={pubDate} />
                      )}
                    </CardMeta>
                  }
                  linkLabel='View more'
                  linkProperties={{
                    linkTo: `${d.asLink?.url ?? d.path}`,
                    LinkElement,
                    pathAttributeKeyName
                  }}
                  title={
                    <TextHighlight value={search} disabled={search.length < 3}>
                      {d.name}
                    </TextHighlight>
                  }
                  description={
                    <TextHighlight value={search} disabled={search.length < 3}>
                      {getDescription(d)}
                    </TextHighlight>
                  }
                  hideExternalLinkBadge={d.hideExternalLinkBadge}
                  imgSrc={getMediaProperty(undefined, d, 'src')}
                  imgAlt={getMediaProperty(undefined, d, 'alt')}
                  footerContent={
                    <>
                      {topics?.length ? (
                        <CardTopicsList>
                          <dt>Topics</dt>
                          {topics.map((t) => (
                            <dd key={t.id}>
                              <Pill
                                {...getPillLinkProps(t)}
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
        </CardListGrid>
      ) : (
        <EmptyHub>
          There are no {storiesString.other.toLocaleLowerCase()} to show with
          the selected filters.
        </EmptyHub>
      )}
    </FoldWithTopMargin>
  );
}
