import React, { lazy } from 'react';

import { resourceNotFound } from '$components/uhoh';
import { LayoutProps } from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import { PageMainContent } from '$styles/page';
import RelatedContent from '$components/common/related-content';
import { STORIES_PATH } from '$utils/routes';
// import { useStory } from '$utils/veda-data-to-deprecate';
import { useStory } from '$utils/veda-data';
import { ContentTaxonomy } from '$components/common/content-taxonomy';
import { veda_faux_module_stories } from '$data-layer/datasets';

const MdxContent = lazy(() => import('$components/common/mdx-content'));

function StoriesSingle() {
  // const story = useStory();
  const story = useStory(veda_faux_module_stories);

  if (!story || story.data.asLink) throw resourceNotFound();

  const { media, related } = story.data;

  return (
    <>
      <LayoutProps
        title={story.data.name}
        description={story.data.description}
        thumbnail={media?.src}
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
              <ContentTaxonomy
                taxonomy={story.data.taxonomy}
                linkBase={STORIES_PATH}
              />
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
