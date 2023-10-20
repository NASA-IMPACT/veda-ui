import React, { useCallback } from 'react';
import { CollecticonArrowLoop } from '@devseed-ui/collecticons';
import { Button, createButtonStyles } from '@devseed-ui/button';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';
import useThemedControl from '../hooks/use-themed-control';
import useMaps from '../../hooks/use-maps';

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

function ResetAoI({ map }: { map: any }) {
  const onReset = useCallback(() => {
    const mbDraw = map?.instance?._drawControl;
    if (!mbDraw) return;
    mbDraw.trash();
  }, [map]);

  return (
    <>
      <SelectorButton onClick={onReset}>
        <CollecticonArrowLoop title='Upload geoJSON' meaningful />
      </SelectorButton>
    </>
  );
}

export default function ResetAoIControl() {
  const { main } = useMaps();
  useThemedControl(
    () => {
      return <ResetAoI map={main} />;
    },
    {
      position: 'top-left'
    }
  );
  return null;
}
