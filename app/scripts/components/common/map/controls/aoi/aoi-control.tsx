import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Feature, Polygon } from 'geojson';
import styled, { css, useTheme } from 'styled-components';

import {
  CollecticonPencil,
  CollecticonTrashBin,
  CollecticonUpload2
} from '@devseed-ui/collecticons';
import { Toolbar, ToolbarLabel, VerticalDivider } from '@devseed-ui/toolbar';
import { themeVal, glsp, disabled } from '@devseed-ui/theme-provider';

import useMaps from '../../hooks/use-maps';
import useAois from '../hooks/use-aois';
import useThemedControl from '../hooks/use-themed-control';
import { useDrawControl } from '../hooks/use-draw-control';
import CustomAoIModal from './custom-aoi-modal';
import PresetSelector from './preset-selector';

import { computeDrawStyles } from './style';
import { DrawTools } from './draw-tools';
import { TipToolbarIconButton } from '$components/common/tip-button';
import { Tip } from '$components/common/tip';
import { USWDSButton } from '$uswds';

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

const AoiControl = ({ disableReason }: { disableReason?: React.ReactNode }) => {
  const theme = useTheme();
  const { main: mapboxMap } = useMaps();
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
    isDrawing,
    styles: computeDrawStyles(theme)
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

  const control = (
    <>
      <Tip disabled={!disableReason} content={disableReason} placement='bottom'>
        <div>
          <AnalysisToolbar
            visuallyDisabled={!!disableReason}
            size='small'
            data-tour='analysis-tour'
          >
            {isDrawing ? (
              <DrawTools {...{ drawingActions, drawingIsValid }} />
            ) : (
              <>
                <PresetSelector
                  selectedState={selectedState}
                  setSelectedState={setSelectedState}
                  onConfirm={onPresetConfirm}
                  resetPreset={resetAoi}
                />
                <VerticalDivider />
                <TipToolbarIconButton
                  tipContent='Draw a new area of interest'
                  tipProps={{ placement: 'bottom' }}
                  onClick={drawingActions.start}
                >
                  <CollecticonPencil meaningful title='Draw new AOI' />
                </TipToolbarIconButton>
                <TipToolbarIconButton
                  tipContent='Upload a new area of interest'
                  tipProps={{ placement: 'bottom' }}
                  onClick={() => setAoIModalRevealed(true)}
                >
                  <CollecticonUpload2 meaningful title='Upload geoJSON' />
                </TipToolbarIconButton>
              </>
            )}
          </AnalysisToolbar>
        </div>
      </Tip>

      {!isDrawing && !!aoi && (
        <FloatingBar container={mapboxMap.getContainer()}>
          <USWDSButton
            onClick={onTrashClick}
            type='button'
            base
            size='small'
            className='padding-top-05 padding-right-105 padding-bottom-05 padding-left-105'
          >
            <CollecticonTrashBin title='Delete area' />
            Delete area
          </USWDSButton>
        </FloatingBar>
      )}

      <CustomAoIModal
        revealed={aoiModalRevealed}
        onConfirm={onUploadConfirm}
        onCloseClick={() => setAoIModalRevealed(false)}
      />
    </>
  );

  return useThemedControl(() => control, {
    position: 'top-left'
  });
};

interface FloatingBarProps {
  children: React.ReactNode;
  container: HTMLElement;
}

function FloatingBar(props: FloatingBarProps) {
  const { container, children } = props;
  return createPortal(<FloatingBarSelf>{children}</FloatingBarSelf>, container);
}

export default AoiControl;
