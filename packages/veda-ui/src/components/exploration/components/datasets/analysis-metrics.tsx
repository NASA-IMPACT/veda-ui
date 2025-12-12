import React from 'react';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { FormSwitch } from '@devseed-ui/form';
import { DropMenu, DropTitle } from '@devseed-ui/dropdown';

export interface DataMetric {
  id: string;
  label: string;
  chartLabel: string;
  themeColor:
    | 'infographicA'
    | 'infographicB'
    | 'infographicC'
    | 'infographicD'
    | 'infographicE'
    | 'infographicF';
  style?: Record<string, string>;
}

export const DATA_METRICS: DataMetric[] = [
  {
    id: 'min',
    label: 'Min',
    chartLabel: 'Min',
    themeColor: 'infographicA',
    style: { strokeDasharray: '2 2' }
  },
  {
    id: 'mean',
    label: 'Average',
    chartLabel: 'Average',
    themeColor: 'infographicB'
  },
  {
    id: 'max',
    label: 'Max',
    chartLabel: 'Max',
    themeColor: 'infographicC',
    style: { strokeDasharray: '2 2' }
  },
  {
    id: 'std',
    label: 'St Deviation',
    chartLabel: 'St Deviation',
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

export const DEFAULT_DATA_METRICS: DataMetric[] = DATA_METRICS.filter(
  (metric) => metric.id === 'mean' || metric.id === 'std'
);

const MetricList = styled(DropMenu)`
  display: flex;
  flex-flow: column;
  list-style: none;
  margin: ${glsp(0, -1, 1, -1)};
  padding: ${glsp(0, 0, 1, 0)};
  gap: ${glsp(0.5)};

  > li {
    padding: ${glsp(0, 1)};
    font-weight: ${themeVal('type.base.regular')};
    color: ${themeVal('color.base-400')};
  }
`;

const MetricSwitch = styled(FormSwitch)<{ metricThemeColor: string }>`
  display: grid;
  grid-template-columns: min-content 1fr auto;
  gap: ${glsp(0.5)};

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

interface AnalysisMetricsProps {
  activeMetrics: DataMetric[];
  onMetricsChange: (metrics: DataMetric[]) => void;
}

export default function AnalysisMetrics(props: AnalysisMetricsProps) {
  const { activeMetrics, onMetricsChange } = props;

  const handleMetricChange = (metric: DataMetric, shouldAdd: boolean) => {
    onMetricsChange(
      shouldAdd
        ? activeMetrics.concat(metric)
        : activeMetrics.filter((m) => m.id !== metric.id)
    );
  };

  return (
    <>
      <DropTitle>Analysis metrics</DropTitle>
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
    </>
  );
}
