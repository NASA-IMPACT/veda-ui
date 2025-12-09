import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Icon } from '@trussworks/react-uswds';
import Tippy from '@tippyjs/react';
import { ColormapOptions } from './colormap-options';
import { LayerGradientColormapGraphic } from '$components/common/map/layer-legend';
import {
  TimelineDataset,
  colorMapScale
} from '$components/exploration/types.d';
import { LoadingSkeleton } from '$components/common/loading-skeleton';
import {
  LayerCategoricalGraphic,
  renderSwatchLine
} from '$components/common/map/layer-legend';

interface ColormapSectionProps {
  dataset: TimelineDataset;
  colorMap: string | undefined;
  setColorMap: (colorMap: string) => void;
  colorMapScale: colorMapScale | undefined;
  setColorMapScale: (colorMapScale: colorMapScale) => void;
  isCategoricalLegendExpanded: boolean;
}

const LegendColorMapTrigger = styled.div`
  min-height: 46px;
  min-width: 25px;
  cursor: pointer;
`;

export function ColormapSection({
  dataset,
  colorMap,
  setColorMap,
  colorMapScale,
  setColorMapScale,
  isCategoricalLegendExpanded
}: ColormapSectionProps) {
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const [isColorMapOpen, setIsColorMapOpen] = useState(false);
  const handleColorMapTriggerClick = () => {
    setIsColorMapOpen((prev) => !prev);
  };
  const datasetLegend = dataset.data.legend;

  const [min, max] =
    datasetLegend?.type === 'gradient' &&
    datasetLegend.min != null &&
    datasetLegend.max != null
      ? ([datasetLegend.min, datasetLegend.max] as [number, number])
      : dataset.data.sourceParams?.rescale || [0, 1];

  const showLoadingConfigurableCmapSkeleton =
    dataset.status === 'loading' && datasetLegend?.type === 'gradient';

  const showConfigurableCmap = (dataset.status === 'success' &&
    dataset.data.type !== 'wmts' &&
    dataset.data.type !== 'wms' &&
    datasetLegend?.type === 'gradient' &&
    colorMap) as boolean;

  const showNonConfigurableCmap =
    !showConfigurableCmap &&
    !showLoadingConfigurableCmapSkeleton &&
    datasetLegend?.type === 'gradient';

  const handleColorMapClose = () => {
    setIsColorMapOpen(false);
  };

  // Handle click outside to close colormap dropdown
  const handleClickOutside = (event: any) => {
    if (triggerRef.current && !triggerRef.current.contains(event.target)) {
      handleColorMapClose();
    }
  };

  return (
    <>
      {datasetLegend?.type === 'categorical' && (
        <div style={{ cursor: 'pointer' }}>
          {renderSwatchLine(datasetLegend)}
        </div>
      )}
      {datasetLegend?.type === 'categorical' &&
        !isCategoricalLegendExpanded && (
          <LayerCategoricalGraphic
            type='categorical'
            stops={datasetLegend.stops}
          />
        )}
      {showLoadingConfigurableCmapSkeleton && (
        <div className='display-flex flex-align-center height-8'>
          <LoadingSkeleton />
        </div>
      )}
      {showConfigurableCmap && (
        <div
          className='display-flex flex-align-center flex-justify margin-y-1 padding-left-1 border-bottom-1px border-base-lightest radius-md'
          ref={triggerRef}
        >
          <LayerGradientColormapGraphic
            // @ts-expect-error Show NonConfigurableCmap guarantees stops
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
                toggleColormap={handleColorMapTriggerClick}
                setColorMapScale={setColorMapScale}
                colorMapScale={colorMapScale}
              />
            }
            appendTo={() => document.body}
            visible={isColorMapOpen}
            interactive={true}
            placement='top'
            onClickOutside={(_, event) => handleClickOutside(event)}
          >
            <LegendColorMapTrigger
              className='display-flex flex-align-center flex-justify bg-base-lightest margin-left-1 padding-05'
              onClick={handleColorMapTriggerClick}
            >
              <Icon.ExpandMore size={3} />
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
    </>
  );
}
