import React from 'react';
import { useTheme } from 'styled-components';
import {
  Dropdown,
  DropMenu,
  DropMenuItem,
  DropTitle
} from '@devseed-ui/dropdown';
import { Button } from '@devseed-ui/button';
import { CollecticonChevronDownSmall } from '@devseed-ui/collecticons';

import { FoldHeadActions } from '$components/common/fold';
import {
  Legend,
  LegendTitle,
  LegendList,
  LegendSwatch,
  LegendLabel
} from '$styles/infographics';

export interface DataMetric {
  id: string;
  label: string;
  chartLabel: string;
  themeColor: 'infographicA' | 'infographicB' | 'infographicC' | 'infographicD';
}

export const dataMetrics: DataMetric[] = [
  {
    id: 'min',
    label: 'Min',
    chartLabel: 'Min',
    themeColor: 'infographicA'
  },
  {
    id: 'mean',
    label: 'Average',
    chartLabel: 'Avg',
    themeColor: 'infographicB'
  },
  {
    id: 'max',
    label: 'Max',
    chartLabel: 'Max',
    themeColor: 'infographicC'
  },
  {
    id: 'std',
    label: 'St Deviation',
    chartLabel: 'STD',
    themeColor: 'infographicD'
  }
];

export default function AnalysisHeadActions() {
  const theme = useTheme();

  return (
    <FoldHeadActions>
      <Legend>
        <LegendTitle>Legend</LegendTitle>
        <LegendList>
          {dataMetrics.map((metric) => (
            <React.Fragment key={metric.id}>
              <LegendSwatch>
                <svg height='8' width='8'>
                  <title>{theme.color[metric.themeColor]}</title>
                  <circle
                    cx='4'
                    cy='4'
                    r='4'
                    fill={theme.color[metric.themeColor]}
                  />
                </svg>
              </LegendSwatch>
              <LegendLabel>{metric.label}</LegendLabel>
            </React.Fragment>
          ))}
        </LegendList>
      </Legend>

      <Dropdown
        alignment='right'
        triggerElement={(props) => (
          <Button variation='base-text' {...props}>
            View <CollecticonChevronDownSmall />
          </Button>
        )}
      >
        <DropTitle>View options</DropTitle>
        <DropMenu>
          <li>
            <DropMenuItem href='#'>Option A</DropMenuItem>
          </li>
          <li>
            <DropMenuItem href='#'>Option B</DropMenuItem>
          </li>
          <li>
            <DropMenuItem href='#'>Option C</DropMenuItem>
          </li>
        </DropMenu>
      </Dropdown>
    </FoldHeadActions>
  );
}
