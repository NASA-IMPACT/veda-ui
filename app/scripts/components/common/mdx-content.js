import React from 'react';
import T from 'prop-types';
import { MDXProvider } from '@mdx-js/react';

import { useMdxPageLoader } from '$utils/veda-data';
import { S_LOADING, S_SUCCEEDED } from '$utils/status';
import { ContentLoading } from '$components/common/loading-skeleton';
import Block from '$components/common/blocks';
import ContentBlockFigure from '$components/common/blocks/figure';
import { ContentBlockProse } from '$styles/content-block';
import Image, { Caption } from '$components/common/blocks/images';
import { Chapter } from '$components/common/blocks/scrollytelling/chapter';
import {
  LazyChart,
  LazyCompareImage,
  LazyScrollyTelling,
  LazyMap
} from '$components/common/blocks/lazy-components';
import { NotebookConnectCalloutBlock } from '$components/common/notebook-connect';
import SmartLink from '$components/common/smart-link';

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
          NotebookConnectCallout: NotebookConnectCalloutBlock,
          Link: SmartLink
        }}
      >
        <pageMdx.MdxContent {...(props.throughProps || {})} />
      </MDXProvider>
    );
  }

  return null;
}

MdxContent.propTypes = {
  loader: T.func,
  throughProps: T.object
};

export default MdxContent;
