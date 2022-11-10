import React from 'react';
import styled, { useTheme } from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Dropdown, DropTitle } from '@devseed-ui/dropdown';
import { Button } from '@devseed-ui/button';
import { CollecticonChevronDownSmall } from '@devseed-ui/collecticons';
import { FormSwitch } from '@devseed-ui/form';

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

const MetricList = styled.ul`
  display: flex;
  flex-flow: column;
  list-style: none;
  margin: 0 -${glsp()};
  padding: 0;
  gap: ${glsp(0.5)};

  > li {
    padding: ${glsp(0, 1)};
  }
`;

const MetricSwitch = styled(FormSwitch)<{ metricThemeColor: string }>`
  display: grid;
  grid-template-columns: min-content 1fr auto;

  &::before {
    content: '';
    width: 0.5rem;
    height: 0.5rem;
    background: ${({ metricThemeColor }) =>
      themeVal(`color.${metricThemeColor}` as any)};
    border-radius: ${themeVal('shape.ellipsoid')};
    align-self: center;
  }
`;

interface AnalysisHeadActionsProps {
  activeMetrics: DataMetric[];
  onMetricsChange: (metrics: DataMetric[]) => void;
}

export default function AnalysisHeadActions(props: AnalysisHeadActionsProps) {
  const { activeMetrics, onMetricsChange } = props;
  const theme = useTheme();

  const handleMetricChange = (metric: DataMetric, shouldAdd: boolean) => {
    onMetricsChange(
      shouldAdd
        ? activeMetrics.concat(metric)
        : activeMetrics.filter((m) => m.id !== metric.id)
    );
  };

  return (
    <FoldHeadActions>
      <Legend>
        <LegendTitle>Legend</LegendTitle>
        <LegendList>
          {dataMetrics.map((metric) => {
            const active = !!activeMetrics.find((m) => m.id === metric.id);
            return (
              <React.Fragment key={metric.id}>
                <LegendSwatch disabled={!active}>
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
                <LegendLabel disabled={!active}>{metric.label}</LegendLabel>
              </React.Fragment>
            );
          })}
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
        <MetricList>
          {dataMetrics.map((metric) => {
            const checked = !!activeMetrics.find((m) => m.id === metric.id);
            return (
              <li key={metric.id}>
                <MetricSwitch
                  metricThemeColor={metric.themeColor}
                  name={`switch-metric-${metric.id}`}
                  id={`switch-metric-${metric.id}`}
                  value={`switch-metric-${metric.id}`}
                  title='Toggle metric on/off'
                  checked={checked}
                  onChange={() => handleMetricChange(metric, !checked)}
                >
                  {metric.label}
                </MetricSwitch>
              </li>
            );
          })}
        </MetricList>
      </Dropdown>
    </FoldHeadActions>
  );
}
