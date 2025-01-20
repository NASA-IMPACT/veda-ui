import React, { useCallback, useState } from 'react';
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
  map: mapboxgl.Map;
  disableReason?: React.ReactNode;
}) {
  const [aoiModalRevealed, setAoIModalRevealed] = useState(false);
  const [selectedState, setSelectedState] = useState('');

  const [isAreaSelected] = useState<boolean>(false);
  const [isPointSelected] = useState<boolean>(false);

  const { onUpdate, isDrawing, setIsDrawing, features } = useAois();
  const aoiDeleteAll = useSetAtom(aoiDeleteAllAtom);

  const resetAoisOnMap = useCallback(() => {
    aoiDeleteAll();
  }, [aoiDeleteAll]);

  const resetForPresetSelect = useCallback(() => {
    resetAoisOnMap();
  }, [resetAoisOnMap]);

  const resetForFileUploaded = useCallback(() => {
    resetAoisOnMap();
    setSelectedState('');
  }, [resetAoisOnMap]);

  const resetForEmptyState = useCallback(() => {
    resetAoisOnMap();
    setSelectedState('');
  }, [resetAoisOnMap]);

  const resetForDrawingAoi = useCallback(() => {
    setSelectedState('');
  }, []);

  const onConfirm = useCallback(
    (features: Feature<Polygon>[]) => {
      setAoIModalRevealed(false);

      resetForFileUploaded();
      onUpdate({ features });
      const fc = {
        type: 'FeatureCollection',
        features
      };
      const bounds = bbox(fc);
      const center = centroid(fc as AllGeoJSON).geometry.coordinates as [
        number,
        number
      ];
      map.flyTo({
        center,
        zoom: getZoomFromBbox(bounds)
      });
    },
    [map, onUpdate, resetForFileUploaded]
  );

  const onPresetConfirm = useCallback(
    (features: Feature<Polygon>[]) => {
      resetForPresetSelect();
      onUpdate({ features });
      const fc = {
        type: 'FeatureCollection',
        features
      };
      const bounds = bbox(fc);
      const center = centroid(fc as AllGeoJSON).geometry.coordinates as [
        number,
        number
      ];
      map.flyTo({
        center,
        zoom: getZoomFromBbox(bounds)
      });
    },
    [map, onUpdate, resetForPresetSelect]
  );

  const toggleDrawing = useCallback(() => {
    resetForDrawingAoi();
    setIsDrawing(!isDrawing);
  }, [isDrawing, setIsDrawing, resetForDrawingAoi]);

  const onTrashClick = useCallback(() => {
    setSelectedState('');
  }, []);

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

  useThemedControl(
    () => <CustomAoI map={main} disableReason={disableReason} />,
    {
      position: 'top-left'
    }
  );

  return null;
}
