import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { area } from 'd3-shape';
import { themeVal } from '@devseed-ui/theme-provider';
import { itemWidth } from './utils';

const highlightColorThemeValue = 'color.info-300a';

const HighlightLabel = styled.text`
  font-family: sans-serif;
  font-size: 12px;
  dominant-baseline: hanging;
`;

const HighlightLabelMarker = styled.rect`
  width: 12px;
  height: 12px;
  fill: ${themeVal(highlightColorThemeValue)};
`;

const HighlightArea = styled.path`
  d=${(props) => props.d};
  fill: ${themeVal(highlightColorThemeValue)};
`;

// empty layer to render when there is no highlight band
// This is to meet nivo's custom layer proptype
export const EmptyLayer = () => {
  return <g />;
};

/* eslint-disable react/display-name */

const AreaLayer = (customProps) => (nivoProps) => {
  const { highlightStart, highlightEnd, highlightLabel } = customProps;
  const { series, xScale, innerWidth, innerHeight } = nivoProps;

  if (series.length > 0) {
    const startTime = highlightStart
      ? new Date(highlightStart)
      : series[0].data[0].data.x;
    const endTime = highlightEnd
      ? new Date(highlightEnd)
      : series[0].data[series[0].data.length - 1].data.x;

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
      <g>
        <HighlightArea d={areaGenerator(filteredData)} />
        <g
          transform={`translate(${innerWidth / 2 - itemWidth / 2},${
            innerHeight + 30
          }) rotate(0)`}
        >
          <HighlightLabelMarker />
          <HighlightLabel transform='translate(15, 0)'>
            {highlightLabel}
          </HighlightLabel>
        </g>
      </g>
    );
  } else return <g />;
};
/* eslint-enable react/display-name */
AreaLayer.propTypes = {
  highlightStart: T.string,
  highlightEnd: T.string,
  highlightLabel: T.string
};

export default AreaLayer;
