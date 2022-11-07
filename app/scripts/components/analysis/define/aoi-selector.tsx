import React, { useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { Feature, MultiPolygon, Polygon } from 'geojson';
import bbox from '@turf/bbox';

import {
  Toolbar,
  ToolbarIconButton,
  ToolbarLabel,
  VerticalDivider
} from '@devseed-ui/toolbar';
import {
  Dropdown,
  DropMenu,
  DropMenuItem,
  DropTitle
} from '@devseed-ui/dropdown';
import {
  CollecticonArea,
  CollecticonEllipsisVertical,
  CollecticonTrashBin,
  CollecticonUpload2
} from '@devseed-ui/collecticons';
import { multiPolygonToPolygon } from '../utils';
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

const MapContainer = styled.div`
  position: relative;
`;

const DemoMap = styled(MapboxMap)`
  min-height: 24rem;
`;

interface AoiSelectorProps {
  qsFeature?: Feature<MultiPolygon>;
  aoiDrawState: AoiState;
  onAoiEvent: AoiChangeListenerOverload;
}

export default function AoiSelector(props: AoiSelectorProps) {
  const { onAoiEvent, qsFeature, aoiDrawState } = props;
  const { selected, drawing, feature } = aoiDrawState;
  const mapRef = useRef<MapboxMapRef>();

  // Technical debt
  // Despite the query parameters support for multiple features on the aoi, the
  // AOI drawing tool only supports one.
  // Keeping just the first one.
  const polygon: Feature<Polygon> | null = useMemo(() => {
    return qsFeature
      ? { ...multiPolygonToPolygon(qsFeature), id: 'qs-feature' }
      : null;
  }, [qsFeature]);

  // Use the feature from the url qs as the initial state to center the map.
  useEffect(() => {
    if (polygon) {
      onAoiEvent('aoi.set-feature', { feature: polygon });
      const featureBbox = bbox(polygon) as [number, number, number, number];
      mapRef.current?.instance?.fitBounds(featureBbox, { padding: 32 });
    } else {
      onAoiEvent('aoi.clear');
      mapRef.current?.instance?.flyTo({ zoom: 1, center: [0, 0] });
    }
  }, [onAoiEvent, polygon]);

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
              <DropTitle>Select a country</DropTitle>
              <DropMenu>
                <li>
                  <DropMenuItem href='#'>Country name A</DropMenuItem>
                </li>
                <li>
                  <DropMenuItem href='#'>Country name B</DropMenuItem>
                </li>
                <li>
                  <DropMenuItem href='#'>Country name C</DropMenuItem>
                </li>
                <li>
                  <DropMenuItem href='#'>Country name D</DropMenuItem>
                </li>
              </DropMenu>
            </Dropdown>
          </Toolbar>
        </FoldHeadActions>
      </FoldHeader>
      <FoldBody>
        <MapContainer>
          <DemoMap
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
