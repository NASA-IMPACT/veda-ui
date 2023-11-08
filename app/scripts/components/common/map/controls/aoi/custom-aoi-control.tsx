import React, { useState } from 'react';
import { Feature, Polygon } from 'geojson';
import { CollecticonUpload2 } from '@devseed-ui/collecticons';
import { Button, createButtonStyles } from '@devseed-ui/button';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';

import useMaps from '../../hooks/use-maps';
import useAois from '../hooks/use-aois';
import useThemedControl from '../hooks/use-themed-control';
import CustomAoIModal from './custom-aoi-modal';

const SelectorButton = styled(Button)`
  &&& {
    ${createButtonStyles({ variation: 'primary-fill', fitting: 'skinny' })}
    background-color: ${themeVal('color.surface')};
    &:hover {
      background-color: ${themeVal('color.surface')};
    }
    & path {
      fill: ${themeVal('color.base')};
    }
  }
`;

function CustomAoI({ map }: { map: any }) {
  const [aoiModalRevealed, setAoIModalRevealed] = useState(false);

  const { onUpdate } = useAois();

  const onConfirm = (features: Feature<Polygon>[]) => {
    const mbDraw = map?._drawControl;
    setAoIModalRevealed(false);
    if (!mbDraw) return;
    onUpdate({ features });
    mbDraw.add({
      type: 'FeatureCollection',
      features
    });
  };
  return (
    <>
      <SelectorButton onClick={() => setAoIModalRevealed(true)}>
        <CollecticonUpload2 title='Upload geoJSON' meaningful />
      </SelectorButton>
      <CustomAoIModal
        revealed={aoiModalRevealed}
        onConfirm={onConfirm}
        onCloseClick={() => setAoIModalRevealed(false)}
      />
    </>
  );
}

export default function CustomAoIControl() {
  const { main } = useMaps();
  useThemedControl(() => <CustomAoI map={main} />, {
    position: 'top-left'
  });
  return null;
}
