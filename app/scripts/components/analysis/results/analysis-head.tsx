import React, { Fragment } from 'react';
import styled, { useTheme } from 'styled-components';
import { media } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';

import { DATA_METRICS } from './analysis-metrics-dropdown';

import { FoldHeadActions } from '$components/common/fold';
import {
  Legend,
  LegendTitle,
  LegendList,
  LegendSwatch,
  LegendLabel
} from '$styles/infographics';

const AnalysisFoldHeadActions = styled(FoldHeadActions)`
  width: 100%;

  ${media.mediumUp`
    width: auto;
  `}

  ${Button} {
    margin-left: auto;
  }
`;

const AnalysisLegend = styled(Legend)`
  flex-flow: column nowrap;
  align-items: flex-start;

  ${media.smallUp`
    flex-flow: row nowrap;
    align-items: center;
  `};
`;

const AnalysisLegendList = styled(LegendList)`
  display: grid;
  grid-template-columns: repeat(6, auto);

  ${media.smallUp`
    display: flex;
    flex-flow: row nowrap;
  `};
`;

export default function AnalysisHead() {
  const theme = useTheme();

  return (
    <AnalysisFoldHeadActions>
      <AnalysisLegend>
        <LegendTitle>Legend</LegendTitle>
        <AnalysisLegendList>
          {DATA_METRICS.map((metric) => {
            return (
              <Fragment key={metric.id}>
                <LegendSwatch>
                  <svg height='8' width='8'>
                    <title>{theme.color?.[metric.themeColor]}</title>
                    <circle
                      cx='4'
                      cy='4'
                      r='4'
                      fill={theme.color?.[metric.themeColor]}
                    />
                  </svg>
                </LegendSwatch>
                <LegendLabel>{metric.label}</LegendLabel>
              </Fragment>
            );
          })}
        </AnalysisLegendList>
      </AnalysisLegend>
    </AnalysisFoldHeadActions>
  );
}
