import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import {
  CollecticonCircleInformation,
  CollecticonEyeDisabled,
  CollecticonEye,
  CollecticonChevronDown,
  CollecticonChevronUp
} from '@devseed-ui/collecticons';
import { Toolbar } from '@devseed-ui/toolbar';
import { Heading } from '@devseed-ui/typography';
import { ColormapSection } from './colormap-section';
import LayerInfoModal, {
  LayerInfoModalData
} from '$components/exploration/components/layer-info-modal';
import { LayerInfoLiner } from '$components/exploration/components/layer-info-modal';
import LayerMenuOptions from '$components/common/dataset-layer-card/layer-options-menu';
import { TipButton } from '$components/common/tip-button';

import {
  TimelineDataset,
  colorMapScale
} from '$components/exploration/types.d.ts';
import { DatasetData } from '$types/veda';
import { CollecticonDatasetLayers } from '$components/common/icons-legacy/dataset-layers';
import { ParentDatasetTitle } from '$components/common/catalog/catalog-legacy/catalog-content';

import 'tippy.js/dist/tippy.css';

interface PresentationalProps {
  dataset: TimelineDataset;
  isVisible: boolean | undefined;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  colorMap: string | undefined;
  setColorMap: React.Dispatch<React.SetStateAction<string>>;
  colorMapScale: colorMapScale | undefined;
  setColorMapScale: React.Dispatch<React.SetStateAction<colorMapScale>>;
  parentDataset: DatasetData | undefined;
  onRemoveLayer: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  opacity: number;
  onOpacityChange: React.Dispatch<React.SetStateAction<number>>;
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

  const [modalLayerInfo, setModalLayerInfo] = useState<LayerInfoModalData>();
  const layerInfo = dataset.data.info;
  const datasetLegend = dataset.data.legend;

  const onClickLayerInfo = useCallback(() => {
    const data: LayerInfoModalData = {
      name: dataset.data.name,
      description: dataset.data.description,
      info: dataset.data.info,
      parentData: dataset.data.parentDataset
    };
    setModalLayerInfo(data);
  }, [dataset]);

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

          <DatasetMetricInfo>
            {layerInfo && <LayerInfoLiner info={layerInfo} />}
          </DatasetMetricInfo>
        </DatasetCardInfo>

        <ColormapSection
          dataset={dataset}
          colorMap={colorMap}
          setColorMap={setColorMap}
          colorMapScale={colorMapScale}
          setColorMapScale={setColorMapScale}
          isCategoricalLegendExpanded={isChevToggleExpanded}
        />
        {modalLayerInfo && (
          <LayerInfoModal
            revealed={!!modalLayerInfo}
            close={() => setModalLayerInfo(undefined)}
            layerData={modalLayerInfo}
            footerContent={footerContent}
          />
        )}
      </DatasetInfo>
    </>
  );
}
