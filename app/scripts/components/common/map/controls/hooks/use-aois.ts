import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { Feature, Polygon } from 'geojson';
import { toAoIid } from '../../utils';
import {
  aoiDeleteAllAtom,
  aoisDeleteAtom,
  aoisFeaturesAtom,
  aoisSetSelectedAtom,
  aoisUpdateGeometryAtom,
  isDrawingAtom,
  selectedForEditingAtom
} from '../aoi/atoms';
import { SIMPLE_SELECT } from '../aoi';

export default function useAois() {
  const features = useAtomValue(aoisFeaturesAtom);

  const [isDrawing, setIsDrawing] = useAtom(isDrawingAtom);
  const [selectedForEditing, setSelectedForEditing] = useAtom(selectedForEditingAtom);

  const aoiDelete = useSetAtom(aoisDeleteAtom);
  const aoisUpdateGeometry = useSetAtom(aoisUpdateGeometryAtom);
  const aoiSetSelected = useSetAtom(aoisSetSelectedAtom);
  const aoiDeleteAll = useSetAtom(aoiDeleteAllAtom);

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

  const onDelete = useCallback(
    (e) => {
      const selectedIds = e.features.map((f) => toAoIid(f.id));
      aoiDelete(selectedIds);
    },
    [aoiDelete]
  );

  const onDeleteAll = useCallback(
    () => {
      aoiDeleteAll();
    },
    [aoiDeleteAll]
  );

  const onSelectionChange = useCallback(
    (e) => {
      console.log('onSelectionChange:', e);
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
    onDeleteAll,
    onSelectionChange,
    onDrawModeChange,
    isDrawing,
    setIsDrawing,
    selectedForEditing,
    setSelectedForEditing
  };
}