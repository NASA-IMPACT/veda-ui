import React from 'react';
import T from 'prop-types';
import { Defs } from '@nivo/core';
import { area } from 'd3-shape';

/* eslint-disable react/display-name */
const AreaLayer = (customProps) => (nivoProps) => {
  const { highlightStart, highlightEnd } = customProps;
  const { series, xScale, innerHeight } = nivoProps;

  if (series.length > 0) {
    const startTime = new Date(highlightStart);
    const endTime = new Date(highlightEnd);

    const filteredData = series[0].data.filter(
      (e) =>
        e.data.x.getTime() > startTime.getTime() &&
        e.data.x.getTime() < endTime.getTime()
    );

    // areaGenerator is used to make 'highlight band'
    const areaGenerator = area()
      .x0((d) => xScale(d.data.x))
      .y0(() => innerHeight)
      .y1(() => 0);

    return (
      <React.Fragment>
        <Defs
          defs={[
            {
              id: 'pattern',
              type: 'patternLines',
              background: 'transparent',
              color: '#3daff7',
              lineWidth: 1,
              spacing: 6,
              rotation: -45
            }
          ]}
        />
        <path
          d={areaGenerator(filteredData)}
          fill='url(#pattern)'
          fillOpacity={0.6}
          stroke='#3daff7'
          strokeWidth={1}
        />
      </React.Fragment>
    );
  } else return <></>;
};
/* eslint-enable react/display-name */
AreaLayer.propTypes = {
  highlightStart: T.string,
  highlightEnd: T.string
};

export default AreaLayer;
