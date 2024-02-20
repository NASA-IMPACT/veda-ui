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

import { LayerInfo } from 'veda';

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
  layerData: {
    name: string;
    info: LayerInfo;
    parentData: {
      id: string;
      infoDescription?: string;
    }
  }
}

export function LayerInfoLiner(props: { info: LayerInfo }) {
  const { info } = props;
  return (
    <span>
    {Object.keys(info).map((key, idx, arr) => {
      const currentValue = info[key];
      return idx !== arr.length - 1 ? (
        <span>{currentValue} · </span>
      ) : (
        <span>{currentValue} </span>
      );
    })}
    </span>
  );
}

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
            <Heading size='medium'>{layerData.name}</Heading>
            <p>
            <LayerInfoLiner info={layerData.info} />
            </p>
          </ModalHeadline>);
      }}
      content={
        <div dangerouslySetInnerHTML={{__html: parentData.infoDescription?? 'Layer Information unvailable.' }} />
      }
      footerContent={
        <ButtonStyleLink to={dataCatalogPage} onClick={close} variation='primary-fill' size='medium'>
          Learn more
        </ButtonStyleLink>
      }
    />
  );
}
