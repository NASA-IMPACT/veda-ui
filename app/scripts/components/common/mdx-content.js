import React from 'react';
import T from 'prop-types';
import { MDXProvider } from '@mdx-js/react';
import LazyLoad from 'react-lazyload';

import { useMdxPageLoader } from '$utils/thematics';
import { ContentLoading } from '$components/common/loading-skeleton';
import Block from '$components/common/blocks';
import ContentBlockFigure from '$components/common/blocks/figure';
import { ContentBlockProse } from '$styles/content-block';
import Chart, { chartHeight } from '$components/common/blocks/chart';

import Image, { Caption } from '$components/common/blocks/images';
import Map, { mapHeight } from '$components/common/blocks/block-map';
import {
  ScrollytellingBlock,
  scrollyMapHeight
} from '$components/common/blocks/scrollytelling';
import { Chapter } from '$components/common/blocks/scrollytelling/chapter';
import { LoadingSkeleton } from '$components/common/loading-skeleton';

function LazyChart(props) {
  return (
    <LazyLoad
      placeholder={<LoadingSkeleton height={chartHeight} />}
      offset={50}
      once
    >
      <Chart {...props} />
    </LazyLoad>
  );
}

function LazyScrollyMap(props) {
  return (
    <LazyLoad
      placeholder={<LoadingSkeleton height={scrollyMapHeight} />}
      offset={100}
      once
    >
      <ScrollytellingBlock {...props} />
    </LazyLoad>
  );
}

function LazyMap(props) {
  return (
    <LazyLoad
      placeholder={<LoadingSkeleton height={mapHeight} />}
      offset={100}
      once
    >
      <Map {...props} />
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
          Map: LazyMap,
          ScrollytellingBlock: LazyScrollyMap,
          Chapter,
          Image,
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
