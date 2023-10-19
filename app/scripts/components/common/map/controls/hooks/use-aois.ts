import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { Feature, Polygon } from 'geojson';
import { toAoIid } from '../../utils';
import {
  aoisDeleteAtom,
  aoisFeaturesAtom,
  aoisSetSelectedAtom,
  aoisUpdateGeometryAtom
} from '../aoi/atoms';

export default function useAois() {
  const features = useAtomValue(aoisFeaturesAtom);

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

  return { features, update, onUpdate, onDelete, onSelectionChange };
}
