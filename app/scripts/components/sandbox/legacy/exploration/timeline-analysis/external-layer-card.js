import React, { useState, useMemo, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Tippy from '@tippyjs/react';
import { themeVal } from '@devseed-ui/theme-provider';
import { useAtomValue, useAtom } from 'jotai';
import { CollecticonExpandCollapse } from '@devseed-ui/collecticons';
import add from 'date-fns/add';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import max from 'date-fns/max';
import sub from 'date-fns/sub';
import { mockSelectedDay } from '../mock-data';
import {
  useTimelineDatasetVisibility,
  useTimelineDatasetColormap,
  useTimelineDatasetColormapScale,
  useTimelineDatasetAtom,
  useTimelineDatasetsDomain
} from '$components/exploration/atoms/hooks';
import BaseCard from '$components/common/card/uswds-cards/base-card';
import useParentDataset from '$components/exploration/hooks/use-parent-data';
import { TipButton } from '$components/common/tip-button';
import { USWDSIcon } from '$uswds';
import { LayerGradientColormapGraphic } from '$components/common/map/layer-legend';
import { ColormapOptions } from '$components/exploration/components/datasets/colormap-options';
import { DatasetChart } from '$components/exploration/components/datasets/dataset-chart';
import {
  useAnalysisController,
  useAnalysisDataRequest
} from '$components/exploration/hooks/use-analysis-data-request';
import {
  // useScaleFacstors,
  useScales
} from '$components/exploration/hooks/scales-hooks';
import {
  timelineSizesAtom
  // timelineWidthAtom,
  // zoomTransformAtom
} from '$components/exploration/atoms/timeline';
// import { getInteractionDataPoint } from '$components/exploration/components/chart-popover';
import { selectedIntervalAtom } from '$components/exploration/atoms/dates';

const DatasetHeadline = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 4px;
`;
const LegendColorMapTrigger = styled.div`
  min-height: 46px;
  min-width: 25px;
  cursor: pointer;
`;

const TimelineWrapper = styled.div`
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-flow: column;
  height: 100%;

  svg {
    display: block;
  }
`;

const InteractionRect = styled.div`
  position: absolute;
  left: 20rem;
  top: 3.5rem;
  bottom: 0;
  right: ${96}px;
  /* background-color: rgba(255, 0, 0, 0.08); */
  box-shadow: 1px 0 0 0 ${themeVal('color.base-200')},
    inset 1px 0 0 0 ${themeVal('color.base-200')};
  z-index: 100;
`;

const getIntervalFromDate = (selectedDay, dataDomain) => {
  const startDate = sub(selectedDay, { months: 2 });
  const endDate = add(selectedDay, { months: 2 });
  // Set start and end days from the selected day, if able.
  const [start, end] = dataDomain;
  return {
    start: isAfter(startDate, start) ? startDate : selectedDay,
    end: isBefore(endDate, end) ? endDate : end
  };
};

export default function ExternalLayerCardExample(props) {
  const { dataset, selectedDay } = props;
  const datasetAtom = useTimelineDatasetAtom(dataset.data.id);
  const [isColorMapOpen, setIsColorMapOpen] = useState(false);
  const [isVisible, setVisible] = useTimelineDatasetVisibility(datasetAtom);
  const [colorMap, setColorMap] = useTimelineDatasetColormap(datasetAtom);
  const [colorMapScale, setColorMapScale] =
    useTimelineDatasetColormapScale(datasetAtom);
  const { scaled: xScaled } = useScales();
  // const { contentWidth: width } = useAtomValue(timelineSizesAtom);
  const dataDomain = useTimelineDatasetsDomain();
  const [selectedInterval, setSelectedInterval] = useAtom(selectedIntervalAtom);
  const interactionRef = useRef < HTMLDivElement > null;

  // setSelectedInterval(getIntervalFromDate(selectedDay, dataDomain));
  useEffect(() => {
    if (dataDomain) {
      const intervalFromDate = getIntervalFromDate(selectedDay, dataDomain);
      console.log(`intervalFromDate`, intervalFromDate);
      setSelectedInterval(intervalFromDate);
    }
  }, [selectedDay, dataDomain]);

  const { isAnalyzing, runAnalysis } = useAnalysisController();

  useAnalysisDataRequest({ datasetAtom });
  const isAnalysisAndSuccess =
    isAnalyzing && dataset.analysis.status == 'success';

  // const dataPoint = getInteractionDataPoint({
  //   isHovering,
  //   xScaled,
  //   containerWidth: width,
  //   layerX,
  //   data: timeSeriesData
  // });

  const { parentDataset } = useParentDataset({
    datasetId: dataset.data.parentDataset.id
  });

  const datasetLegend = dataset.data.legend;
  const showLoadingConfigurableCmapSkeleton =
    dataset.status === 'loading' && datasetLegend?.type === 'gradient';

  const showConfigurableCmap =
    !!setColorMap &&
    !!setColorMapScale &&
    dataset.status === 'success' &&
    dataset.data.type !== 'wmts' &&
    dataset.data.type !== 'wms' &&
    datasetLegend?.type === 'gradient' &&
    colorMap;

  const showNonConfigurableCmap =
    !showConfigurableCmap &&
    !showLoadingConfigurableCmapSkeleton &&
    datasetLegend?.type === 'gradient';

  const [min, max] =
    datasetLegend?.type === 'gradient' &&
    datasetLegend.min != null &&
    datasetLegend.max != null
      ? [datasetLegend.min, datasetLegend.max]
      : dataset.data.sourceParams?.rescale || [0, 1];

  const handleColorMapTriggerClick = () => {
    setIsColorMapOpen((prev) => !prev);
  };

  ///////////// ANALYSIS /////////////
  const analysisMetrics = useMemo(
    () => dataset.settings.analysisMetrics ?? [],
    [dataset]
  );
  const cardHeader = {
    element: (
      <h6 className='usa-card__heading font-code-sm'>{parentDataset?.name}</h6>
    )
  };

  const cardBody = {
    element: (
      <DatasetHeadline>
        <p className='font-code-3xs'>{dataset.data.name}</p>
        <div>
          <TipButton
            tipContent={isVisible ? 'Hide layer' : 'Show layer'}
            size='small'
            fitting='skinny'
            onPointerDownCapture={(e) => e.stopPropagation()}
            onClick={() => setVisible((v) => !v)}
          >
            {isVisible ? (
              <USWDSIcon.Visibility title='Toggle dataset visibility' />
            ) : (
              <USWDSIcon.VisibilityOff title='Toggle dataset visibility' />
            )}
          </TipButton>
        </div>
      </DatasetHeadline>
    )
  };

  const shouldRenderTimeline = xScaled && dataDomain;

  const cardFooter = {
    element: (
      <>
        {showConfigurableCmap && (
          <div className='display-flex flex-align-center flex-justify margin-y-1 padding-left-1 border-bottom-1px border-base-lightest radius-md'>
            <LayerGradientColormapGraphic
              stops={datasetLegend.stops}
              min={min}
              max={max}
              colorMap={colorMap}
            />
            <Tippy
              className='colormap-options'
              content={
                <ColormapOptions
                  min={Number(min)}
                  max={Number(max)}
                  colorMap={colorMap}
                  setColorMap={setColorMap}
                  setColorMapScale={setColorMapScale}
                  colorMapScale={colorMapScale}
                />
              }
              appendTo={() => document.body}
              visible={isColorMapOpen}
              interactive={true}
              placement='top'
            >
              <LegendColorMapTrigger
                className='display-flex flex-align-center flex-justify bg-base-lightest margin-left-1 padding-05'
                onClick={handleColorMapTriggerClick}
              >
                <USWDSIcon.ExpandMore />
              </LegendColorMapTrigger>
            </Tippy>
          </div>
        )}
        {showNonConfigurableCmap && (
          <LayerGradientColormapGraphic
            stops={datasetLegend.stops}
            min={min}
            max={max}
            colorMap={colorMap}
          />
        )}
        {isAnalysisAndSuccess && (
          <TimelineWrapper>
            {/* <InteractionRect
              ref={interactionRef}
              style={
                !shouldRenderTimeline ? { pointerEvents: 'none' } : undefined
              }
              data-tour='timeline-interaction-rect'
            /> */}
            {/* // @TODO-SANDRA: chart is not working and this is what seems to
            display the line but currently when uncommented, it breaks */}
            <DatasetChart
              xScaled={xScaled}
              width={800}
              isVisible={!!isVisible}
              dataset={dataset}
              activeMetrics={analysisMetrics}
              highlightDate={mockSelectedDay}
              onUpdateSettings={() => {}}
            />
          </TimelineWrapper>
        )}
      </>
    )
  };

  const cardProps = {
    header: cardHeader,
    body: cardBody,
    footer: cardFooter
  };

  return <BaseCard headerFirst={true} {...cardProps} />;
}
