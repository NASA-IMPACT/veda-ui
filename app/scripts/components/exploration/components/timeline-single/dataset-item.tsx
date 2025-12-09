import React, { useMemo } from 'react';
import styled from 'styled-components';
import { ScaleTime } from 'd3';
import { themeVal } from '@devseed-ui/theme-provider';
import { DatasetChart } from '../datasets/dataset-chart';
import { TimelineDatasetSuccess } from '$components/exploration/types.d';

const DatasetItem = styled.article`
  width: 100%;
  display: flex;
  position: relative;
  ::before,
  ::after {
    position: absolute;
    content: '';
    display: block;
    width: 100%;
    background: ${themeVal('color.base-200')};
    height: 1px;
  }

  ::before {
    top: 0;
  }

  ::after {
    bottom: -1px;
  }
`;

const DatasetData = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-grow: 1;
`;

interface DatasetListItemProps {
  dataset: TimelineDatasetSuccess;
  width: number;
  xScaled?: ScaleTime<number, number>;
}

/**
 * DatasetTimelineItem component
 *
 * @param {TimelineDatasetSuccess} dataset - dataset item of TimelineDatasetSuccess type
 * @param {number} width - width of the chart
 * @param {Function} xScaled - function to scale x
 * @returns {JSX.Element} - DatasetTimelineItem component
 */

export function DatasetTimelineItem(props: DatasetListItemProps) {
  const { dataset, width, xScaled } = props;

  const analysisMetrics = useMemo(
    () => dataset.settings.analysisMetrics ?? [],
    [dataset]
  );

  return (
    <>
      <DatasetItem>
        <DatasetData>
          <DatasetChart
            xScaled={xScaled!}
            width={width}
            isVisible={true}
            dataset={dataset}
            activeMetrics={analysisMetrics}
          />
        </DatasetData>
      </DatasetItem>
    </>
  );
}
