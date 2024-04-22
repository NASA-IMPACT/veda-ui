import React, { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Feature, Polygon } from 'geojson';
import styled, { css } from 'styled-components';
import { useSetAtom } from 'jotai';
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
import { aoiDeleteAllAtom } from './atoms';

import PresetSelector from './preset-selector';
import { TipToolbarIconButton } from '$components/common/tip-button';
import { Tip } from '$components/common/tip';
import { getZoomFromBbox } from '$components/common/map/utils';
import { ShortcutCode } from '$styles/shortcut-code';

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

  const { onUpdate, isDrawing, setIsDrawing, features } = useAois();
  const aoiDeleteAll = useSetAtom(aoiDeleteAllAtom);

  // Needed so that this component re-renders to when the draw selection changes
  // from feature to point.
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const onSelChange = () => forceUpdate(Date.now());
    map.on('draw.selectionchange', onSelChange);
    return () => {
      map.off('draw.selectionchange', onSelChange);
    };
  }, []);

  const onConfirm = useCallback((features: Feature<Polygon>[]) => {
    const mbDraw = map?._drawControl;
    setAoIModalRevealed(false);
    if (!mbDraw) return;
    resetAll();
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
    mbDraw.changeMode('simple_select', {
      featureIds: addedAoisId
    });
    setFileUplaodedIds(addedAoisId);
  },[map, onUpdate]);

  const resetPreset = useCallback(() => {
    const mbDraw = map?._drawControl;
    if (!mbDraw) return;
    if (presetIds.length) {
      mbDraw.changeMode('simple_select', {
        featureIds: presetIds
      });
      mbDraw.trash();
    }
    setSelectedState('');
    setPresetIds([]);
  },[presetIds]);

  const resetFileUploaded = useCallback(()=> {
    const mbDraw = map?._drawControl;
    if (!mbDraw) return;
    
    if (fileUploadedIds.length) {
      mbDraw.changeMode('simple_select', {
        featureIds: fileUploadedIds
      });
      mbDraw.trash();
    }
    setFileUplaodedIds([]);
  },[fileUploadedIds]);

  const resetAll = useCallback(() =>  {
    const mbDraw = map?._drawControl;
    if (!mbDraw) return;
    // Reset preset
    resetPreset();
    resetFileUploaded();
    mbDraw.deleteAll();
    aoiDeleteAll();
  },[aoiDeleteAll, resetPreset, resetFileUploaded]);

  const onPresetConfirm = useCallback((features: Feature<Polygon>[]) => {
    const mbDraw = map?._drawControl;
    if (!mbDraw) return;
    resetAll();
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
    mbDraw.changeMode('simple_select', {
      featureIds: pids
    });

  },[map, onUpdate, resetAll]);

  const toggleDrawing = useCallback(() => {
    const mbDraw = map?._drawControl;
    if (!mbDraw) return;
    resetPreset();
    resetFileUploaded();
    setIsDrawing(!isDrawing);
  }, [map, isDrawing, setIsDrawing, resetPreset, resetFileUploaded]);

  const onTrashClick = useCallback(() => {
    // We need to programmatically access the mapbox draw trash method which
    // will do different things depending on the selected mode.
    const mbDraw = map?._drawControl;
    if (!mbDraw) return;

    // This is a peculiar situation:
    // If we are in direct select (to select/add vertices) but not vertex is
    // selected, the trash method doesn't do anything. So, in this case, we
    // trigger the delete for the whole feature.
    const selectedFeatures = mbDraw.getSelected()?.features;
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

  const isAreaSelected = !!map?._drawControl.getSelected().features.length;
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
              resetPreset={resetPreset}
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

  useThemedControl(
    () => <CustomAoI map={main} disableReason={disableReason} />,
    {
      position: 'top-left'
    }
  );
  return null;
}
