import React from 'react';

import { Button } from '@devseed-ui/button';
import { pluralize } from '$utils/pluralize';

interface ModalFooterComponentProps {
  selectedIds: string[]; 
  onConfirm: () => void; 
  isFirstSelection: boolean;
}

export default function ModalFooterRender (props:ModalFooterComponentProps) {
  const { selectedIds, onConfirm, isFirstSelection } = props;
  return (
    <>
      <p aria-live='polite' className='selection-info'>
        {selectedIds.length
          ? `${selectedIds.length} ${pluralize({ singular: 'layer', plural: 'layers', count: selectedIds.length})} selected`
          : 'No data layers selected'}
      </p>
      {!isFirstSelection && (
        <Button variation='base-text' onClick={close}>
          Cancel
        </Button>
      )}
      <Button
        variation='primary-fill'
        disabled={!selectedIds.length}
        onClick={onConfirm}
      >
        Add to map
      </Button>
    </>
  );

}