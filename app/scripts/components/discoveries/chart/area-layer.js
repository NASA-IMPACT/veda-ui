import React from 'react';
import T from 'prop-types';
import { area } from 'd3-shape';

/* eslint-disable react/display-name */
const AreaLayer = (customProps) => (nivoProps) => {
  const { highlightStart, highlightEnd, highlightLabel } = customProps;
  const { series, xScale, innerHeight } = nivoProps;

  if (series.length > 0) {
    const startTime = new Date(highlightStart);
    const endTime = new Date(highlightEnd);

    const filteredData = series[0].data.filter(
      (e) =>
        e.data.x.getTime() > startTime.getTime() &&
        e.data.x.getTime() < endTime.getTime()
    );
    const centralXPoint = xScale(
      filteredData[Math.floor(filteredData.length / 2)].data.x
    );

    // areaGenerator is used to make 'highlight band'
    const areaGenerator = area()
      .x0((d) => xScale(d.data.x))
      .y0(() => innerHeight)
      .y1(() => 0);

    return (
      <g>
        <path
          d={areaGenerator(filteredData)}
          fill='#3daff7'
          fillOpacity={0.3}
          stroke='#3daff7'
          strokeWidth={1}
        />
        <text
          dominantBaseline='central'
          textAnchor='middle'
          transform={`translate(${centralXPoint},-10) rotate(0)`}
          style={{
            fontFamily: 'sans-serif',
            fontSize: '12px',
            fill: '#3daff7'
          }}
        >
          {highlightLabel}
        </text>
      </g>
    );
  } else return <></>;
};
/* eslint-enable react/display-name */
AreaLayer.propTypes = {
  highlightStart: T.string,
  highlightEnd: T.string,
  highlightLabel: T.string
};

export default AreaLayer;
