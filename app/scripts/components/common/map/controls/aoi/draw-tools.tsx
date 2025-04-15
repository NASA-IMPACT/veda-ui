import React from 'react';
import { CollecticonTick, CollecticonXmark } from '@devseed-ui/collecticons';
import { USWDSButton, USWDSButtonGroup } from '$uswds';

export const DrawTools = ({
  drawingActions,
  drawingIsValid
}: {
  drawingActions: {
    confirm(): void;
    cancel(): void;
    start(): void;
    toggle(): void;
  };
  drawingIsValid: boolean;
}) => (
  <USWDSButtonGroup className='margin-neg-05 margin-right-0'>
    <USWDSButton
      onClick={drawingActions.confirm}
      type='button'
      inverse
      disabled={!drawingIsValid}
      size='small'
      className='padding-top-05 padding-right-105 padding-bottom-05 padding-left-105'
    >
      <CollecticonTick aria-hidden='true' />
      Confirm Area
    </USWDSButton>
    <USWDSButton
      onClick={drawingActions.cancel}
      type='button'
      base
      size='small'
      className='padding-top-05 padding-right-105 padding-bottom-05 padding-left-105'
    >
      <CollecticonXmark aria-hidden='true' />
      Cancel
    </USWDSButton>
  </USWDSButtonGroup>
);
