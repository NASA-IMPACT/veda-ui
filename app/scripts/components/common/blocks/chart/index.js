import React from 'react';
import T from 'prop-types';

import LineChart from './line';
import AreaLayer, { EmptyLayer } from './area-layer';
import ChartTitle from './title-desc';

const Chart = (props) => {
  const { highlightStart, highlightEnd, highlightLabel, altTitle, altDesc } =
    props;
  const areaLayer =
    highlightStart || highlightEnd
      ? AreaLayer({
          highlightStart,
          highlightEnd,
          highlightLabel
        })
      : EmptyLayer;

  const titleLayer =
    altTitle || altDesc
      ? ChartTitle({ title: altTitle, desc: altDesc })
      : EmptyLayer;
  return (
    <LineChart
      {...props}
      customLayerComponents={[areaLayer, titleLayer]}
      isThereHighlight={!!(highlightStart || highlightEnd)}
    />
  );
};

Chart.propTypes = {
  dataPath: T.string,
  idKey: T.string,
  xKey: T.string,
  yKey: T.string,
  xAxisLabel: T.string,
  yAxisLabel: T.string,
  altTitle: T.string,
  altDesc: T.string,
  dateFormat: T.string,
  highlightStart: T.string,
  highlightEnd: T.string,
  highlightLabel: T.string
};

export default Chart;
