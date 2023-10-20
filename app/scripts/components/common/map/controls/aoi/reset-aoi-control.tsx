import React, { useCallback } from 'react';
import { CollecticonArrowLoop } from '@devseed-ui/collecticons';
import { Button, createButtonStyles } from '@devseed-ui/button';
import styled from 'styled-components';
import { useSetAtom } from 'jotai';
import { themeVal } from '@devseed-ui/theme-provider';
import useThemedControl from '../hooks/use-themed-control';
import useMaps from '../../hooks/use-maps';
import { aoiDeleteAllAtom } from './atoms';

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
  const aoiDeleteAll = useSetAtom(aoiDeleteAllAtom)
  const onReset = useCallback(() => {
    const mbDraw = map?._drawControl;
    if (!mbDraw) return;
    mbDraw.deleteAll();
    aoiDeleteAll();
  }, [map, aoiDeleteAll]);

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
