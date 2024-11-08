import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faRobot} from  '@fortawesome/free-solid-svg-icons';

import useMaps from '$components/common/map/hooks/use-maps';
import { SelectorButton } from '$components/common/map/style/button';
import useThemedControl from '$components/common/map/controls/hooks/use-themed-control';

interface GeoCoPilotControlProps {
  showGeoCoPilot: () => void;
  setMap: (any) => void;
}

export function GeoCoPilotComponent({onClick}: {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <SelectorButton
      tipContent='Chat with Geo-Copilot'
      tipProps={{ placement: 'left' }}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faRobot} />
    </SelectorButton>
  );
}

export function GeoCoPilotControl(props: GeoCoPilotControlProps) {
  const {showGeoCoPilot, setMap} = props;
  // Show conversation modal
  const {main} = useMaps();
  setMap(main);

  useThemedControl(() => <GeoCoPilotComponent onClick={showGeoCoPilot} />, {
    position: 'top-right'
  });
  return null;
}
