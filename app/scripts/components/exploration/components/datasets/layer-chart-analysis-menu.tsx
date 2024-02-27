import React from 'react';
import styled from 'styled-components';
import { Dropdown } from '@devseed-ui/dropdown';
import AnalysisMetrics, { DataMetric } from './analysis-metrics';
import { TipButton } from '$components/common/tip-button';


interface ChartAnalysisProps {
  triggerIcon: JSX.Element;
  onChange: (changeType: string, item) => void;
  activeMetrics: DataMetric[];
}

const IconButton = styled(TipButton)`
  z-index: 1;
`;

export default function LayerChartAnalysisMenu ({activeMetrics, triggerIcon, onChange}: ChartAnalysisProps) {
  return (
    <Dropdown
      alignment='right'
      direction='up'
      triggerElement={(props) => (
        <IconButton
          tipContent='Analysis metrics'
          variation='base-text'
          size='small'
          fitting='skinny'
          {...props}
        >
          {triggerIcon}
        </IconButton>
      )}
    >
      <AnalysisMetrics
        activeMetrics={activeMetrics}
        onMetricsChange={(m) => onChange('analysisMetrics', m)}
      />
    </Dropdown>
  );
}