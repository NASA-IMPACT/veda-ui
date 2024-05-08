import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { Feature, Polygon } from 'geojson';
import { toAoIid } from '../../utils';
import {
  aoisDeleteAtom,
  aoisFeaturesAtom,
  aoisSetSelectedAtom,
  aoisUpdateGeometryAtom,
  isDrawingAtom
} from '../aoi/atoms';

export default function useAois() {
  const features = useAtomValue(aoisFeaturesAtom);

  const [isDrawing, setIsDrawing] = useAtom(isDrawingAtom);

  const aoisUpdateGeometry = useSetAtom(aoisUpdateGeometryAtom);
  const update = useCallback(
    ({ updates, selected }: { updates: Feature<Polygon>[], selected: boolean}) => {
      aoisUpdateGeometry({
        updates,
        selected
      });
    },
    [aoisUpdateGeometry]
  );
  
  const onUpdate = useCallback(
    (e) => {
      const updates = e.features.map((f) => ({
        id: toAoIid(f.id),
        geometry: f.geometry as Polygon
      }));
      update({
        updates,
        selected: e.selected ?? true
      });
    },
    [update]
  );

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
    if (e.mode === 'simple_select') {
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
    isDrawing,
    setIsDrawing
  };
}
