import React, { useCallback, useEffect, useState } from 'react';
import { Feature, Polygon } from 'geojson';
import styled from 'styled-components';
import { useSetAtom } from 'jotai';
import bbox from '@turf/bbox';
import {
  CollecticonPencil,
  CollecticonTrashBin,
  CollecticonUpload2
} from '@devseed-ui/collecticons';
import { Toolbar, ToolbarLabel, VerticalDivider } from '@devseed-ui/toolbar';
import { themeVal, glsp } from '@devseed-ui/theme-provider';

import useMaps from '../../hooks/use-maps';
import useAois from '../hooks/use-aois';
import useThemedControl from '../hooks/use-themed-control';
import CustomAoIModal from './custom-aoi-modal';
import { aoiDeleteAllAtom } from './atoms';

import { TipToolbarIconButton } from '$components/common/tip-button';

const AnalysisToolbar = styled(Toolbar)`
  background-color: ${themeVal('color.surface')};
  border-radius: ${themeVal('shape.rounded')};
  padding: ${glsp(0, 0.5)};
  box-shadow: ${themeVal('boxShadow.elevationC')};
`;

function CustomAoI({ map }: { map: any }) {
  const [aoiModalRevealed, setAoIModalRevealed] = useState(false);

  const { onUpdate, isDrawing, setIsDrawing, features } = useAois();
  const aoiDeleteAll = useSetAtom(aoiDeleteAllAtom);

  const onConfirm = (features: Feature<Polygon>[]) => {
    const mbDraw = map?._drawControl;
    setAoIModalRevealed(false);
    if (!mbDraw) return;
    onUpdate({ features });
    const fc = {
      type: 'FeatureCollection',
      features
    };
    map.fitBounds(bbox(fc), { padding: 20 });
    mbDraw.add(fc);
  };

  const onTrashClick = useCallback(() => {
    // We need to programmatically access the mapbox draw trash method which
    // will do different things depending on the selected mode.
    const mbDraw = map?._drawControl;
    if (!mbDraw) return;

    // This is a peculiar situation:
    // If we are in direct select (to select/add vertices) but not vertex is
    // selected, the trash method doesn't do anything. So, in this case, we
    // trigger the delete for the whole feature.
    const selectedFeatures = mbDraw.getSelected().features;
    if (
      mbDraw.getMode() === 'direct_select' &&
      selectedFeatures.length &&
      !mbDraw.getSelectedPoints().features.length
    ) {
      // Change mode so that the trash action works.
      mbDraw.changeMode('simple_select', {
        featureIds: selectedFeatures.map((f) => f.id)
      });
    }

    // If nothing selected, delete all.
    if (features.every((f) => !f.selected)) {
      mbDraw.deleteAll();
      // The delete all method does not trigger the delete event, so we need to
      // manually delete all the feature from the atom.
      aoiDeleteAll();
      return;
    }
    mbDraw.trash();
  }, [features, aoiDeleteAll, map]);

  return (
    <>
      <AnalysisToolbar>
        <ToolbarLabel>Analysis tools</ToolbarLabel>
        <TipToolbarIconButton
          tipContent='Draw an area of interest'
          tipProps={{ placement: 'bottom' }}
          active={isDrawing}
          onClick={() => setIsDrawing(!isDrawing)}
        >
          <CollecticonPencil meaningful title='Draw AOI' />
        </TipToolbarIconButton>
        <TipToolbarIconButton
          tipContent='Upload area of interest'
          tipProps={{ placement: 'bottom' }}
          onClick={() => setAoIModalRevealed(true)}
        >
          <CollecticonUpload2 title='Upload geoJSON' meaningful />
        </TipToolbarIconButton>
        <VerticalDivider />
        <TipToolbarIconButton
          tipContent='Delete selected / all areas of interest'
          tipProps={{ placement: 'bottom' }}
          onClick={onTrashClick}
        >
          <CollecticonTrashBin meaningful title='Delete selected' />
        </TipToolbarIconButton>
      </AnalysisToolbar>
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

  const { isDrawing } = useAois();

  // Start/stop the drawing.
  useEffect(() => {
    // @ts-expect-error Property '_drawControl' does not exist on type 'Map'.
    // Property was added to access draw control.
    const mbDraw = main?._drawControl;
    if (!mbDraw) return;

    if (isDrawing) {
      mbDraw.changeMode('draw_polygon');
    } else {
      mbDraw.changeMode('simple_select', {
        featureIds: mbDraw.getSelectedIds()
      });
    }
  }, [main, isDrawing]);

  useThemedControl(() => <CustomAoI map={main} />, {
    position: 'top-left'
  });
  return null;
}
