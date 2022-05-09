import React from 'react';
import T from 'prop-types';
import { MDXProvider } from '@mdx-js/react';

import { useMdxPageLoader } from '$utils/thematics';
import { S_LOADING, S_SUCCEEDED } from '$utils/status';
import { ContentLoading } from '$components/common/loading-skeleton';
import Block from '$components/common/blocks';
import ContentBlockFigure from '$components/common/blocks/figure';
import { ContentBlockProse } from '$styles/content-block';
import Image, { Caption } from '$components/common/blocks/images';
import { Chapter } from '$components/common/blocks/scrollytelling/chapter';
import RelatedContent from '$components/common/blocks/related-content';

import {
  LazyChart,
  LazyCompareImage,
  LazyScrollyTelling,
  LazyMap
} from '$components/common/blocks/lazy-components';

function MdxContent(props) {
  const pageMdx = useMdxPageLoader(props.loader);

  if (pageMdx.status === S_LOADING) {
    return <ContentLoading />;
  }

  if (pageMdx.status === S_SUCCEEDED) {
    return (
      <MDXProvider
        components={{
          Block,
          Prose: ContentBlockProse,
          Figure: ContentBlockFigure,
          Caption,
          Chapter,
          Image,
          Map: LazyMap,
          ScrollytellingBlock: LazyScrollyTelling,
          Chart: LazyChart,
          CompareImage: LazyCompareImage,
          RelatedContent
        }}
      >
        <pageMdx.MdxContent />
      </MDXProvider>
    );
  }

  return null;
}

MdxContent.propTypes = {
  loader: T.func
};

export default MdxContent;
