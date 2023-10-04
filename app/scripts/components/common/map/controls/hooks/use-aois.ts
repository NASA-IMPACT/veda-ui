import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { Polygon } from 'geojson';
import { toAoIid } from '../../utils';
import { aoisDeleteAtom, aoisFeaturesAtom, aoisSetSelectedAtom, aoisUpdateGeometryAtom } from '$components/exploration/atoms/atoms';

export default function useAois() {
  const features = useAtomValue(aoisFeaturesAtom);

  const aoisUpdateGeometry = useSetAtom(aoisUpdateGeometryAtom);
  const onUpdate = useCallback(
    (e) => {
      const updates = e.features.map((f) => ({ id: toAoIid(f.id), geometry: f.geometry as Polygon }));
      aoisUpdateGeometry(updates);
    },
    [aoisUpdateGeometry]
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
  return { features, onUpdate, onDelete, onSelectionChange };
}
