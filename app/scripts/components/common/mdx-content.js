import React from 'react';
import T from 'prop-types';
import { MDXProvider } from '@mdx-js/react';
import LazyLoad from 'react-lazyload';

import { useMdxPageLoader } from '$utils/thematics';
import { ContentLoading } from '$components/common/loading-skeleton';
import Block from '$components/common/blocks';
import ContentBlockFigure from '$components/common/blocks/figure';
import { ContentBlockProse } from '$styles/content-block';
import Chart from '$components/common/blocks/chart';
import { ChartPlaceholder } from '$components/common/blocks/chart/line';
import Image, { Caption } from '$components/common/blocks/images';
import Map from '$components/common/blocks/block-map';
import { ScrollytellingBlock } from '$components/common/blocks/scrollytelling';
import { Chapter } from '$components/common/blocks/scrollytelling/chapter';

function LazyImage(props) {
  return (
    <LazyLoad placeholder={<ChartPlaceholder />} offset={-300} once>
      <Image {...props} />
    </LazyLoad>
  );
}

function LazyChart(props) {
  return (
    <LazyLoad placeholder={<ChartPlaceholder />} offset={-300} once>
      <Chart {...props} />
    </LazyLoad>
  );
}
function MdxContent(props) {
  const pageMdx = useMdxPageLoader(props.loader);

  if (pageMdx.status === 'loading') {
    return <ContentLoading />;
  }

  if (pageMdx.status === 'success') {
    return (
      <MDXProvider
        components={{
          Block,
          Prose: ContentBlockProse,
          Figure: ContentBlockFigure,
          Caption,
          Map,
          ScrollytellingBlock,
          Chapter,
          Image: LazyImage,
          Chart: LazyChart
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
