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
        /*
          The inclusion of useLocalNav was a late addition, 
          primarily driven by EIC's specific requirements. 
          useLocalNav attribute is not present in stories from other instances, 
          which is why it is explicitly set to false in this context.
        */
        localNavProps={(story.data.useLocalNav !== false)? {
          parentName: getString('stories').one,
          parentLabel: getString('stories').other,
          parentTo: STORIES_PATH,
          items: allStoriesProps.filter(s => (s.useLocalNav !== false)),
          currentId: story.data.id
        }: null}
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
            renderDetailsBlock={() => (
              <ContentTaxonomy taxonomy={story.data.taxonomy} linkBase={STORIES_PATH} />
            )}
          />

          <MdxContent loader={story.content} />

          {!!related?.length && <RelatedContent related={related} />}
        </article>
      </PageMainContent>
    </>
  );
}

export default StoriesSingle;
