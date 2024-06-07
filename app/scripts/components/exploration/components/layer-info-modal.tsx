import React from 'react';
import styled from 'styled-components';

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalHeadline
} from '@devseed-ui/modal';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { createButtonStyles } from '@devseed-ui/button';
import { LayerInfo } from 'veda';

import SmartLink from '$components/common/smart-link';
import { getDatasetPath } from '$utils/routes';
import { CollecticonDatasetLayers } from '$components/common/icons/dataset-layers';
import { ParentDatasetTitle } from '$components/common/catalog/catalog-content';

const DatasetModal = styled(Modal)`
  z-index: ${themeVal('zIndices.modal')};
  /* Override ModalContents */
  > div {
    display: flex;
    flex-flow: column;
  }
  ${ModalHeader} {
    align-items: start;
  }
  ${ModalHeadline} {
    align-items: flex-start;
    justify-content: flex-start;
  }

  ${ModalBody} {
    height: 100%;
    min-height: 0;
    display: flex;
    flex-flow: column;
    gap: ${glsp(1)};
  }

  ${ModalFooter} {
    display: flex;
    gap: ${glsp(1)};
    align-items: center;
    position: sticky;
    bottom: ${glsp(-2)};
    z-index: 100;
  }
`;

const ParentDatasetHeading = styled.h2`
  padding: ${glsp(0.5)} 0;
`;

const ButtonStyleLink = styled(SmartLink)<any>`
  &&& {
    ${({ variation, size }) => createButtonStyles({ variation, size })}
  }
`;

export interface LayerInfoModalData {
  name: string;
  info?: LayerInfo;
  description: string;
  parentData: {
    id: string;
    name: string;
    infoDescription?: string;
  }
}

interface LayerInfoModalProps {
  revealed: boolean;
  close: () => void;
  layerData: LayerInfoModalData
}

export function LayerInfoLiner(props: { info: LayerInfo }) {
  const { info } = props;
  return (
    <span>
    {Object.keys(info).map((key, idx, arr) => {
      const currentValue = info[key];
      return idx !== arr.length - 1 ? (
        <span key={key}>{currentValue} · </span>
        ) : (
        <span key={key}>{currentValue} </span>
      );
    })}
    </span>
  );
}

const LayerInfoLinerModal = styled.div`
  color: ${themeVal('color.base-500')};
  font-size: 0.875rem;
  margin-bottom: ${glsp(0.5)};
`;

export default function LayerInfoModal(props: LayerInfoModalProps) {
  const { revealed, close, layerData } = props;
  const { parentData } = layerData;
  const dataCatalogPage = getDatasetPath(parentData.id);
  return (
    <DatasetModal
      id='modal'
      size='xlarge'
      revealed={revealed}
      onCloseClick={close}
      renderHeadline={() => {
        return (
          <ModalHeadline>
            <ParentDatasetTitle>
              <CollecticonDatasetLayers /> {layerData.parentData.name}
            </ParentDatasetTitle>
            <ParentDatasetHeading> {layerData.name} </ParentDatasetHeading>
            <p>
              {
                layerData.info && (
                  <LayerInfoLinerModal>
                    <LayerInfoLiner info={layerData.info} />
                  </LayerInfoLinerModal>
                )
              }
            </p>
            <p>{layerData.description}</p>
          </ModalHeadline>);
      }}
      content={
        <div dangerouslySetInnerHTML={{__html: parentData.infoDescription?? 'Currently, we are unable to display the layer information, but you can find it in the data catalog.' }} />
      }
      footerContent={
        <ButtonStyleLink to={dataCatalogPage} onClick={close} variation='primary-fill' size='medium' target='_blank'>
          Open in Data Catalog
        </ButtonStyleLink>
      }
    />
  );
}
