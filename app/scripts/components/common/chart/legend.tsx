import React from 'react';
import styled from 'styled-components';
import { LegendProps } from 'recharts/types';
import { CategoricalChartProps } from 'recharts/types/chart/generateCategoricalChart';

import { glsp, themeVal } from '@devseed-ui/theme-provider';

import { ListItem } from './tooltip';
import { highlightColorThemeValue } from './constant';

interface ReferenceLegendComponentProps extends CategoricalChartProps {
  highlightLabel: string;
}

const LegendWrapper = styled.ul`
  max-width: ${(props) => props.width};
  margin: 0 auto;
  margin-top: ${glsp(0.6)};
  text-align: center;
`;

const LegendItem = styled.li`
  display: inline-flex;
  list-style: none;
  margin-right: ${glsp(0.25)};
  font-size: 0.75rem;
  color: ${themeVal('color.base-400')};
  * {
    align-self: center;
  }
`;

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

export const ReferenceLegendComponent = (props:ReferenceLegendComponentProps) => {
  const { width, highlightLabel } = props;
  return (
    <g transform={`translate(${width - 100}, 0) rotate(0)`}>
      <HighlightLabelMarker />
      <HighlightLabel transform='translate(15, 0)'>
        {highlightLabel}
      </HighlightLabel>
    </g>
  );
};

export const LegendComponent = (props:LegendProps) => {
  const { payload, width } = props;
  if (payload) {
    return (
      <LegendWrapper width={width}>
        {payload.map((entry) => (
          <LegendItem key={`item-${entry.value}`}>
            <ListItem color={entry.color} />
            {entry.value}
          </LegendItem>
        ))}
      </LegendWrapper>
    );
  } 
  return null;
};
