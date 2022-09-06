import React from 'react';
import LazyLoad from 'react-lazyload';

import Chart from '$components/common/chart/block';
import { chartHeight } from '$components/common/blocks/chart/line';

import CompareImage from '$components/common/blocks/images/compare';

import Map, { mapHeight } from '$components/common/blocks/block-map';

import {
  ScrollytellingBlock,
  scrollyMapHeight
} from '$components/common/blocks/scrollytelling';

import { LoadingSkeleton } from '$components/common/loading-skeleton';

export const LazyChart = function (props) {
  return (
    <LazyLoad
      placeholder={<LoadingSkeleton height={chartHeight} />}
      offset={50}
      once
    >
      <Chart {...props} />
    </LazyLoad>
  );
};

export const LazyScrollyTelling = function (props) {
  return (
    <LazyLoad
      placeholder={<LoadingSkeleton height={scrollyMapHeight} />}
      offset={100}
      once
    >
      <ScrollytellingBlock {...props} />
    </LazyLoad>
  );
};

export const LazyMap = function (props) {
  return (
    <LazyLoad
      placeholder={<LoadingSkeleton height={mapHeight} />}
      offset={100}
      once
    >
      <Map {...props} />
    </LazyLoad>
  );
};

export const LazyCompareImage = function (props) {
  return (
    // We don't know the height of image, passing an arbitrary number (200) for placeholder height
    <LazyLoad placeholder={<LoadingSkeleton height={200} />} offset={50} once>
      <CompareImage {...props} />
    </LazyLoad>
  );
};
