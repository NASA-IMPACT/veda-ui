import React from 'react';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import {
  CollecticonEye,
  CollecticonEyeDisabled
} from '@devseed-ui/collecticons';

interface LayerVisibilityToggleButtonProps {
  isDatasetLayerHidden: boolean;
  onLayerVisibilityClick: (a: boolean) => void;
  className?: string;
}

function LayerVisibilityToggleButtonSelf(
  props: LayerVisibilityToggleButtonProps
) {
  const { className, isDatasetLayerHidden, onLayerVisibilityClick } = props;

  return (
    <Button
      type='button'
      className={className}
      variation={isDatasetLayerHidden ? 'danger-fill' : 'primary-fill'}
      fitting='skinny'
      onClick={() => onLayerVisibilityClick(!isDatasetLayerHidden)}
    >
      {!isDatasetLayerHidden && (
        <CollecticonEye meaningful title='Turn off data layer visibility' />
      )}
      {isDatasetLayerHidden && (
        <CollecticonEyeDisabled
          meaningful
          title='Turn on data layer visibility'
        />
      )}
    </Button>
  );
}

const LayerVisibilityToggleButton = styled(LayerVisibilityToggleButtonSelf)`
  /* Convert to styled-component: https://styled-components.com/docs/advanced#caveat */
`;

export default LayerVisibilityToggleButton;
