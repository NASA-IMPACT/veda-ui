import React, { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { Reorder, useDragControls } from 'framer-motion';
import styled, { useTheme } from 'styled-components';
import {
  addDays,
  subDays,
  endOfDay,
  endOfMonth,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfYear,
  areIntervalsOverlapping
} from 'date-fns';
import { ScaleTime } from 'd3';
import {
  CollecticonArrowSpinCw,
  CollecticonEye,
  CollecticonEyeDisabled,
  CollecticonGripVertical
} from '@devseed-ui/collecticons';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Toolbar, ToolbarIconButton } from '@devseed-ui/toolbar';
import { Heading } from '@devseed-ui/typography';

import {
  DATASET_TRACK_BLOCK_HEIGHT,
  HEADER_COLUMN_WIDTH,
  TimeDensity,
  TimelineDataset,
  TimelineDatasetStatus
} from './constants';
import { useTimelineDatasetAtom, useTimelineDatasetVisibility } from './hooks';
import {
  DatasetTrackError,
  DatasetTrackLoading
} from './dataset-list-item-status';

import { LayerGradientGraphic } from '$components/common/mapbox/layer-legend';

function getBlockBoundaries(date: Date, timeDensity: TimeDensity) {
  switch (timeDensity) {
    case TimeDensity.MONTH:
      return [startOfMonth(date), endOfMonth(date)];
    case TimeDensity.YEAR:
      return [startOfYear(date), endOfYear(date)];
  }

  return [startOfDay(date), endOfDay(date)];
}

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

const DatasetHeader = styled.header`
  width: ${HEADER_COLUMN_WIDTH}px;
  flex-shrink: 0;
  box-shadow: 1px 0 0 0 ${themeVal('color.base-200')};
  background: ${themeVal('color.surface')};
  padding: ${glsp(0.5)};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  ${CollecticonGripVertical} {
    cursor: grab;
    color: ${themeVal('color.base-300')};

    &:active {
      cursor: grabbing;
    }
  }
`;

const DatasetInfo = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column;
  gap: 0.5rem;
`;

const DatasetHeadline = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${glsp()};
`;

const DatasetData = styled.div`
  padding: ${glsp(0.25, 0)};
  display: flex;
  align-items: center;
  flex-grow: 1;
`;

interface DatasetListItemProps {
  datasetId: string;
  width: number;
  xScaled?: ScaleTime<number, number>;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export function DatasetListItem(props: DatasetListItemProps) {
  const { datasetId, width, xScaled, onDragStart, onDragEnd } = props;

  const datasetAtom = useTimelineDatasetAtom(datasetId);
  const dataset = useAtomValue(datasetAtom);

  const [isVisible, setVisible] = useTimelineDatasetVisibility(datasetAtom);

  const controls = useDragControls();

  const isError = dataset.status === TimelineDatasetStatus.ERRORED;

  return (
    <Reorder.Item
      value={dataset}
      dragListener={false}
      dragControls={controls}
      onDragStart={() => {
        onDragStart?.();
      }}
      onDragEnd={() => {
        onDragEnd?.();
      }}
    >
      <DatasetItem>
        <DatasetHeader>
          <CollecticonGripVertical onPointerDown={(e) => controls.start(e)} />
          <DatasetInfo>
            <DatasetHeadline>
              <Heading
                as='h3'
                size='xsmall'
                variation={isError ? 'danger' : undefined}
              >
                {dataset.data.title}
              </Heading>
              <Toolbar size='small'>
                {!isError ? (
                  <ToolbarIconButton onClick={() => setVisible((v) => !v)}>
                    {isVisible ? (
                      <CollecticonEye
                        meaningful
                        title='Toggle dataset visibility'
                      />
                    ) : (
                      <CollecticonEyeDisabled
                        meaningful
                        title='Toggle dataset visibility'
                      />
                    )}
                  </ToolbarIconButton>
                ) : (
                  <ToolbarIconButton variation='danger-text'>
                    <CollecticonArrowSpinCw
                      meaningful
                      title='Retry dataset loading'
                    />
                  </ToolbarIconButton>
                )}
              </Toolbar>
            </DatasetHeadline>
            <LayerGradientGraphic
              type='gradient'
              stops={['#eb7d2e', '#35a145', '#3287d2']}
              unit={{ label: 'bananas' }}
              min={-3}
              max={15}
            />
          </DatasetInfo>
        </DatasetHeader>
        <DatasetData>
          {dataset.status === TimelineDatasetStatus.LOADING && (
            <DatasetTrackLoading />
          )}
          {isError && <DatasetTrackError />}
          {dataset.status === TimelineDatasetStatus.SUCCEEDED && (
            <DatasetTrack
              width={width}
              xScaled={xScaled!}
              dataset={dataset}
              isVisible={!!isVisible}
            />
          )}
        </DatasetData>
      </DatasetItem>
    </Reorder.Item>
  );
}

interface DatasetTrackProps {
  width: number;
  xScaled: ScaleTime<number, number>;
  dataset: TimelineDataset;
  isVisible: boolean;
}

function DatasetTrack(props: DatasetTrackProps) {
  const { width, xScaled, dataset, isVisible } = props;

  // Limit the items to render to increase performance.
  const domainToRender = useMemo(() => {
    const domain = xScaled.domain();
    const start = subDays(domain[0], 1);
    const end = addDays(domain[1], 1);

    return dataset.data.domain.filter((d) => {
      const [blockStart, blockEnd] = getBlockBoundaries(
        d,
        dataset.data.timeDensity
      );

      return areIntervalsOverlapping(
        {
          start: blockStart,
          end: blockEnd
        },
        { start, end }
      );
    });
  }, [xScaled, dataset]);

  return (
    <svg width={width} height={DATASET_TRACK_BLOCK_HEIGHT}>
      {domainToRender.map((date) => (
        <DatasetTrackBlock
          key={date.getTime()}
          xScaled={xScaled}
          date={date}
          dataset={dataset}
          isVisible={isVisible}
        />
      ))}
    </svg>
  );
}

interface DatasetTrackBlockProps {
  xScaled: ScaleTime<number, number>;
  date: Date;
  dataset: TimelineDataset;
  isVisible: boolean;
}

function DatasetTrackBlock(props: DatasetTrackBlockProps) {
  const { xScaled, date, dataset, isVisible } = props;

  const [start, end] = getBlockBoundaries(date, dataset.data.timeDensity);
  const s = xScaled(start);
  const e = xScaled(end);

  const fill = useFillColors(isVisible);

  return (
    <React.Fragment key={date.getTime()}>
      <rect
        fill={fill}
        y={0}
        height={DATASET_TRACK_BLOCK_HEIGHT}
        x={s}
        width={e - s}
        rx={4}
      />
    </React.Fragment>
  );
}

const useFillColors = (isVisible: boolean): string | undefined => {
  const theme = useTheme();

  if (!isVisible) {
    return theme.color?.['base-200'];
  }

  return theme.color?.['base-400'];
};
