import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { PrimitiveAtom } from 'jotai';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { LayerLegendCategorical, LayerLegendGradient } from 'veda';
import {
  CollecticonCircleInformation,
  CollecticonEyeDisabled,
  CollecticonEye,
  CollecticonChevronDownSmall
} from '@devseed-ui/collecticons';
import { Toolbar } from '@devseed-ui/toolbar';
import { Heading } from '@devseed-ui/typography';
import Tippy from '@tippyjs/react';
import { LayerInfoLiner } from '../layer-info-modal';
import LayerMenuOptions from './layer-options-menu';
import { ColormapOptions } from './colormap-options';
import { TipButton } from '$components/common/tip-button';
import {
  LayerCategoricalGraphic,
  LayerGradientGraphic
} from '$components/common/map/layer-legend';

import { TimelineDataset } from '$components/exploration/types.d.ts';
import { CollecticonDatasetLayers } from '$components/common/icons/dataset-layers';
import { ParentDatasetTitle } from '$components/common/catalog/catalog-content';

import 'tippy.js/dist/tippy.css';

interface CardProps {
  dataset: TimelineDataset;
  datasetAtom: PrimitiveAtom<TimelineDataset>;
  isVisible: boolean | undefined;
  setVisible: any;
  colorMap: string;
  setColorMap: any;
  onClickLayerInfo: () => void;
  datasetLegend: LayerLegendCategorical | LayerLegendGradient | undefined;
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

const LegendWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0 0 8px;
  border-radius: 4px;
  border: 1px solid #e5e5e5;
  margin: 8px 0;
`;

const LegendColorMapTrigger = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 46px;
  background-color: #f4f4f4;
  padding: 4px;
  min-width: 30px;
  margin-left: 8px;
  cursor: pointer;
`;

export default function DataLayerCard(props: CardProps) {
  const {
    dataset,
    datasetAtom,
    isVisible,
    setVisible,
    colorMap,
    setColorMap,
    datasetLegend,
    onClickLayerInfo
  } = props;
  const layerInfo = dataset.data.info;
  const [min, max] = dataset.data.sourceParams?.rescale || [0, 1];
  const isColorMapCategorical = 'colormap' in (dataset.data.sourceParams ?? {});
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

  return (
    <>
      <DatasetInfo className={isVisible ? 'layerShown' : 'layerHidden'}>
        <DatasetCardInfo>
          <Header>
            <ParentDatasetTitle size='small'>
              <CollecticonDatasetLayers />{' '}
              <p>{dataset.data.parentDataset.name}</p>
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
                <CollecticonCircleInformation meaningful title='View dataset page' />
              </TipButton>
              <TipButton
                tipContent={isVisible ? 'Hide layer' : 'Show layer'}
                size='small'
                fitting='skinny'
                onPointerDownCapture={(e) => e.stopPropagation()}
                onClick={() => setVisible((v) => !v)}
              >
                {isVisible ? (
                  <CollecticonEye meaningful title='Toggle dataset visibility' />
                ) : (
                  <CollecticonEyeDisabled meaningful title='Toggle dataset visibility' />
                )}
              </TipButton>
              <LayerMenuOptions datasetAtom={datasetAtom} />
            </DatasetToolbar>
          </DatasetHeadline>

          <DatasetMetricInfo>
            {layerInfo && <LayerInfoLiner info={layerInfo} />}
          </DatasetMetricInfo>
        </DatasetCardInfo>
        {isColorMapCategorical && datasetLegend?.type === 'categorical' && (
          <LayerCategoricalGraphic type='categorical' stops={datasetLegend.stops} />
        )}
        {!isColorMapCategorical && (
          <LegendWrapper ref={triggerRef}>
            <LayerGradientGraphic
              type='gradient'
              min={min}
              max={max}
              colorMap={colorMap}
            />
            <Tippy
              className='color-map-options'
              content={
                <ColormapOptions
                  colorMap={colorMap}
                  setColorMap={setColorMap}
                  min={min}
                  max={max}
                />
              }
              appendTo={() => document.body}
              visible={isColorMapOpen}
              interactive={true}
              placement='top'
              onClickOutside={(_, event) => handleClickOutside(event)}
            >
              <LegendColorMapTrigger onClick={handleColorMapTriggerClick}>
                <CollecticonChevronDownSmall />
              </LegendColorMapTrigger>
            </Tippy>
          </LegendWrapper>
        )}
      </DatasetInfo>
    </>
  );
}
