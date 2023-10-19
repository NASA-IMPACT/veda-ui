import React, { useState } from 'react';
import { Feature, Polygon } from 'geojson';
import { CollecticonUpload2 } from '@devseed-ui/collecticons';
import { Button, createButtonStyles } from '@devseed-ui/button';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';
import useThemedControl from '../hooks/use-themed-control';
import CustomAoIModal from '../custom-aoi-modal';

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

interface CustomAoIProps {
  onConfirm: (features: Feature<Polygon>[]) => void;
}

function CustomAoI({ onConfirm }: CustomAoIProps) {
  const [aoiModalRevealed, setAoIModalRevealed] = useState(false);
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

export default function CustomAoIControl(props: CustomAoIProps) {
  useThemedControl(() => <CustomAoI {...props} />, {
    position: 'top-left'
  });
  return null;
}
