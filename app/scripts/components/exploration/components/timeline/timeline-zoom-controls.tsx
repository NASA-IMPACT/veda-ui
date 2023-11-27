import React from 'react';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import styled from 'styled-components';
import { useAtomValue } from 'jotai';

import { clamp } from './timeline-utils';

import { CollecticonMagnifierMinus } from '$components/common/icons/magnifier-minus';
import { CollecticonMagnifierPlus } from '$components/common/icons/magnifier-plus';
import { TipButton } from '$components/common/tip-button';
import { SliderInput } from '$styles/range-slider';
import { zoomTransformAtom } from '$components/exploration/atoms/timeline';
import { useScaleFactors } from '$components/exploration/hooks/scales-hooks';

const TimelineControlsSelf = styled.div`
  display: flex;
  gap: ${glsp(0.5)};
  align-items: center;
  min-width: 10rem;
`;

const TipContent = styled.div`
  text-align: center;
`;

const ShortcutCode = styled.code`
  background: ${themeVal('color.surface-200a')};
  font-size: 0.75rem;
  padding: 0 0.25rem;
  border-radius: ${themeVal('shape.rounded')};
`;

interface TimelineZoomControlsProps {
  onZoom: (zoom: number) => void;
}

export function TimelineZoomControls(props: TimelineZoomControlsProps) {
  const { onZoom } = props;
  const { k } = useAtomValue(zoomTransformAtom);
  const { k0, k1 } = useScaleFactors();

  const currentZoom = Math.round((k / (k1 - k0)) * 100);

  const handleZoomIn = () => {
    // Buttons increase/decrease zoom by 5%.
    const newPercentage = clamp(currentZoom + 5, 0, 100);
    const zoom = (k1 - k0) * (newPercentage / 100) + k0;
    onZoom(zoom);
  };

  const handleZoomOut = () => {
    // Buttons increase/decrease zoom by 5%.
    const newPercentage = clamp(currentZoom - 5, 0, 100);
    const zoom = (k1 - k0) * (newPercentage / 100) + k0;
    onZoom(zoom);
  };

  const handleZoom = (value) => {
    const zoom = (k1 - k0) * (value / 100) + k0;
    onZoom(zoom);
  };

  return (
    <TimelineControlsSelf>
      <TipButton
        tipContent={
          <TipContent>
            Zoom out timeline
            <br />
            <ShortcutCode>alt + scroll down</ShortcutCode>
          </TipContent>
        }
        fitting='skinny'
        onClick={handleZoomOut}
        visuallyDisabled={currentZoom <= 0}
      >
        <CollecticonMagnifierMinus meaningful title='Zoom out timeline' />
      </TipButton>
      <SliderInput
        min={0}
        max={100}
        step={1}
        onInput={handleZoom}
        value={currentZoom}
      />
      <TipButton
        tipContent={
          <TipContent>
            Zoom in timeline
            <br />
            <ShortcutCode>alt + scroll up</ShortcutCode>
          </TipContent>
        }
        fitting='skinny'
        onClick={handleZoomIn}
        visuallyDisabled={currentZoom >= 100}
      >
        <CollecticonMagnifierPlus meaningful title='Zoom in timeline' />
      </TipButton>
    </TimelineControlsSelf>
  );
}
