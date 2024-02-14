import React from 'react';
import styled from 'styled-components';

import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeadline
} from '@devseed-ui/modal';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { createButtonStyles } from '@devseed-ui/button';
import { Heading } from '@devseed-ui/typography';

import { DatasetLayer } from 'veda';
import { findParentDataset } from '../data-utils';

import SmartLink from '$components/common/smart-link';
import { getDatasetPath } from '$utils/routes';

const DatasetModal = styled(Modal)`
  z-index: ${themeVal('zIndices.modal')};
  /* Override ModalContents */
  > div {
    display: flex;
    flex-flow: column;
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


const ButtonStyleLink = styled(SmartLink)<any>`
  &&& {
    ${({ variation, size }) => createButtonStyles({ variation, size })}
  }
`;

interface LayerInfoModalProps {
  revealed: boolean;
  close: () => void;
  datasetLayer: DatasetLayer;
}

export default function LayerInfoModal(props: LayerInfoModalProps) {
  const { revealed, close, datasetLayer } = props;
  const parent = findParentDataset(datasetLayer.id);
  const dataCatalogPage = parent? getDatasetPath(parent) : '/';
  return (
    <DatasetModal
      id='modal'
      size='xlarge'
      revealed={revealed}
      onCloseClick={close}
      renderHeadline={() => {
        return (
          <ModalHeadline>
            <Heading size='medium'>{datasetLayer.name}</Heading>
            <p dangerouslySetInnerHTML={{__html: datasetLayer.info?.modal.subtitle?? '' }} />
          </ModalHeadline>);
      }}
      content={
        <div dangerouslySetInnerHTML={{__html: datasetLayer.info?.modal.contents?? 'Layer Information unvailable.' }} />
      }
      footerContent={
        <ButtonStyleLink to={dataCatalogPage} variation='primary-fill' size='medium'>
          Learn more
        </ButtonStyleLink>
      }
    />
  );
}
