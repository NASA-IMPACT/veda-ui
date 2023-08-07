import React, { lazy } from 'react';
import { getString } from 'veda';

import { resourceNotFound } from '$components/uhoh';
import { LayoutProps } from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import { PageMainContent } from '$styles/page';
import RelatedContent from '$components/common/related-content';
import { STORIES_PATH } from '$utils/routes';
import { useStory, allStoriesProps } from '$utils/veda-data';
import { ContentTaxonomy } from '$components/common/content-taxonomy';

const MdxContent = lazy(() => import('$components/common/mdx-content'));

function StoriesSingle() {
  const story = useStory();

  if (!story) throw resourceNotFound();

  const { media, related } = story.data;

  return (
    <>
      <LayoutProps
        title={story.data.name}
        description={story.data.description}
        thumbnail={media?.src}
        localNavProps={{
          parentName: getString('stories').one,
          parentLabel: getString('stories').other,
          parentTo: STORIES_PATH,
          items: allStoriesProps,
          currentId: story.data.id
        }}
      />

      <PageMainContent>
        <article>
          <PageHero
            title={story.data.name}
            description={story.data.description}
            publishedDate={story.data.pubDate}
            coverSrc={media?.src}
            coverAlt={media?.alt}
            attributionAuthor={media?.author?.name}
            attributionUrl={media?.author?.url}
          />
          
          <ContentTaxonomy taxonomy={story.data.taxonomy} />

          <MdxContent loader={story.content} />
          
          {!!related?.length && <RelatedContent related={related} />}
        </article>
      </PageMainContent>
    </>
  );
}

export default StoriesSingle;
