import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useState } from 'react';
import { Feature, Polygon } from 'geojson';
import { toAoIid } from '../../utils';
import {
  aoisDeleteAtom,
  aoisFeaturesAtom,
  aoisSetSelectedAtom,
  aoisUpdateGeometryAtom,
  isDrawingAtom
} from '../aoi/atoms';
import { SIMPLE_SELECT } from '../aoi';

export default function useAois() {
  const features = useAtomValue(aoisFeaturesAtom);

  const [isDrawing, setIsDrawing] = useAtom(isDrawingAtom);
  const [drawToolInitialized, setDrawToolInitialized] = useState(false);

  const aoisUpdateGeometry = useSetAtom(aoisUpdateGeometryAtom);
  const update = useCallback(
    (features: Feature<Polygon>[]) => {
      aoisUpdateGeometry(features);
    },
    [aoisUpdateGeometry]
  );
  const onUpdate = useCallback(
    (e) => {
      const updates = e.features.map((f) => ({
        id: toAoIid(f.id),
        geometry: f.geometry as Polygon
      }));
      update(updates);
    },
    [update]
  );

  const onDrawToolInitialized = () => {
    setDrawToolInitialized(true);
  };

  const aoiDelete = useSetAtom(aoisDeleteAtom);
  const onDelete = useCallback(
    (e) => {
      const selectedIds = e.features.map((f) => toAoIid(f.id));
      aoiDelete(selectedIds);
    },
    [aoiDelete]
  );

  const aoiSetSelected = useSetAtom(aoisSetSelectedAtom);
  const onSelectionChange = useCallback(
    (e) => {
      const selectedIds = e.features.map((f) => toAoIid(f.id));
      aoiSetSelected(selectedIds);
    },
    [aoiSetSelected]
  );

  const onDrawModeChange = useCallback((e) => {
    if (e.mode === SIMPLE_SELECT) {
      setIsDrawing(false);
    }
  }, [setIsDrawing]);

  return {
    features,
    update,
    onUpdate,
    onDelete,
    onSelectionChange,
    onDrawModeChange,
    onDrawToolInitialized,
    isDrawing,
    drawToolInitialized,
    setIsDrawing
  };
}