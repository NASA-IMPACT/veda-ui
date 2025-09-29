import React from 'react';
import { Icon } from '@trussworks/react-uswds';
import MapMessage from '$components/common/map/map-message';

interface MapErrorMessageProps {
  /** Unique identifier for the error message */
  id: string;
  /** Whether the error message is currently active/visible */
  active: boolean;
}

/**
 * Map error message component with USWDS icon.
 * Displays an error message when map data fails to load.
 *
 * @param props - Component props
 * @returns JSX element
 */
export default function MapErrorMessage(props: MapErrorMessageProps) {
  const { id, active } = props;

  return (
    <MapMessage id={id} active={active} isInvalid>
      <Icon.HighlightOff size={4} /> There was a problem loading the map data.
      Refresh the page and try again.
    </MapMessage>
  );
}
