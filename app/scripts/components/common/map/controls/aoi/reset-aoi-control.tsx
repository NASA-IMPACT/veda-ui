import React, { useCallback } from 'react';
import { CollecticonArrowLoop } from '@devseed-ui/collecticons';
import { Button } from '@devseed-ui/button';
import styled from 'styled-components';
import { useAtomValue, useSetAtom } from 'jotai';
import { themeVal } from '@devseed-ui/theme-provider';
import useThemedControl from '../hooks/use-themed-control';
import useMaps from '../../hooks/use-maps';
import { aoiDeleteAllAtom, aoisFeaturesAtom } from './atoms';

const SelectorButton = styled(Button)`
  &&& {
    background-color: ${themeVal('color.surface')};

    &:hover {
      background-color: ${themeVal('color.surface')};
    }
  }
`;

function ResetAoI({ map }: { map: any }) {
  const aoiDeleteAll = useSetAtom(aoiDeleteAllAtom);
  const aoisFeatures = useAtomValue(aoisFeaturesAtom);

  const onReset = useCallback(() => {
    const mbDraw = map?._drawControl;
    if (!mbDraw) return;
    mbDraw.deleteAll();
    aoiDeleteAll();
  }, [map, aoiDeleteAll]);

  return (
    <>
      <SelectorButton
        fitting='skinny'
        variation='primary-fill'
        onClick={onReset}
        disabled={!aoisFeatures.length}
      >
        <CollecticonArrowLoop color='base' title='Upload geoJSON' meaningful />
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
