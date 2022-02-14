import React from 'react';
import T from 'prop-types';
import LineChart from './line';
import AreaLayer, { EmptyLayer } from './area-layer';

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
  return <LineChart {...props} customLayerComponent={customLayer} />;
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

export default Chart;
