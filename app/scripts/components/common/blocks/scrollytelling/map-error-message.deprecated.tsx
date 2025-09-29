import React from 'react';
import { CollecticonCircleXmark } from '@devseed-ui/collecticons';
import MapMessage from '$components/common/map/map-message';

interface MapErrorMessageProps {
  id: string;
  active: boolean;
}

/**
 * @deprecated This component uses Collecticons and is being migrated to USWDS icons.
 * Use the main MapErrorMessage component instead.
 */
export default function MapErrorMessageDeprecated(props: MapErrorMessageProps) {
  const { id, active } = props;

  return (
    <MapMessage id={id} active={active} isInvalid>
      <CollecticonCircleXmark size='large' /> There was a problem loading the
      map data. Refresh the page and try again.
    </MapMessage>
  );
}
