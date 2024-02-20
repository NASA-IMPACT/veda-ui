import React from 'react';
import styled from 'styled-components';
import { PrimitiveAtom } from 'jotai';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { LayerLegendCategorical, LayerLegendGradient } from 'veda';
import {
  CollecticonCircleInformation,
} from '@devseed-ui/collecticons';
import { Toolbar } from '@devseed-ui/toolbar';
import { Heading } from '@devseed-ui/typography';
import LayerInfoModal, { LayerInfoModalData } from '../layer-info-modal';
import LayerMenuOptions from './layer-options-menu';
import { TipButton } from '$components/common/tip-button';
import {
  LayerCategoricalGraphic,
  LayerGradientGraphic
} from '$components/common/mapbox/layer-legend';

import { findDatasetAttribute } from '$components/exploration/data-utils';
import { TimelineDataset } from '$components/exploration/types.d.ts';
import ParentDatasetLink from '$components/exploration/components/parent-dataset-link';
interface CardProps {
  dataset: TimelineDataset;
  datasetAtom: PrimitiveAtom<TimelineDataset>;
  isVisible: boolean | undefined;
  setVisible: any;
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
  padding: ${glsp(0.5)} ${glsp(1)};
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
`;

const DatasetHeadline = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DatasetTitle = styled(Heading)`
  font-weight: bold;
  font-size: 0.875rem;
`;

const DatasetMetricInfo = styled.div`
  font-size: 0.75rem;
  color: ${themeVal('color.base-500')}
`;

export default function DataLayerCard(props: CardProps) {
  const { dataset, datasetAtom, isVisible, setVisible, datasetLegend } = props;
  const [revealInfo, setRevealInfo] = React.useState<LayerInfoModalData>();

  const onClickLayerInfo = () => {
    const parentInfoDesc = findDatasetAttribute({datasetId: dataset.data.parentDataset.id, attr: 'infoDescription'});
    const data: LayerInfoModalData = {
      name: dataset.data.name,
      info: dataset.data.info,
      parentData: {
        ...dataset.data.parentDataset,
        infoDescription: parentInfoDesc
      }
    };
    setRevealInfo(data);
  };

  return (
    <>
      <DatasetInfo className='dataset-info'>
        <DatasetCardInfo>
          <Header>
          <ParentDatasetLink parentDataset={dataset.data.parentDataset} size='small' />
          </Header>
          <DatasetHeadline>
            <DatasetTitle as='h3' size='xxsmall'>
              {dataset.data.name}
            </DatasetTitle>
            <Toolbar size='small'>
              <TipButton
                tipContent='Layer info'
                // Using a button instead of a toolbar button because the
                // latter doesn't support the `forwardedAs` prop.
                size='small'
                fitting='skinny'
                onClick={onClickLayerInfo}
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
            {/* { @TODO: This needs to be replaced with layer information */} 
            {/* { @TODO: This needs to be replaced but we need to figure out the data structure we would like to show here} */}
            <span>Hardcoded: TO BE REPLACED</span>
          </DatasetMetricInfo>
        </DatasetCardInfo>
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
      {revealInfo && (
        <LayerInfoModal
          revealed={!!revealInfo}
          close={() => setRevealInfo(undefined)}
          layerData={revealInfo}
        />
      )}
    </>
  );
}