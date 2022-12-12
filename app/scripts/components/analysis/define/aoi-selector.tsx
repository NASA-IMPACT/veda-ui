import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import styled from 'styled-components';
import { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import bbox from '@turf/bbox';

import {
  Toolbar,
  ToolbarIconButton,
  ToolbarLabel,
  VerticalDivider
} from '@devseed-ui/toolbar';
import { Dropdown, DropMenu, DropTitle } from '@devseed-ui/dropdown';
import {
  CollecticonArea,
  CollecticonEllipsisVertical,
  CollecticonTrashBin,
  CollecticonUpload2
} from '@devseed-ui/collecticons';
import { multiPolygonToPolygon } from '../utils';
import { FeatureByRegionPreset, RegionPreset } from './constants';
import useCustomAoI from './use-custom-aoi';
import {
  Fold,
  FoldHeader,
  FoldHeadline,
  FoldHeadActions,
  FoldTitle,
  FoldBody
} from '$components/common/fold';
import MapboxMap, { MapboxMapRef } from '$components/common/mapbox';
import {
  AoiChangeListenerOverload,
  AoiState
} from '$components/common/aoi/types';
import DropMenuItemButton, {
  DropMenuItemFileInput
} from '$styles/drop-menu-item-button';

const MapContainer = styled.div`
  position: relative;
`;

const AoiMap = styled(MapboxMap)`
  min-height: 24rem;
`;

interface AoiSelectorProps {
  qsFeature?: Feature<MultiPolygon>;
  aoiDrawState: AoiState;
  onAoiEvent: AoiChangeListenerOverload;
}

export default function AoiSelector({
  onAoiEvent,
  qsFeature,
  aoiDrawState
}: AoiSelectorProps) {
  const { selected, drawing, feature } = aoiDrawState;
  const mapRef = useRef<MapboxMapRef>(null);

  // Technical debt
  // Despite the query parameters support for multiple features on the aoi, the
  // AOI drawing tool only supports one.
  // Keeping just the first one.
  const qsPolygon: Feature<Polygon> | null = useMemo(() => {
    return qsFeature
      ? { ...multiPolygonToPolygon(qsFeature), id: 'qs-feature' }
      : null;
  }, [qsFeature]);

  const setFeature = useCallback(
    (feature: Feature<Polygon>) => {
      onAoiEvent('aoi.set-feature', { feature });
      const featureBbox = bbox(feature) as [number, number, number, number];
      mapRef.current?.instance?.fitBounds(featureBbox, { padding: 32 });
    },
    [onAoiEvent]
  );

  const onRegionPresetClick = useCallback(
    (preset: RegionPreset) => {
      setFeature({
        ...FeatureByRegionPreset[preset],
        id: 'region-preset-feature'
      });
    },
    [setFeature]
  );

  // Use the feature from the url qs or the region preset as the initial state to center the map.
  useEffect(() => {
    if (qsPolygon) {
      setFeature(qsPolygon);
    } else {
      onAoiEvent('aoi.clear');
      mapRef.current?.instance?.flyTo({ zoom: 1, center: [0, 0] });
    }
  }, [onAoiEvent, qsPolygon, setFeature]);

  const { onUploadFile, uploadFileError } = useCustomAoI(setFeature);

  return (
    <Fold>
      <FoldHeader>
        <FoldHeadline>
          <FoldTitle>Area</FoldTitle>
        </FoldHeadline>
        <FoldHeadActions>
          <Toolbar size='small'>
            <ToolbarLabel>Actions</ToolbarLabel>
            <ToolbarIconButton
              variation='base-text'
              onClick={() => onAoiEvent('aoi.clear')}
              disabled={!feature}
            >
              <CollecticonTrashBin title='Delete shape' meaningful />
            </ToolbarIconButton>
            <VerticalDivider variation='dark' />
            <ToolbarIconButton
              variation='base-text'
              onClick={() => onAoiEvent('aoi.draw-click')}
              active={selected || drawing}
            >
              <CollecticonArea title='Draw shape' meaningful />
            </ToolbarIconButton>
            <ToolbarIconButton variation='base-text'>
              <CollecticonUpload2 title='Upload geoJSON' meaningful />
            </ToolbarIconButton>
            <Dropdown
              alignment='right'
              triggerElement={(props) => (
                <ToolbarIconButton variation='base-text' {...props}>
                  <CollecticonEllipsisVertical
                    title='More options'
                    meaningful
                  />
                </ToolbarIconButton>
              )}
            >
              <DropTitle>Select a region</DropTitle>
              <DropMenu>
                <li>
                  <DropMenuItemButton
                    onClick={() => onRegionPresetClick('world')}
                  >
                    World
                  </DropMenuItemButton>
                </li>
              </DropMenu>

              <DropMenu>
                <li>
                  {/* <DropMenuItemButton> */}
                  <DropMenuItemFileInput
                    type='file'
                    onChange={onUploadFile}
                    accept='.json, .geojson, .zip'
                  />
                  {uploadFileError && <div>{uploadFileError}</div>}
                  {/* </DropMenuItemButton> */}
                </li>
              </DropMenu>
            </Dropdown>
          </Toolbar>
        </FoldHeadActions>
      </FoldHeader>
      <FoldBody>
        <MapContainer>
          <AoiMap
            ref={mapRef}
            aoi={aoiDrawState}
            onAoiChange={onAoiEvent}
            cooperativeGestures
          />
        </MapContainer>
      </FoldBody>
    </Fold>
  );
}
