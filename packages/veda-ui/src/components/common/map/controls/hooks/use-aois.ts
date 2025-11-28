import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Feature, Polygon } from 'geojson';
import union from '@turf/union';
import { toAoIid } from '../../utils';
import {
  aoisFeaturesAtom,
  aoiDeleteAllAtom,
  aoisUpdateGeometryAtom,
  isDrawingAtom
} from '../aoi/atoms';

export default function useAois() {
  const features = useAtomValue(aoisFeaturesAtom);

  const aoi: Feature | null = features.slice(1).reduce((acc, feature) => {
    return union(acc, feature);
  }, features[0]);

  const [isDrawing, setIsDrawing] = useAtom(isDrawingAtom);

  const aoisUpdateGeometry = useSetAtom(aoisUpdateGeometryAtom);

  const updateAoi = (fc) => {
    const updates = fc.features.map((f) => ({
      id: toAoIid(f.id),
      geometry: f.geometry as Polygon
    }));
    aoisUpdateGeometry(updates);
  };

  const aoiDeleteAll = useSetAtom(aoiDeleteAllAtom);

  return {
    features,
    aoi,
    updateAoi,
    aoiDeleteAll,
    isDrawing,
    setIsDrawing
  };
}
