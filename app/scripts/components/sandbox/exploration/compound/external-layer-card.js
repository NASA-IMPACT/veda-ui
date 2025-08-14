import React, { useState } from 'react';
import styled from 'styled-components';
import Tippy from '@tippyjs/react';
import {
  useTimelineDatasetVisibility,
  useTimelineDatasetColormap,
  useTimelineDatasetColormapScale
} from '$components/exploration/atoms/hooks';
import BaseCard from '$components/common/card/uswds-cards/base-card';
import useParentDataset from '$components/exploration/hooks/use-parent-data';
import { TipButton } from '$components/common/tip-button';
import { USWDSIcon } from '$uswds';
import { LayerGradientColormapGraphic } from '$components/common/map/layer-legend';
import { ColormapOptions } from '$components/exploration/components/datasets/colormap-options';

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

export default function ExternalLayerCardExample(props) {
  const { dataset } = props;
  const [isColorMapOpen, setIsColorMapOpen] = useState(false);
  const [isVisible, setVisible] = useTimelineDatasetVisibility(dataset.data.id);
  const [colorMap, setColorMap] = useTimelineDatasetColormap(dataset.data.id);
  const [colorMapScale, setColorMapScale] = useTimelineDatasetColormapScale(
    dataset.data.id
  );

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
