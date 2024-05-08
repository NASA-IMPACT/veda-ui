import { atom } from 'jotai';
import { Feature, Polygon } from 'geojson';
import { AoIFeature } from '../../types';
import { decodeAois, encodeAois } from '$utils/polygon-url';
import { atomWithUrlValueStability } from '$utils/params-location-atom/atom-with-url-value-stability';

// This is the atom acting as a single source of truth for the AOIs.
export const aoisSerialized = atomWithUrlValueStability<string>({
  initialValue: new URLSearchParams(window.location.search).get('aois') ?? '',
  urlParam: 'aois',
  hydrate: (v) => v ?? '',
  dehydrate: (v) => v,
});

// Getter atom to get AoiS as GeoJSON features from the hash.
export const aoisFeaturesAtom = atom<AoIFeature[]>((get) => {
  const hash = get(aoisSerialized);
  if (!hash) return [];
  return decodeAois(hash);
});

// Setter atom to update AOIs geometries, writing directly to the hash atom.
export const aoisUpdateGeometryAtom = atom(
  null,
  (get, set, updatedGeometryData: { updates: Feature<Polygon>[], selected: boolean }) => {
    let newFeatures = [...get(aoisFeaturesAtom)];
    updatedGeometryData.updates.forEach(({ id, geometry }) => {
      const existingFeature = newFeatures.find((feature) => feature.id === id);
      if (existingFeature) {
        existingFeature.geometry = geometry;
      } else {
        const newFeature: AoIFeature = {
          type: 'Feature',
          id: id as string,
          geometry,
          selected: updatedGeometryData.selected ?? true,
          properties: {}
        };
        newFeatures = [...newFeatures, newFeature];
      }
    });
    set(aoisSerialized, encodeAois(newFeatures));
  }
);

// Setter atom to update AOIs selected state, writing directly to the hash atom.
export const aoisSetSelectedAtom = atom(null, (get, set, ids: string[]) => {
  const features = get(aoisFeaturesAtom);
  const newFeatures = features.map((feature) => {
    return { ...feature, selected: ids.includes(feature.id as string) };
  });
  set(aoisSerialized, encodeAois(newFeatures));
});

// Setter atom to delete AOIs, writing directly to the hash atom.
export const aoisDeleteAtom = atom(null, (get, set, ids: string[]) => {
  const features = get(aoisFeaturesAtom);
  const newFeatures = features.filter(
    (feature) => !ids.includes(feature.id as string)
  );
  set(aoisSerialized, encodeAois(newFeatures));
});

export const aoiDeleteAllAtom = atom(null, (get, set) => {
  set(aoisSerialized, encodeAois([]));
});

export const isDrawingAtom = atom(false);