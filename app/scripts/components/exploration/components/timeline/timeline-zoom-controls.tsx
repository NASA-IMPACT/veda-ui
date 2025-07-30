import React from 'react';
import { glsp } from '@devseed-ui/theme-provider';
import styled from 'styled-components';
import { useAtomValue } from 'jotai';
import { scaleLog } from 'd3';

import { clamp } from './timeline-utils';

import { CollecticonMagnifierMinus } from '$components/common/icons-legacy/magnifier-minus';
import { CollecticonMagnifierPlus } from '$components/common/icons-legacy/magnifier-plus';
import { TipButton } from '$components/common/tip-button';
import { SliderInput } from '$styles/range-slider';
import {
  timelineSizesAtom,
  zoomTransformAtom
} from '$components/exploration/atoms/timeline';
import { useScaleFactors } from '$components/exploration/hooks/scales-hooks';
import { ShortcutCode } from '$styles/shortcut-code';

const TimelineControlsSelf = styled.div`
  display: flex;
  gap: ${glsp(0.5)};
  align-items: center;
  min-width: 10rem;
`;

const TipContent = styled.div`
  text-align: center;
`;

interface TimelineZoomControlsProps {
  onZoom: (zoom: number) => void;
}

export function TimelineZoomControls(props: TimelineZoomControlsProps) {
  const { onZoom } = props;
  const { k } = useAtomValue(zoomTransformAtom);
  const { k0, k1 } = useScaleFactors();
  const { contentWidth } = useAtomValue(timelineSizesAtom);

  const zoomScale = scaleLog().base(2).domain([k0, k1]).range([0, 100]);
  const currentZoom = zoomScale(k);

  const handleZoomIn = () => {
    const unscaledWidth = contentWidth * k;
    // On each zoom halve the domain.
    const scalar = contentWidth / 2;

    const newRatio = unscaledWidth / scalar;
    onZoom(clamp(newRatio, k0, k1));
  };

  const handleZoomOut = () => {
    const unscaledWidth = Math.max(contentWidth, contentWidth * k);
    // On each zoom duplicate the domain.
    const scalar = contentWidth * 2;

    const newRatio = unscaledWidth / scalar;
    onZoom(clamp(newRatio, k0, k1));
  };

  const handleZoom = (value) => {
    const zoom = zoomScale.invert(value);
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
        value={isNaN(currentZoom) ? 0 : currentZoom}
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
