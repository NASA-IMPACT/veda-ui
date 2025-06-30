import React, { useCallback, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { Reorder, useDragControls } from 'framer-motion';
import styled, { useTheme } from 'styled-components';
import addDays from 'date-fns/addDays';
import subDays from 'date-fns/subDays';
import areIntervalsOverlapping from 'date-fns/areIntervalsOverlapping';
import { useQueryClient } from '@tanstack/react-query';
import { ScaleTime } from 'd3';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import {
  DatasetPopover,
  getInteractionDataPoint,
  usePopover
} from '../chart-popover';
import LayerInfoModal, { LayerInfoModalData } from '../layer-info-modal';
import {
  DatasetTrackError,
  DatasetTrackLoading
} from './dataset-list-item-status';
import { DatasetChart } from './dataset-chart';
import { getBlockBoundaries, lumpBlocks } from './block-utils';
import DataLayerCard from './data-layer-card';
import {
  DatasetStatus,
  TimelineDataset,
  TimelineDatasetSuccess
} from '$components/exploration/types.d.ts';
import {
  DATASET_TRACK_BLOCK_HEIGHT,
  HEADER_COLUMN_WIDTH
} from '$components/exploration/constants';
import { useDatasetHover } from '$components/exploration/hooks/use-dataset-hover';
import {
  useTimelineDatasetAtom,
  useTimelineDatasetColormap,
  useTimelineDatasetSettings,
  useTimelineDatasetVisibility,
  useTimelineDatasetColormapScale,
  useAnalysisVariable
} from '$components/exploration/atoms/hooks';
import {
  useAnalysisController,
  useAnalysisDataRequest
} from '$components/exploration/hooks/use-analysis-data-request';

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
`;

const DatasetData = styled.div`
  position: relative;
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

  const { isAnalyzing, runAnalysis } = useAnalysisController();

  const [isVisible, setVisible] = useTimelineDatasetVisibility(datasetAtom);
  const [colorMap, setColorMap] = useTimelineDatasetColormap(datasetAtom);
  const [colorMapScale, setColorMapScale] =
    useTimelineDatasetColormapScale(datasetAtom);
  const [modalLayerInfo, setModalLayerInfo] =
    React.useState<LayerInfoModalData>();
  const [, setSetting] = useTimelineDatasetSettings(datasetAtom);
  const setSelectedVariable = useAnalysisVariable(datasetAtom);

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

  const onClickLayerInfo = useCallback(() => {
    const data: LayerInfoModalData = {
      name: dataset.data.name,
      description: dataset.data.description,
      info: dataset.data.info,
      parentData: dataset.data.parentDataset
    };
    setModalLayerInfo(data);
  }, [dataset]);

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

  const selectedVariable = dataset.settings.analysisVariable;
  const timeSeriesData = selectedVariable? dataset.analysis.data?.timeseries[selectedVariable]: [];

  const dataPoint = getInteractionDataPoint({
    isHovering,
    xScaled,
    containerWidth: width,
    layerX,
    data: timeSeriesData
  });

  const {
    refs: popoverRefs,
    floatingStyles,
    isVisible: isPopoverVisible
  } = usePopover({
    enabled: isAnalyzing,
    x: clientX,
    y: midY,
    xScaled,
    data: dataPoint,
    dataset: timeSeriesData
  });

  useAnalysisDataRequest({ datasetAtom });

  const isDatasetError = dataset.status === DatasetStatus.ERROR;
  const isDatasetLoading = dataset.status === DatasetStatus.LOADING;
  const isDatasetSuccess = dataset.status === DatasetStatus.SUCCESS;

  const isAnalysisAndError =
    isAnalyzing && dataset.analysis.status === DatasetStatus.ERROR;
  const isAnalysisAndLoading =
    isAnalyzing && dataset.analysis.status === DatasetStatus.LOADING;
  const isAnalysisAndSuccess =
    isAnalyzing && dataset.analysis.status === DatasetStatus.SUCCESS;

  const datasetLegend = dataset.data.legend;
  const analysisMetrics = useMemo(
    () => dataset.settings.analysisMetrics ?? [],
    [dataset]
  );

  const onDragging = (e) => {
    controls.start(e);
  };

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
            <div style={{ width: '100%' }} onPointerDown={onDragging}>
              <DataLayerCard
                dataset={dataset}
                datasetAtom={datasetAtom}
                colorMap={colorMap}
                colorMapScale={colorMapScale}
                setColorMap={setColorMap}
                setColorMapScale={setColorMapScale}
                isVisible={isVisible}
                setVisible={setVisible}
                datasetLegend={datasetLegend}
                onClickLayerInfo={onClickLayerInfo}
              />
            </div>
            {modalLayerInfo && (
              <LayerInfoModal
                revealed={!!modalLayerInfo}
                close={() => setModalLayerInfo(undefined)}
                layerData={modalLayerInfo}
              />
            )}
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
                  onUpdateSettings={setSetting}
                  setSelectedVariable={setSelectedVariable}
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
              dataset={dataset}
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
