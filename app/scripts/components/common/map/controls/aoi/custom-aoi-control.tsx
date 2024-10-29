import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Feature, Polygon } from 'geojson';
import styled, { css } from 'styled-components';
import { useAtom, useSetAtom } from 'jotai';
import bbox from '@turf/bbox';
import centroid from '@turf/centroid';
import {
  CollecticonPencil,
  CollecticonTrashBin,
  CollecticonUpload2
} from '@devseed-ui/collecticons';
import { Toolbar, ToolbarLabel, VerticalDivider } from '@devseed-ui/toolbar';
import { Button } from '@devseed-ui/button';
import { themeVal, glsp, disabled } from '@devseed-ui/theme-provider';

import { AllGeoJSON } from '@turf/helpers';
import useMaps from '../../hooks/use-maps';
import useAois from '../hooks/use-aois';
import useThemedControl from '../hooks/use-themed-control';
import CustomAoIModal from './custom-aoi-modal';
import { aoiDeleteAllAtom, selectedForEditingAtom } from './atoms';
import PresetSelector from './preset-selector';
import { DIRECT_SELECT, DRAW_POLYGON, SIMPLE_SELECT, STATIC_MODE } from './';

import { TipToolbarIconButton } from '$components/common/tip-button';
import { Tip } from '$components/common/tip';
import { getZoomFromBbox } from '$components/common/map/utils';
import { ShortcutCode } from '$styles/shortcut-code';

// 'moving' feature is disabled, match the cursor style accoringly
export const aoiCustomCursorStyle = css`
  &.mode-${STATIC_MODE} .mapboxgl-canvas-container,
  &.feature-feature.mouse-drag .mapboxgl-canvas-container,
  &.mouse-move .mapboxgl-canvas-container {
    cursor: default;
  }
`;

const AnalysisToolbar = styled(Toolbar)<{ visuallyDisabled: boolean }>`
  background-color: ${themeVal('color.surface')};
  border-radius: ${themeVal('shape.rounded')};
  padding: ${glsp(0.25)};
  box-shadow: ${themeVal('boxShadow.elevationC')};

  ${({ visuallyDisabled }) =>
    visuallyDisabled &&
    css`
      > * {
        ${disabled()}
        pointer-events: none;
      }
    `}

  ${ToolbarLabel} {
    text-transform: none;
  }
`;

const FloatingBarSelf = styled.div`
  position: absolute;
  bottom: ${glsp()};
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
`;

function CustomAoI({
  map,
  disableReason
}: {
  map: any;
  disableReason?: React.ReactNode;
}) {
  const [aoiModalRevealed, setAoIModalRevealed] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [presetIds, setPresetIds] = useState([]);
  const [fileUploadedIds, setFileUplaodedIds] = useState([]);

  const [selectedForEditing, setSelectedForEditing] = useAtom(selectedForEditingAtom);

  const { onUpdate, isDrawing, setIsDrawing, features } = useAois();
  const aoiDeleteAll = useSetAtom(aoiDeleteAllAtom);

  // Needed so that this component re-renders to when the draw selection changes
  // from feature to point.
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const mbDraw = map?._drawControl;
    if (!mbDraw) return;
    const aoiSelectedFor = selectedForEditing ? SIMPLE_SELECT : STATIC_MODE;
    const selectedFeatures = features.filter(f => f.selected);

    if (selectedFeatures.length > 0) {
      const selectedIds = selectedFeatures.map(f => f.id);
      mbDraw.changeMode(aoiSelectedFor, {
        featureIds: selectedIds
      });
    }
    const onSelChange = () => forceUpdate(Date.now());
    map.on('draw.selectionchange', onSelChange);
    return () => {
      map.off('draw.selectionchange', onSelChange);
    };
  }, [selectedForEditing]);

  const resetAoisOnMap = useCallback(() => {
    const mbDraw = map?._drawControl;
    if (!mbDraw) return;
    mbDraw.deleteAll();
    aoiDeleteAll();
  }, [aoiDeleteAll]);

  const resetForPresetSelect = useCallback(() => {
    resetAoisOnMap();
    setFileUplaodedIds([]);
  },[resetAoisOnMap]);

  const resetForFileUploaded = useCallback(()=> {
    resetAoisOnMap();
    setSelectedState('');
    setPresetIds([]);
  },[resetAoisOnMap]);

  const resetForEmptyState = useCallback(()=> {
    resetAoisOnMap();
    setSelectedState('');
    setPresetIds([]);
    setFileUplaodedIds([]);
  },[resetAoisOnMap]);

  const resetForDrawingAoi = useCallback(() =>  {
    const mbDraw = map?._drawControl;
    if (!mbDraw) return;

    if (fileUploadedIds.length) {
      mbDraw.changeMode(SIMPLE_SELECT, {
        featureIds: fileUploadedIds
      });
      mbDraw.trash();
    }

    if (presetIds.length) {
      mbDraw.changeMode(SIMPLE_SELECT, {
        featureIds: presetIds
      });
      mbDraw.trash();
    }
    setFileUplaodedIds([]);
    setPresetIds([]);
    setSelectedState('');
  },[presetIds, fileUploadedIds]);

  const onConfirm = useCallback((features: Feature<Polygon>[]) => {
    const mbDraw = map?._drawControl;
    setAoIModalRevealed(false);
    if (!mbDraw) return;
    resetForFileUploaded();
    onUpdate({ features });
    const fc = {
      type: 'FeatureCollection',
      features
    };
    const bounds = bbox(fc);
    const center = centroid(fc as AllGeoJSON).geometry.coordinates;
    map.flyTo({
      center,
      zoom: getZoomFromBbox(bounds)
    });
    const addedAoisId = mbDraw.add(fc);
    mbDraw.changeMode(STATIC_MODE, {
      featureIds: addedAoisId
    });
    setFileUplaodedIds(addedAoisId);
    setSelectedForEditing(false);
  },[map, onUpdate, resetForFileUploaded, setSelectedForEditing]);

  const onPresetConfirm = useCallback((features: Feature<Polygon>[]) => {
    const mbDraw = map?._drawControl;
    if (!mbDraw) return;
    resetForPresetSelect();
    onUpdate({ features });
    const fc = {
      type: 'FeatureCollection',
      features
    };
    const bounds = bbox(fc);
    const center = centroid(fc as AllGeoJSON).geometry.coordinates;
    map.flyTo({
      center,
      zoom: getZoomFromBbox(bounds)
    });
    const pids = mbDraw.add(fc);
    setPresetIds(pids);
    mbDraw.changeMode(STATIC_MODE, {
      featureIds: pids
    });
    setSelectedForEditing(false);
  },[map, onUpdate, resetForPresetSelect, setSelectedForEditing]);

  const toggleDrawing = useCallback(() => {
    const mbDraw = map?._drawControl;
    if (!mbDraw) return;
    resetForDrawingAoi();
    setIsDrawing(!isDrawing);
    setSelectedForEditing(true);
  }, [map, isDrawing, setIsDrawing, resetForDrawingAoi]);

  const onTrashClick = useCallback(() => {
    // We need to programmatically access the mapbox draw trash method which
    // will do different things depending on the selected mode.
    const mbDraw = map?._drawControl;
    if (!mbDraw) return;

    setSelectedState('');
    setPresetIds([]);
    setFileUplaodedIds([]);
    // This is a peculiar situation:
    // If we are in direct select (to select/add vertices) but not vertex is
    // selected, the trash method doesn't do anything. So, in this case, we
    // trigger the delete for the whole feature.
    const selectedFeatures = mbDraw.getSelected()?.features;

    if (
      mbDraw.getMode() === DIRECT_SELECT &&
      selectedFeatures.length &&
      !mbDraw.getSelectedPoints().features.length
    ) {
      // Change mode so that the trash action works.
      mbDraw.changeMode(SIMPLE_SELECT, {
        featureIds: selectedFeatures.map((f) => f.id)
      });
    }
    // If we are in static mode, we need to change to simple_select to be able
    // to delete those features
    if (mbDraw.getMode() === STATIC_MODE) {
      mbDraw.changeMode(SIMPLE_SELECT, {
        featureIds: features.map((f) => f.id)
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

  const isAreaSelected = !!map?._drawControl?.getSelected().features.length;
  const isPointSelected =
    !!map?._drawControl.getSelectedPoints().features.length;
  const hasFeatures = !!features.length;

  return (
    <>
      <Tip disabled={!disableReason} content={disableReason} placement='bottom'>
        <div>
          <AnalysisToolbar
            visuallyDisabled={!!disableReason}
            size='small'
            data-tour='analysis-tour'
          >
            <PresetSelector
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              onConfirm={onPresetConfirm}
              resetPreset={resetForEmptyState}
            />
            <VerticalDivider />
            <TipToolbarIconButton
              tipContent='Draw an area of interest'
              tipProps={{ placement: 'bottom' }}
              active={isDrawing}
              onClick={toggleDrawing}
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
          </AnalysisToolbar>
        </div>
      </Tip>
      <FloatingBar container={map.getContainer()}>
        {hasFeatures && (
          <Button size='small' variation='base-fill' onClick={onTrashClick}>
            <CollecticonTrashBin title='Delete selected' />{' '}
            {isPointSelected ? (
              <>
                Delete point <ShortcutCode>del</ShortcutCode>
              </>
            ) : isAreaSelected ? (
              <>
                Delete area <ShortcutCode>del</ShortcutCode>
              </>
            ) : (
              <>Delete all areas</>
            )}
          </Button>
        )}
      </FloatingBar>
      <CustomAoIModal
        revealed={aoiModalRevealed}
        onConfirm={onConfirm}
        onCloseClick={() => setAoIModalRevealed(false)}
      />
    </>
  );
}

interface FloatingBarProps {
  children: React.ReactNode;
  container: HTMLElement;
}

function FloatingBar(props: FloatingBarProps) {
  const { container, children } = props;
  return createPortal(<FloatingBarSelf>{children}</FloatingBarSelf>, container);
}

export default function CustomAoIControl({
  disableReason
}: {
  disableReason?: React.ReactNode;
}) {
  const { main } = useMaps();

  const { isDrawing } = useAois();

  // Start/stop the drawing.
  useEffect(() => {
    // Property was added to access draw control.
    const mbDraw = main?._drawControl;
    if (!mbDraw) return;

    if (isDrawing) {
      mbDraw.changeMode(DRAW_POLYGON);
    } else {
      mbDraw.changeMode(SIMPLE_SELECT, {
        featureIds: mbDraw.getSelectedIds()
      });
    }
  }, [main, isDrawing]);

  useThemedControl(
    () => <CustomAoI map={main} disableReason={disableReason} />,
    {
      position: 'top-left'
    }
  );
  return null;
}
