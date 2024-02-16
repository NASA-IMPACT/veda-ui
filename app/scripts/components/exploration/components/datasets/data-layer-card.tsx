import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { PrimitiveAtom } from 'jotai';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { DatasetData, LayerLegendCategorical, LayerLegendGradient } from 'veda';
import {
  CollecticonCircleInformation,
} from '@devseed-ui/collecticons';
import { Toolbar } from '@devseed-ui/toolbar';
import { Button } from '@devseed-ui/button';
import { Heading } from '@devseed-ui/typography';
import LayerMenuOptions from './layer-options-menu';
import { CollecticonDatasetLayers } from '$components/common/icons/dataset-layers';
import { TipButton } from '$components/common/tip-button';
import { getDatasetPath } from '$utils/routes';
import {
  LayerCategoricalGraphic,
  LayerGradientGraphic
} from '$components/common/mapbox/layer-legend';
import { TimelineDataset } from '$components/exploration/types.d.ts';

interface CardProps {
  dataset: TimelineDataset;
  datasetAtom: PrimitiveAtom<TimelineDataset>;
  isVisible: boolean | undefined;
  setVisible: any;
  datasetLegend: LayerLegendCategorical | LayerLegendGradient | undefined;
  parent: DatasetData | undefined;
}

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

const DatasetInfo = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column;
  gap: 0.5rem;
  background-color: ${themeVal('color.surface')};
  padding: ${glsp(0.5)};
  border-radius: ${themeVal('shape.rounded')};
  border: 1px solid ${themeVal('color.base-200')};

  &:hover {
    outline: 2px solid ${themeVal('color.primary-500')};
    cursor: grab;
  }
  &:active {
    outline: none;
    cursor: grabbing;
    transform: rotate(2deg);
    filter: drop-shadow(0 0.2rem 0.25rem rgba(0, 0, 0, 0.2));
  }
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

const DatasetHeadline = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${glsp()};
`;

const DatasetTitle = styled(Heading)`
  font-weight: 600;
  font-size: 14px;
`;

const DatasetMetricInfo = styled.div`
  font-size: 0.75rem;
  color: ${themeVal('color.base-500')}
`;

export default function DataLayerCard(props: CardProps) {
  const {dataset, datasetAtom, isVisible, setVisible, datasetLegend, parent} = props;

  return (
    <DatasetInfo className='dataset-info'>
      <Header>
        <ParentDatasetButton variation='base-text' size='small' fitting='skinny'>
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
            tipContent='Layer info'
            // Using a button instead of a toolbar button because the
            // latter doesn't support the `forwardedAs` prop.
            size='small'
            fitting='skinny'
            to={getDatasetPath(parent!)}
          >
            <CollecticonCircleInformation
              meaningful
              title='View dataset page'
            />
          </TipButton>
          <LayerMenuOptions datasetAtom={datasetAtom} isVisible={!!isVisible} setVisible={setVisible} />
        </Toolbar>
      </DatasetHeadline>
      <DatasetMetricInfo>
        {/* { @TODO: This needs to be replaced but we need to figure out the data structure we would like to show here} */}
        <span>Hardcoded: TO BE REPLACED</span>
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
          min={datasetLegend.min}
          max={datasetLegend.max}
        />
      )}

    </DatasetInfo>
  );
}