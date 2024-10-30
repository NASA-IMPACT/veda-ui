import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { Reorder } from 'framer-motion';
import { ScaleTime } from 'd3';
import styled from 'styled-components';
import { listReset } from '@devseed-ui/theme-provider';

import { DatasetListItem } from './dataset-list-item';
import { timelineDatasetsAtom } from '$components/exploration/atoms/datasets';
import { LinkProperties } from '$types/veda';

const DatasetListSelf = styled.ul`
  ${listReset()}
  width: 100%;
`;

interface DatasetListProps {
  width: number;
  xScaled?: ScaleTime<number, number>;
  linkProperties: LinkProperties;
}

export function DatasetList(props: DatasetListProps) {
  const { width, xScaled, linkProperties } = props;
  const [isDragging, setIsDragging] = useState(false);

  const [datasets, setDatasets] = useAtom(timelineDatasetsAtom);

  return (
    <Reorder.Group
      as={DatasetListSelf as any}
      axis='y'
      values={datasets}
      onReorder={setDatasets}
      style={isDragging ? { userSelect: 'none' } : undefined}
    >
      {datasets.map((dataset) => (
        <DatasetListItem
          key={dataset.data.id}
          linkProperties={linkProperties}
          datasetId={dataset.data.id}
          width={width}
          xScaled={xScaled}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
        />
      ))}
    </Reorder.Group>
  );
}
