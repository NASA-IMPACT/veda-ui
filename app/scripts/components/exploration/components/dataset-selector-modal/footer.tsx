import React from 'react';
import styled from 'styled-components';

import { themeVal, glsp } from '@devseed-ui/theme-provider';

import { Button } from '@devseed-ui/button';
import { pluralize } from '$utils/pluralize';

interface ModalFooterComponentProps {
  selectedDatasetsCount: number;
  onConfirm: () => void;
  close: () => void;
}
const LayerNumberHighlight = styled.div`
  border-radius: 100%;
  background-color: ${themeVal('color.primary')};
  color: ${themeVal('color.surface')};
  font-weight: bold;
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-content: center;
`;

const LayerResult = styled.div`
  display: flex;
  gap: ${glsp(0.5)};
`;

export default function ModalFooterRender (props:ModalFooterComponentProps) {
  const { selectedDatasetsCount, close, onConfirm } = props;

  return (
    <>
      <LayerResult aria-live='polite' className='selection-info'>
        {selectedDatasetsCount
          ? <><LayerNumberHighlight>{selectedDatasetsCount} </LayerNumberHighlight> <div>{pluralize({ singular: 'layer', plural: 'layers', count: selectedDatasetsCount})} selected</div></>
          : 'No data layers selected'}
      </LayerResult>
        <Button variation='base-text' onClick={close}>
          Cancel
        </Button>
      <Button
        variation='primary-fill'
        disabled={!selectedDatasetsCount}
        onClick={onConfirm}
      >
        Add to map
      </Button>
    </>
  );

}