import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { LngLatBoundsLike } from 'react-map-gl';
import { Feature, Polygon } from 'geojson';
import styled, { css } from 'styled-components';
import bbox from '@turf/bbox';

import {
  CollecticonPencil,
  CollecticonTrashBin,
  CollecticonUpload2
} from '@devseed-ui/collecticons';
import { Toolbar, ToolbarLabel, VerticalDivider } from '@devseed-ui/toolbar';
import { Button } from '@devseed-ui/button';
import { themeVal, glsp, disabled } from '@devseed-ui/theme-provider';

import useMaps from '../../hooks/use-maps';
import useAois from '../hooks/use-aois';
import useThemedControl from '../hooks/use-themed-control';
import { useDrawControl } from '../hooks/use-draw-control';
import CustomAoIModal from './custom-aoi-modal';
import PresetSelector from './preset-selector';

import { TipToolbarIconButton } from '$components/common/tip-button';
import { Tip } from '$components/common/tip';

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

function AoiControl({
  mapboxMap,
  disableReason
}: {
  mapboxMap: mapboxgl.Map;
  disableReason?: React.ReactNode;
}) {
  const { isDrawing, setIsDrawing, aoi, updateAoi, aoiDeleteAll } = useAois();

  const [aoiModalRevealed, setAoIModalRevealed] = useState(false);
  const [selectedState, setSelectedState] = useState('');

  const resetAoi = () => {
    aoiDeleteAll();
    setSelectedState('');
  };

  const onUploadConfirm = (features: Feature<Polygon>[]) => {
    resetAoi(); // delete all previous AOIs and clear selections
    setAoIModalRevealed(false); // close modal

    updateAoi({ features });
  };

  const onPresetConfirm = (features: Feature<Polygon>[]) => {
    aoiDeleteAll(); // delete all previous AOIs but keep preset selection

    updateAoi({ features });
  };

  const onTrashClick = () => {
    resetAoi();
  };

  const [drawing, drawingIsValid] = useDrawControl({
    mapboxMap: mapboxMap,
    isDrawing
  });

  const drawingActions = {
    confirm() {
      if (drawingIsValid) {
        resetAoi(); // delete all previous AOIs and clear selections

        updateAoi({ features: drawing }); // set the drawn AOI
        setIsDrawing(false); // leave drawing mode
      }
    },
    cancel() {
      setIsDrawing(false); // leave drawing mode, nothing else
    },
    start() {
      setIsDrawing(true); // start drawing
    },
    toggle() {
      if (isDrawing) {
        drawingActions.confirm(); // finish drawing
      } else {
        drawingActions.start(); // start drawing
      }
    }
  };

  useEffect(() => {
    if (mapboxMap && aoi) {
      const bounds = bbox(aoi) as LngLatBoundsLike;
      mapboxMap.fitBounds(bounds, {
        padding: 60
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aoi]); // only run on aoi change

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
              resetPreset={resetAoi}
            />
            <VerticalDivider />
            <TipToolbarIconButton
              tipContent='Draw an area of interest'
              tipProps={{ placement: 'bottom' }}
              active={isDrawing}
              onClick={drawingActions.toggle}
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
      <FloatingBar container={mapboxMap.getContainer()}>
        {!!aoi && (
          <Button size='small' variation='base-fill' onClick={onTrashClick}>
            <CollecticonTrashBin title='Delete area' />
            Delete area
          </Button>
        )}
      </FloatingBar>
      <CustomAoIModal
        revealed={aoiModalRevealed}
        onConfirm={onUploadConfirm}
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

export default function Wrapper({
  disableReason
}: {
  disableReason?: React.ReactNode;
}) {
  const { main } = useMaps();

  useThemedControl(
    () => <AoiControl mapboxMap={main} disableReason={disableReason} />,
    {
      position: 'top-left'
    }
  );

  return null;
}
