import React, { useCallback, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { Reorder, useDragControls } from 'framer-motion';
import styled, { useTheme } from 'styled-components';
import { addDays, subDays, areIntervalsOverlapping } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';
import { ScaleTime } from 'd3';
import {
  CollecticonEye,
  CollecticonEyeDisabled,
  CollecticonGripVertical
} from '@devseed-ui/collecticons';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Toolbar, ToolbarIconButton } from '@devseed-ui/toolbar';
import { Heading } from '@devseed-ui/typography';

import {
  DatasetPopover,
  getInteractionDataPoint,
  usePopover
} from '../chart-popover';
import {
  DatasetTrackError,
  DatasetTrackLoading
} from './dataset-list-item-status';
import { DatasetChart } from './dataset-chart';
import DatasetOptions from './dataset-options';
import { getBlockBoundaries, lumpBlocks } from './block-utils';

import {
  LayerCategoricalGraphic,
  LayerGradientGraphic
} from '$components/common/mapbox/layer-legend';
import {
  TimelineDatasetStatus,
  TimelineDatasetSuccess
} from '$components/exploration/types.d.ts';
import {
  DATASET_TRACK_BLOCK_HEIGHT,
  HEADER_COLUMN_WIDTH
} from '$components/exploration/constants';
import { useDatasetHover } from '$components/exploration/hooks/use-dataset-hover';
import {
  useTimelineDatasetAtom,
  useTimelineDatasetVisibility
} from '$components/exploration/atoms/hooks';
import { analysisControllerAtom } from '$components/exploration/atoms/atoms';
import { useAnalysisDataRequest } from '$components/exploration/hooks/use-analysis-data-request';

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
  background: ${themeVal('color.base-100')};
`;

const DatasetHeaderInner = styled.div`
  box-shadow: 1px 1px 0 0 ${themeVal('color.base-200')};
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
  position: relative;
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
  const { isAnalyzing } = useAtomValue(analysisControllerAtom);

  const [isVisible, setVisible] = useTimelineDatasetVisibility(datasetAtom);

  const queryClient = useQueryClient();

  const retryDatasetMetadata = useCallback(() => {
    queryClient.invalidateQueries(
      {
        queryKey: ['dataset', datasetId],
        exact: true
      },
      { throwOnError: false }
    );
  }, [queryClient, datasetId]);

  const controls = useDragControls();

  // Hook to handle the hover state of the dataset. Check the source file as to
  // why this is needed.
  const {
    ref: datasetLiRef,
    isHovering,
    clientX,
    layerX,
    midY
  } = useDatasetHover();

  const dataPoint = getInteractionDataPoint({
    isHovering,
    xScaled,
    containerWidth: width,
    layerX,
    data: dataset.analysis.data?.timeseries
  });

  const {
    refs: popoverRefs,
    floatingStyles,
    isVisible: isPopoverVisible
  } = usePopover({
    x: clientX,
    y: midY,
    data: dataPoint
  });

  useAnalysisDataRequest({ datasetAtom });

  const isDatasetError = dataset.status === TimelineDatasetStatus.ERROR;
  const isDatasetLoading = dataset.status === TimelineDatasetStatus.LOADING;
  const isDatasetSuccess = dataset.status === TimelineDatasetStatus.SUCCESS;

  const isAnalysisAndError =
    isAnalyzing && dataset.analysis.status === TimelineDatasetStatus.ERROR;
  const isAnalysisAndLoading =
    isAnalyzing && dataset.analysis.status === TimelineDatasetStatus.LOADING;
  const isAnalysisAndSuccess =
    isAnalyzing && dataset.analysis.status === TimelineDatasetStatus.SUCCESS;

  const datasetLegend = dataset.data.legend;

  const analysisMetrics = useMemo(
    () => dataset.settings.analysisMetrics ?? [],
    [dataset]
  );

  return (
    <Reorder.Item
      ref={datasetLiRef}
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
          <DatasetHeaderInner>
            <CollecticonGripVertical onPointerDown={(e) => controls.start(e)} />
            <DatasetInfo>
              <DatasetHeadline>
                <Heading as='h3' size='xsmall'>
                  {dataset.data.name}
                </Heading>
                <Toolbar size='small'>
                  <DatasetOptions datasetAtom={datasetAtom} />
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
                </Toolbar>
              </DatasetHeadline>
              {datasetLegend?.type === 'categorical' && (
                <LayerCategoricalGraphic
                  type='categorical'
                  stops={datasetLegend.stops}
                />
              )}
              {datasetLegend?.type === 'gradient' && (
                <LayerGradientGraphic
                  type='gradient'
                  stops={datasetLegend.stops}
                  unit={datasetLegend.unit}
                  min={datasetLegend.min}
                  max={datasetLegend.max}
                />
              )}
            </DatasetInfo>
          </DatasetHeaderInner>
        </DatasetHeader>
        <DatasetData>
          {isDatasetLoading && <DatasetTrackLoading />}

          {isDatasetError && (
            <DatasetTrackError
              message='Oh no, something went wrong'
              onRetryClick={() => {
                retryDatasetMetadata();
              }}
            />
          )}

          {isDatasetSuccess && (
            <>
              {isAnalysisAndLoading && (
                <DatasetTrackLoading
                  message={
                    dataset.analysis.meta.total === undefined
                      ? 'Fetching item information'
                      : `${dataset.analysis.meta.loaded} of ${dataset.analysis.meta.total} items loaded`
                  }
                />
              )}
              {isAnalysisAndError && (
                <DatasetTrackError
                  message='Oh no, something went wrong'
                  onRetryClick={() => {
                    /* eslint-disable-next-line no-console */
                    console.log('Retry analysis loading');
                  }}
                />
              )}
              {isAnalysisAndSuccess && (
                <DatasetChart
                  xScaled={xScaled!}
                  width={width}
                  isVisible={!!isVisible}
                  data={dataset.analysis}
                  activeMetrics={analysisMetrics}
                  highlightDate={dataPoint?.date}
                />
              )}
            </>
          )}

          {isDatasetSuccess && !isAnalyzing && (
            <DatasetTrack
              width={width}
              xScaled={xScaled!}
              dataset={dataset}
              isVisible={!!isVisible}
            />
          )}

          {isDatasetSuccess && isVisible && isPopoverVisible && dataPoint && (
            <DatasetPopover
              ref={popoverRefs.setFloating}
              style={floatingStyles}
              timeDensity={dataset.data.timeDensity}
              activeMetrics={analysisMetrics}
              data={dataPoint}
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
  dataset: TimelineDatasetSuccess;
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

  const { blocks, wasLumped } = lumpBlocks({
    domain: domainToRender,
    xScaled,
    timeDensity: dataset.data.timeDensity
  });

  return (
    <svg width={width} height={DATASET_TRACK_BLOCK_HEIGHT + 2}>
      {blocks.map(([blockStart, blockEnd]) => (
        <DatasetTrackBlock
          key={blockStart.getTime()}
          xScaled={xScaled}
          startDate={blockStart}
          endDate={blockEnd}
          isVisible={isVisible}
          isGroup={wasLumped}
        />
      ))}
    </svg>
  );
}

interface DatasetTrackBlockProps {
  xScaled: ScaleTime<number, number>;
  startDate: Date;
  endDate: Date;
  isVisible: boolean;
  isGroup: boolean;
}

function DatasetTrackBlock(props: DatasetTrackBlockProps) {
  const { xScaled, startDate, endDate, isVisible, isGroup } = props;

  const theme = useTheme();

  const xStart = xScaled(startDate);
  const xEnd = xScaled(endDate);

  const fill = isVisible
    ? theme.color?.['base-400']
    : theme.color?.['base-200'];

  return (
    <g>
      {isGroup && (
        <rect
          fill={fill}
          y={0}
          height={DATASET_TRACK_BLOCK_HEIGHT}
          x={xStart}
          width={xEnd - xStart}
          rx={4}
          transform='translate(2, 2)'
        />
      )}
      <rect
        fill={fill}
        y={0}
        height={DATASET_TRACK_BLOCK_HEIGHT}
        x={xStart}
        width={xEnd - xStart}
        rx={4}
        stroke='#fff'
        strokeWidth={isGroup ? 1 : 0}
      />
    </g>
  );
}
