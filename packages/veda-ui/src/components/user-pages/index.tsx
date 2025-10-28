import React from 'react';
import { useParams } from 'react-router';
import { getOverride } from 'veda';

import { LayoutProps } from '$components/common/layout-root';
import { PageMainContent } from '$styles/page';
import PageHero from '$components/common/page-hero';
import { FoldProse } from '$components/common/fold';
import { ContentOverride } from '$components/common/page-overrides';
import { resourceNotFound } from '$components/uhoh';

function UserPages(props: { id: any }) {
  const page = getOverride(props.id);
  const params = useParams();

  if (!page) throw resourceNotFound();

  const { hideHero, hideNav, hideFooter } = page.data;

  return (
    <PageMainContent>
      <LayoutProps
        title={page.data.title}
        description={page.data.description}
        hideFooter={hideFooter}
        hideNav={hideNav}
      />
      {!hideHero && (
        <PageHero
          title={page.data.title || 'Page title is missing'}
          description={page.data.description}
        />
      )}
      <ContentOverride with={props.id} {...params}>
        <FoldProse>
          <p>Content for this page comes from the relevant mdx file.</p>
        </FoldProse>
      </ContentOverride>
    </PageMainContent>
  );
}

export default UserPages;
