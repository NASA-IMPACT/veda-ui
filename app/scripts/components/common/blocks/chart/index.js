import React from 'react';
import T from 'prop-types';
import LazyLoad from 'react-lazyload';

import LineChart, { chartHeight } from './line';
import AreaLayer, { EmptyLayer } from './area-layer';
import { LoadingSkeleton } from '$components/common/loading-skeleton';

const Chart = (props) => {
  const { highlightStart, highlightEnd, highlightLabel } = props;
  const customLayer =
    highlightStart || highlightEnd
      ? AreaLayer({
          highlightStart,
          highlightEnd,
          highlightLabel
        })
      : EmptyLayer;
  return (
    <LineChart
      {...props}
      customLayerComponent={customLayer}
      isThereHighlight={!!(highlightStart || highlightEnd)}
    />
  );
};

Chart.propTypes = {
  dataPath: T.string,
  idKey: T.string,
  xKey: T.string,
  yKey: T.string,
  dateFormat: T.string,
  highlightStart: T.string,
  highlightEnd: T.string,
  highlightLabel: T.string
};

function LazyChart(props) {
  return (
    <LazyLoad
      placeholder={<LoadingSkeleton height={chartHeight} />}
      offset={-500}
      once
    >
      <Chart {...props} />
    </LazyLoad>
  );
}

export default LazyChart;
