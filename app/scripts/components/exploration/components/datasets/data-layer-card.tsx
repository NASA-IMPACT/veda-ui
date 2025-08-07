import React, { useRef, useState, useCallback } from 'react';
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
import { LayerInfoLiner, LayerInfoModalData } from '../layer-info-modal';
import LayerMenuOptions from './layer-options-menu';
import { ColormapOptions } from './colormap-options';
import {
  useTimelineDatasetAtom,
  useTimelineDatasetColormap,
  useTimelineDatasetVisibility,
  useTimelineDatasetColormapScale
} from '$components/exploration/atoms/hooks';
import { TipButton } from '$components/common/tip-button';
import {
  LayerCategoricalGraphic,
  LayerGradientColormapGraphic,
  renderSwatchLine
} from '$components/common/map/layer-legend';
import useParentDataset from '$components/exploration/hooks/use-parent-data';
import {
  TimelineDataset,
  colorMapScale
} from '$components/exploration/types.d.ts';
import { CollecticonDatasetLayers } from '$components/common/icons/dataset-layers';
import { ParentDatasetTitle } from '$components/common/catalog/catalog-legacy/catalog-content';

import 'tippy.js/dist/tippy.css';
import { LoadingSkeleton } from '$components/common/loading-skeleton';

interface CardProps {
  dataset: TimelineDataset;
  isVisible: boolean | undefined;
  setVisible?: (any) => void;
  colorMap: string | undefined;
  setColorMap?: (colorMap: string) => void;
  colorMapScale: colorMapScale | undefined;
  setColorMapScale?: (colorMapScale: colorMapScale) => void;
  onClickLayerInfo?: () => void;
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

export default function DataLayerCard(props: CardProps) {
  const {
    dataset,
    isVisible,
    setVisible,
    colorMap,
    setColorMap,
    colorMapScale,
    setColorMapScale,
    onClickLayerInfo
  } = props;

  const datasetAtom = useTimelineDatasetAtom(dataset.data.id);
  const datasetLegend = dataset.data.legend;

  const layerInfo = dataset.data.info;
  const [min, max] =
    datasetLegend?.type === 'gradient' &&
    datasetLegend.min != null &&
    datasetLegend.max != null
      ? [datasetLegend.min, datasetLegend.max]
      : dataset.data.sourceParams?.rescale || [0, 1];
  const [isColorMapOpen, setIsColorMapOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  const handleColorMapTriggerClick = () => {
    setIsColorMapOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (triggerRef.current && !triggerRef.current.contains(event.target)) {
      setIsColorMapOpen(false);
    }
  };

  const { parentDataset } = useParentDataset({
    datasetId: dataset.data.parentDataset.id
  });

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

  const showDataLayerInfoModalButton = !!onClickLayerInfo;
  const showVisibilityButton = !!setVisible;

  const [isChevToggleExpanded, setIsChevToggleExpanded] = useState(true);
  const chevToggleExpanded = () => {
    setIsChevToggleExpanded((prev) => !prev);
  };

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
            <DatasetTitle as='h3' size='xxsmall'>
              {dataset.data.name}
            </DatasetTitle>
            <DatasetToolbar size='small'>
              {showDataLayerInfoModalButton && (
                <TipButton
                  tipContent='Layer info'
                  size='small'
                  fitting='skinny'
                  onPointerDownCapture={(e) => e.stopPropagation()}
                  onClick={onClickLayerInfo}
                >
                  <CollecticonCircleInformation
                    meaningful
                    title='View dataset page'
                  />
                </TipButton>
              )}
              {showVisibilityButton && (
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
              )}
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
              <LayerMenuOptions datasetAtom={datasetAtom} />
            </DatasetToolbar>
          </DatasetHeadline>

          <DatasetMetricInfo>
            {layerInfo && <LayerInfoLiner info={layerInfo} />}
          </DatasetMetricInfo>
        </DatasetCardInfo>
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

        {/* Show a loading skeleton when the color map is not categorical and the dataset
          status is 'loading'. This is because we color map sometimes might come from the titiler
          which could introduce a visual flash when going from the 'default' color map to the one
          configured in titiler */}

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
        {showNonConfigurableCmap && (
          <LayerGradientColormapGraphic
            stops={datasetLegend.stops}
            min={min}
            max={max}
            colorMap={colorMap}
          />
        )}
      </DatasetInfo>
    </>
  );
}

export function DataLayerCardWithSync(props: {
  dataset: TimelineDataset;
  setLayerInfo: (data: LayerInfoModalData) => void;
}) {
  const { dataset, setLayerInfo } = props;

  const datasetAtom = useTimelineDatasetAtom(dataset.data.id);
  // const [something] = useTimelineDatasetVisibilityTest(dataset.data.id);

  const [isVisible, setVisible] = useTimelineDatasetVisibility(dataset.data.id);

  const [colorMap, setColorMap] = useTimelineDatasetColormap(datasetAtom);
  const [colorMapScale, setColorMapScale] =
    useTimelineDatasetColormapScale(datasetAtom);

  // const [, setModalLayerInfo] = useState<LayerInfoModalData>();

  const onClickLayerInfo = useCallback(() => {
    const data: LayerInfoModalData = {
      name: dataset.data.name,
      description: dataset.data.description,
      info: dataset.data.info,
      parentData: dataset.data.parentDataset
    };
    setLayerInfo(data);
  }, [dataset, setLayerInfo]);

  return (
    <DataLayerCard
      dataset={dataset}
      colorMap={colorMap}
      colorMapScale={colorMapScale}
      setColorMap={setColorMap}
      setColorMapScale={setColorMapScale}
      isVisible={isVisible}
      setVisible={setVisible}
      onClickLayerInfo={onClickLayerInfo}
    />
  );
}
