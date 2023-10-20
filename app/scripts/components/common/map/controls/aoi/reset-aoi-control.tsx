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

function ResetAoI() {
  // This doesn't work as this Context is not reachable frome here :()
  const { main } = useMaps();

  const onReset = useCallback(() => {
    const mbDraw = (main as any)?.instance?._drawControl;
    if (!mbDraw) return;
    mbDraw.trash();
  }, [main]);

  return (
    <>
      <SelectorButton onClick={onReset}>
        <CollecticonArrowLoop title='Upload geoJSON' meaningful />
      </SelectorButton>
    </>
  );
}

export default function ResetAoIControl() {
  useThemedControl(
    () => {
      return <ResetAoI />;
    },
    {
      position: 'top-left'
    }
  );
  return null;
}
