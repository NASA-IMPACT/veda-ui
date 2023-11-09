import React from 'react';
import T from 'prop-types';
import LazyLoad from 'react-lazyload';

import Chart from '$components/common/chart/block';
import { chartMaxHeight } from '$components/common/chart/constant';

import Table, { tableHeight } from '$components/common/table';
import CompareImage from '$components/common/blocks/images/compare';

import Map, { mapHeight } from '$components/common/blocks/block-map';
import Embed from '$components/common/blocks/embed';
import {
  ScrollytellingBlock,
  scrollyMapHeight
} from '$components/common/blocks/scrollytelling';

import { LoadingSkeleton } from '$components/common/loading-skeleton';

export function LazyChart(props) {
  return (
    <LazyLoad
      placeholder={<LoadingSkeleton height={`${chartMaxHeight}px`} />}
      offset={50}
      once
    >
      <Chart {...props} />
    </LazyLoad>
  );
}

export function LazyScrollyTelling(props) {
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

export function LazyMap(props) {
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

export function LazyCompareImage(props) {
  return (
    // We don't know the height of image, passing an arbitrary number (200) for placeholder height
    <LazyLoad placeholder={<LoadingSkeleton height={200} />} offset={50} once>
      <CompareImage {...props} />
    </LazyLoad>
  );
}

export function LazyTable(props) {
  return (
    <LazyLoad
      placeholder={<LoadingSkeleton height={tableHeight} />}
      offset={50}
      once
    >
      <Table {...props} />
    </LazyLoad>
  );
}

export function LazyEmbed(props) {
  return (
    <LazyLoad
      // eslint-disable-next-line react/prop-types
      placeholder={<LoadingSkeleton height={props.height} />}
      offset={50}
      once
    >
      <Embed {...props} />
    </LazyLoad>
  );
}

LazyEmbed.propTypes = {
  src: T.string,
  height: T.number
};
