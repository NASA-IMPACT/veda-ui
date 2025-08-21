import React, { useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import {
  CollecticonCircleInformation,
  CollecticonEyeDisabled,
  CollecticonEye,
  CollecticonChevronDownSmall,
  CollecticonChevronDown,
  CollecticonChevronUp
} from '@devseed-ui/collecticons';
import { Toolbar } from '@devseed-ui/toolbar';
import { Heading } from '@devseed-ui/typography';
import Tippy from '@tippyjs/react';
import LayerInfoModal, { LayerInfoModalData } from '../layer-info-modal';
import { LayerInfoLiner } from '../layer-info-modal';
import LayerMenuOptions from './layer-options-menu';
import { ColormapOptions } from './colormap-options';
import { TipButton } from '$components/common/tip-button';
import {
  LayerCategoricalGraphic,
  LayerGradientColormapGraphic,
  renderSwatchLine
} from '$components/common/map/layer-legend';
import {
  TimelineDataset,
  colorMapScale
} from '$components/exploration/types.d.ts';
import { CollecticonDatasetLayers } from '$components/common/icons-legacy/dataset-layers';
import { ParentDatasetTitle } from '$components/common/catalog/catalog-legacy/catalog-content';

import 'tippy.js/dist/tippy.css';
import { LoadingSkeleton } from '$components/common/loading-skeleton';

// InfoModal Component Group
interface InfoModalGroupProps {
  dataset: TimelineDataset;
  footerContent?: React.ReactNode;
}

export function InfoModalGroup({
  dataset,
  footerContent
}: InfoModalGroupProps) {
  const [modalLayerInfo, setModalLayerInfo] = useState<LayerInfoModalData>();
  const onClickLayerInfo = useCallback(() => {
    const data: LayerInfoModalData = {
      name: dataset.data.name,
      description: dataset.data.description,
      info: dataset.data.info,
      parentData: dataset.data.parentDataset
    };
    setModalLayerInfo(data);
  }, [dataset]);

  const onCloseModal = () => {
    setModalLayerInfo(undefined);
  };
  return (
    <>
      <TipButton
        tipContent='Layer info'
        size='small'
        fitting='skinny'
        onClick={onClickLayerInfo}
      >
        <CollecticonCircleInformation meaningful title='View dataset page' />
      </TipButton>
      {modalLayerInfo && (
        <LayerInfoModal
          revealed={!!modalLayerInfo}
          close={onCloseModal}
          layerData={modalLayerInfo}
          footerContent={footerContent}
        />
      )}
    </>
  );
}

// Colormap Component Group
interface ColormapGroupProps {
  dataset: TimelineDataset;
  colorMap: string | undefined;
  setColorMap: (colorMap: string) => void;
  colorMapScale: colorMapScale | undefined;
  setColorMapScale: (colorMapScale: colorMapScale) => void;
}

export function ColormapGroup({
  dataset,
  colorMap,
  setColorMap,
  colorMapScale,
  setColorMapScale
}: ColormapGroupProps) {
  const datasetLegend = dataset.data.legend;
  // Logic moved from container
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
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const [isColorMapOpen, setIsColorMapOpen] = useState(false);
  const [isChevToggleExpanded, setIsChevToggleExpanded] = useState(true);
  const [min, max] =
    datasetLegend?.type === 'gradient' &&
    datasetLegend.min != null &&
    datasetLegend.max != null
      ? ([datasetLegend.min, datasetLegend.max] as [number, number])
      : dataset.data.sourceParams?.rescale || [0, 1];
  const handleColorMapTriggerClick = () => {
    setIsColorMapOpen((prev) => !prev);
  };

  const handleColorMapClose = () => {
    setIsColorMapOpen(false);
  };

  const handleClickOutside = (event: any) => {
    if (triggerRef.current && !triggerRef.current.contains(event.target)) {
      handleColorMapClose();
    }
  };

  const chevToggleExpanded = () => {
    setIsChevToggleExpanded((prev) => !prev);
  };

  return (
    <>
      {datasetLegend?.type === 'categorical' && (
        <TipButton
          tipContent={
            isChevToggleExpanded ? 'Expand Legend' : 'Collapse Legend'
          }
          size='small'
          fitting='skinny'
          onClick={chevToggleExpanded}
        >
          {isChevToggleExpanded ? (
            <CollecticonChevronDown title='Expand Legend' meaningful />
          ) : (
            <CollecticonChevronUp title='Collapse Legend' meaningful />
          )}
        </TipButton>
      )}

      {datasetLegend?.type === 'categorical' && (
        <div style={{ cursor: 'pointer' }}>
          {renderSwatchLine(datasetLegend)}
        </div>
      )}
      {datasetLegend?.type === 'categorical' && !isChevToggleExpanded && (
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
          {datasetLegend?.type === 'gradient' && (
            <LayerGradientColormapGraphic
              stops={datasetLegend.stops}
              min={min}
              max={max}
              colorMap={colorMap}
            />
          )}
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
              <CollecticonChevronDownSmall />
            </LegendColorMapTrigger>
          </Tippy>
        </div>
      )}
      {showNonConfigurableCmap && datasetLegend?.type === 'gradient' && (
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

interface PresentationalProps {
  dataset: TimelineDataset;
  isVisible: boolean | undefined;
  setVisible: any;
  opacity: number;
  onOpacityChange: (opacity: number) => void;
  colorMap: string | undefined;
  setColorMap: (colorMap: string) => void;
  colorMapScale: colorMapScale | undefined;
  setColorMapScale: (colorMapScale: colorMapScale) => void;
  parentDataset: any;
  onRemoveLayer: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  footerContent?: React.ReactNode;
}

const Header = styled.header`
  width: 100%;
  display: flex;
  flex-flow: row;
`;

const DatasetCardInfo = styled.div`
  padding-bottom: 0.5rem;
  gap: 0rem;
`;

const DatasetInfo = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column;
  gap: 0.5rem;
  background-color: ${themeVal('color.surface')};
  padding: ${glsp(1)} ${glsp(1)};
  border-radius: ${themeVal('shape.rounded')};
  border: 1px solid ${themeVal('color.base-200')};

  &:hover {
    outline: 2px solid ${themeVal('color.primary-500')};
    cursor: grab;
  }
  &:active {
    outline: none;
    cursor: grabbing;
    filter: drop-shadow(0 0.2rem 0.25rem rgba(0, 0, 0, 0.2));
  }
  ${DatasetCardInfo} {
    gap: 0rem;
  }
  &.layerHidden {
    opacity: 0.5;
  }
`;

const DatasetHeadline = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 4px;
`;

const DatasetToolbar = styled(Toolbar)`
  align-items: flex-start;
`;

const DatasetTitle = styled(Heading)`
  font-weight: bold;
  font-size: 0.875rem;
`;

const DatasetMetricInfo = styled.div`
  font-size: 0.75rem;
  color: ${themeVal('color.base-500')};
`;

const LegendColorMapTrigger = styled.div`
  min-height: 46px;
  min-width: 25px;
  cursor: pointer;
`;

export default function DataLayerCardPresentational(
  props: PresentationalProps
) {
  const {
    dataset,
    isVisible,
    setVisible,
    colorMap,
    setColorMap,
    colorMapScale,
    setColorMapScale,
    parentDataset,
    onRemoveLayer,
    onMoveUp,
    onMoveDown,
    canMoveUp,
    canMoveDown,
    opacity,
    onOpacityChange,
    footerContent
  } = props;
  const layerInfo = dataset.data.info;
  return (
    <>
      <DatasetInfo className={isVisible ? 'layerShown' : 'layerHidden'}>
        <DatasetCardInfo>
          <Header>
            <ParentDatasetTitle size='small'>
              <CollecticonDatasetLayers /> <p>{parentDataset?.name}</p>
            </ParentDatasetTitle>
          </Header>
          <DatasetHeadline>
            <div>
              <DatasetTitle as='h3' size='xxsmall'>
                {dataset.data.name}
              </DatasetTitle>
              <DatasetMetricInfo>
                {layerInfo && <LayerInfoLiner info={layerInfo} />}
              </DatasetMetricInfo>
            </div>
            <DatasetToolbar size='small'>
              <InfoModalGroup dataset={dataset} footerContent={footerContent} />
              <TipButton
                tipContent={isVisible ? 'Hide layer' : 'Show layer'}
                size='small'
                fitting='skinny'
                onPointerDownCapture={(e) => e.stopPropagation()}
                onClick={() => setVisible((v) => !v)}
              >
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
              </TipButton>
              <LayerMenuOptions
                dataset={dataset}
                onRemoveLayer={onRemoveLayer}
                onMoveUp={onMoveUp}
                onMoveDown={onMoveDown}
                canMoveUp={canMoveUp}
                canMoveDown={canMoveDown}
                opacity={opacity}
                onOpacityChange={onOpacityChange}
              />
            </DatasetToolbar>
          </DatasetHeadline>
        </DatasetCardInfo>
        <ColormapGroup
          dataset={dataset}
          colorMap={colorMap}
          setColorMap={setColorMap}
          colorMapScale={colorMapScale}
          setColorMapScale={setColorMapScale}
        />
      </DatasetInfo>
    </>
  );
}
