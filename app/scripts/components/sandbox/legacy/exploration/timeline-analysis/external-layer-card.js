import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Tippy from '@tippyjs/react';
import { useAtom } from 'jotai';
import add from 'date-fns/add';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import sub from 'date-fns/sub';
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
import {
  useAnalysisController,
  useAnalysisDataRequest
} from '$components/exploration/hooks/use-analysis-data-request';
import {
  useScaleFactors,
  useScales
} from '$components/exploration/hooks/scales-hooks';
import TimelineSingle from '$components/exploration/components/timeline-single/timeline';
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
  const dataDomain = useTimelineDatasetsDomain();

  useEffect(() => {
    if (dataDomain) {
      const intervalFromDate = getIntervalFromDate(selectedDay, dataDomain);
      setSelectedInterval(intervalFromDate);
    }
  }, [selectedDay, dataDomain]);

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
  const [selectedInterval, setSelectedInterval] = useAtom(selectedIntervalAtom);

  const { setObsolete, isAnalyzing } = useAnalysisController();

  useAnalysisDataRequest({ datasetAtom });

  const isAnalysisAndSuccess =
    isAnalyzing && dataset.analysis.status == 'success';

  const isDatasetSuccess = dataset.status === 'success';

  const scaleFactors = useScaleFactors();
  const { scaled: xScaled, main: xMain } = useScales();

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
        {isDatasetSuccess && isAnalysisAndSuccess && (
          <TimelineWrapper>
            <TimelineSingle
              dataset={dataset}
              selectedDay={selectedDay}
              setSelectedDay={() => true}
              selectedCompareDay={null}
              setSelectedCompareDay={() => true}
              panelHeight={100}
              selectedInterval={selectedInterval}
              setSelectedInterval={setSelectedInterval}
              dataDomain={dataDomain}
              setObsolete={setObsolete}
              scaleFactors={scaleFactors}
              xScaled={xScaled}
              xMain={xMain}
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
