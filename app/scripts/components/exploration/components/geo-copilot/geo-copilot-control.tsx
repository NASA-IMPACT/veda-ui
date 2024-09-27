import React from 'react';
import { CollecticonCode } from '@devseed-ui/collecticons';
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
      <CollecticonCode />
    </SelectorButton>
  );
}

export function GeoCoPilotControl(props: GeoCoPilotControlProps) {
  const {showGeoCoPilot, setMap} = props;
  const disabled = false;
  // Show conversation modal
  const {main} = useMaps();
  setMap(main);

  useThemedControl(() => <GeoCoPilotComponent onClick={showGeoCoPilot}/>, {
    position: 'top-right'
  });
  return null;
}
