import React, { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { Reorder, useDragControls } from 'framer-motion';
import styled, { useTheme } from 'styled-components';
import { addDays, subDays, areIntervalsOverlapping } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';
import { ScaleTime } from 'd3';
import {
  CollecticonCircleInformation,
  CollecticonEye,
  CollecticonEyeDisabled,
  CollecticonGripVertical
} from '@devseed-ui/collecticons';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';
import { Toolbar } from '@devseed-ui/toolbar';
import { Heading } from '@devseed-ui/typography';

import { CollecticonDatasetLayers } from '$components/common/icons/dastaset-layers'
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
import {
  useAnalysisController,
  useAnalysisDataRequest
} from '$components/exploration/hooks/use-analysis-data-request';
import { getDatasetPath } from '$utils/routes';
import { findParentDataset } from '$components/exploration/data-utils';
import { TipButton, TipToolbarIconButton } from '$components/common/tip-button';
import LayerMenuOptions from './layer-options-menu';

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
  background-color: ${themeVal('color.base-50')};
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
  background-color: ${themeVal('color.surface')};
  padding: ${glsp(0.5)};
  border-radius: ${themeVal('shape.rounded')};
  border: 1px solid ${themeVal('color.base-200')};
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

const ParentDatasetButton = styled(Button)`
  color: ${themeVal('color.link')};
  text-align: left;
  text-transform: none;
  font-size: 0.75rem;
  line-height: 0.75rem;
  > svg {
    fill: ${themeVal('color.link')};
  }
`;

const DatasetMetricInfo = styled.div`
  font-size: 0.75rem;
  font-color: ${themeVal('color.base-500')}
`;
const DatasetTitle = styled(Heading)`
  font-weight: 600;
  font-size: 14px;

`
interface DatasetListItemProps {
  datasetId: string;
  width: number;
  xScaled?: ScaleTime<number, number>;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

// @TODO: Fix types
interface CardProps {
  dataset: any;
  datasetAtom: any;
  isVisible: any;
  datasetId: any;
  setVisible: any;
  datasetLegend: any;
}

function DataCard(props: CardProps) {
  const {dataset, datasetAtom, isVisible, datasetId, setVisible, datasetLegend} = props;

  // @TODO: Replace icon
  const Header = styled.header`
    width: 100%;
    display: flex;
    flex-flow: row;

    a {
      display: flex;
      width: 100%;
      gap: 0.5rem;
    }
  `;

  const parent = findParentDataset(datasetId);

  return (
    <DatasetInfo className="dataset-info">
      <Header>
        <ParentDatasetButton variation="base-text" size="small" fitting="skinny">
          <CollecticonDatasetLayers /> {parent?.name}
        </ParentDatasetButton>
      </Header>
      <DatasetHeadline>
        <DatasetTitle as='h3' size='xxsmall'>
          {dataset.data.name}
        </DatasetTitle>
        <Toolbar size='small'>
          <TipButton
            forwardedAs={Link}
            tipContent='Go to dataset information page'
            // Using a button instead of a toolbar button because the
            // latter doesn't support the `forwardedAs` prop.
            size='small'
            fitting='skinny'
            // @TODO: findout what ! does.
            to={getDatasetPath(parent!)}
          >
            <CollecticonCircleInformation
              meaningful
              title='View dataset page'
            />
          </TipButton>
          {/* <DatasetOptions datasetAtom={datasetAtom} /> */}
          <LayerMenuOptions datasetAtom={datasetAtom} isVisible={isVisible} setVisible={setVisible} />
        </Toolbar>
      </DatasetHeadline>
      <DatasetMetricInfo>
          <span>Harcoded : Metric info</span>
        </DatasetMetricInfo>
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
  )
}

export function DatasetListItem(props: DatasetListItemProps) {
  const { datasetId, width, xScaled, onDragStart, onDragEnd } = props;

  const datasetAtom = useTimelineDatasetAtom(datasetId);
  const dataset = useAtomValue(datasetAtom);

  const { isAnalyzing, runAnalysis } = useAnalysisController();

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
    enabled: isAnalyzing,
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
      data-tour='dataset-list-item'
    >
      <DatasetItem>
        <DatasetHeader>
          <DatasetHeaderInner>
            <CollecticonGripVertical onPointerDown={(e) => controls.start(e)} />
            <DataCard dataset={dataset} datasetAtom={datasetAtom} isVisible={isVisible} datasetId={datasetId} setVisible={setVisible} datasetLegend={datasetLegend} />
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
                  error={dataset.analysis.error}
                  message='Oh no, something went wrong'
                  onRetryClick={() => {
                    /* eslint-disable-next-line no-console */
                    console.log('Retry analysis loading');
                    runAnalysis(dataset.data.id);
                  }}
                />
              )}
              {isAnalysisAndSuccess && (
                <DatasetChart
                  xScaled={xScaled!}
                  width={width}
                  isVisible={!!isVisible}
                  dataset={dataset}
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
