import React from 'react';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Dropdown, DropTitle } from '@devseed-ui/dropdown';
import { Button } from '@devseed-ui/button';
import { CollecticonChartLine } from '@devseed-ui/collecticons';
import { FormSwitch } from '@devseed-ui/form';

export interface DataMetric {
  id: string;
  label: string;
  chartLabel: string;
  themeColor:
    | 'infographicA'
    | 'infographicB'
    | 'infographicC'
    | 'infographicD'
    | 'infographicE';
}

export const DATA_METRICS: DataMetric[] = [
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
  },
  {
    id: 'median',
    label: 'Median',
    chartLabel: 'Median',
    themeColor: 'infographicE'
  },
  {
    id: 'sum',
    label: 'Sum',
    chartLabel: 'Sum',
    themeColor: 'infographicF'
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

interface AnalysisMetricsDropdownProps {
  activeMetrics: DataMetric[];
  onMetricsChange: (metrics: DataMetric[]) => void;
  isDisabled: boolean;
}

export default function AnalysisMetricsDropdown(
  props: AnalysisMetricsDropdownProps
) {
  const { activeMetrics, onMetricsChange, isDisabled } = props;

  const handleMetricChange = (metric: DataMetric, shouldAdd: boolean) => {
    onMetricsChange(
      shouldAdd
        ? activeMetrics.concat(metric)
        : activeMetrics.filter((m) => m.id !== metric.id)
    );
  };

  return (
    <Dropdown
      alignment='right'
      triggerElement={(props) => (
        <Button
          variation='base-text'
          size='small'
          fitting='skinny'
          disabled={isDisabled}
          {...props}
        >
          <CollecticonChartLine meaningful title='Select chart metrics' />
        </Button>
      )}
    >
      <DropTitle>View options</DropTitle>
      <MetricList>
        {DATA_METRICS.map((metric) => {
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
  );
}
