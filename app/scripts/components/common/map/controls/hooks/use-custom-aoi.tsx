import { Feature, MultiPolygon, Polygon } from 'geojson';
import { useCallback, useEffect, useRef, useState } from 'react';
import shp from 'shpjs';
import simplify from '@turf/simplify';

import { multiPolygonToPolygons } from '../../utils';
import { round } from '$utils/format';

const extensions = ['geojson', 'json', 'zip'];
const maxTolerance = 5;

export const eachFeatureMaxPointNum = 500;
export const maxPolygonNum = 200;
export const acceptExtensions = extensions.map((ext) => `.${ext}`).join(', ');

export const INVALID_GEOMETRY_ERROR =
  'Wrong geometry type. Only polygons or multi polygons are accepted.';
export const TOO_MANY_POLYGONS_ERROR =
  'Only files with up to 200 polygons are accepted.';
const RING_POLYGON_WARNING =
  'Polygons with rings are not supported and were simplified to remove them';
const TOLERANCE_ACCELERATOR = 1.5;

export interface FileInfo {
  name: string;
  extension: string;
  type: 'Shapefile' | 'GeoJSON';
}

export interface PolygonGeojson {
  type: 'FeatureCollection';
  features: Feature<Polygon | MultiPolygon>[];
}

export function getNumPoints(feature: Feature<Polygon>): number {
  return feature.geometry.coordinates.reduce((acc, current) => {
    return acc + current.length;
  }, 0);
}

export function validateGeometryType(geojson: PolygonGeojson): boolean {
  const hasInvalidGeometry = geojson.features.some(
    (feature) => !['MultiPolygon', 'Polygon'].includes(feature.geometry.type)
  );
  return !hasInvalidGeometry;
}

export function extractPolygonsFromGeojson(
  geojson: PolygonGeojson
): Feature<Polygon>[] {
  return geojson.features.reduce(
    (acc: Feature<Polygon>[], feature: Feature<Polygon | MultiPolygon>) => {
      if (feature.geometry.type === 'MultiPolygon') {
        return acc.concat(
          multiPolygonToPolygons(feature as Feature<MultiPolygon>)
        );
      }
      return acc.concat(feature as Feature<Polygon>);
    },
    []
  );
}

export function validateFeatureCount(features: Feature<Polygon>[]): boolean {
  return features.length <= maxPolygonNum;
}

export function removePolygonHoles(features: Feature<Polygon>[]): {
  simplifiedFeatures: Feature<Polygon>[];
  warnings: string[];
} {
  let polygonHasRings = false;
  const simplifiedFeatures = features.map<Feature<Polygon>>((feature) => {
    if (feature.geometry.coordinates.length > 1) {
      polygonHasRings = true;
      return {
        ...feature,
        geometry: {
          type: 'Polygon',
          coordinates: [feature.geometry.coordinates[0]]
        }
      };
    }
    return feature;
  });

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const warnings = polygonHasRings ? [RING_POLYGON_WARNING] : [];
  return { simplifiedFeatures, warnings };
}

export function simplifyFeatures(features: Feature<Polygon>[]): {
  simplifiedFeatures: Feature<Polygon>[];
  warnings: string[];
} {
  const warnings: string[] = [];
  let tolerance = 0.001;
  // 1. Simplify each feature if needed to reduce point count to ${eachFeatureMaximumPointsNum}
  const simplifiedFeatures = features.map((feature) => {
    const numPoints = getNumPoints(feature);
    if (numPoints > eachFeatureMaxPointNum) {
      let simplifiedFeature = feature;
      while (
        getNumPoints(simplifiedFeature) > eachFeatureMaxPointNum &&
        tolerance < maxTolerance
      ) {
        simplifiedFeature = simplify(simplifiedFeature, { tolerance });
        tolerance *= TOLERANCE_ACCELERATOR;
      }
      return simplifiedFeature;
    }
    return feature;
  });

  const simplifiedCount = simplifiedFeatures.filter(
    (feature, index) => getNumPoints(feature) < getNumPoints(features[index])
  ).length;

  if (simplifiedCount > 0) {
    const featureText = simplifiedCount === 1 ? 'feature was' : 'features were';
    // eslint-disable-next-line fp/no-mutating-methods
    warnings.push(
      `${simplifiedCount} ${featureText} simplified to have less than ${eachFeatureMaxPointNum} points.`
    );
  }

  const originalTotalPoints = features.reduce(
    (acc, f) => acc + getNumPoints(f),
    0
  );
  let totalPoints = simplifiedFeatures.reduce(
    (acc, f) => acc + getNumPoints(f),
    0
  );

  // Further Simplify features in case there are a lot of features
  // to control the number of the total points (10000 for now)
  while (totalPoints > 10000 && tolerance < maxTolerance) {
    simplifiedFeatures.forEach((feature, i) => {
      simplifiedFeatures[i] = simplify(feature, { tolerance });
    });
    totalPoints = simplifiedFeatures.reduce(
      (acc, f) => acc + getNumPoints(f),
      0
    );
    tolerance = Math.min(tolerance * TOLERANCE_ACCELERATOR, 5);
  }

  if (originalTotalPoints !== totalPoints) {
    // eslint-disable-next-line fp/no-mutating-methods
    warnings.push(
      `The geometry has been simplified (${round(
        (1 - totalPoints / originalTotalPoints) * 100
      )} % less).`
    );
  }

  return { simplifiedFeatures, warnings };
}

export function getAoiAppropriateFeatures(geojson: PolygonGeojson) {
  const geometryValidated = validateGeometryType(geojson);
  if (!geometryValidated) {
    throw new Error(INVALID_GEOMETRY_ERROR);
  }

  const features = extractPolygonsFromGeojson(geojson);
  const featureCountValidated = validateFeatureCount(features);
  if (!featureCountValidated) {
    throw new Error(TOO_MANY_POLYGONS_ERROR);
  }
  const { simplifiedFeatures: noHolesFeatures, warnings: holeWarnings } =
    removePolygonHoles(features);

  const { simplifiedFeatures, warnings: simplificationWarnings } =
    simplifyFeatures(noHolesFeatures);

  return {
    simplifiedFeatures,
    warnings: [...holeWarnings, ...simplificationWarnings]
  };
}

function useCustomAoI() {
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [uploadFileError, setUploadFileError] = useState<string | null>(null);
  const [uploadFileWarnings, setUploadFileWarnings] = useState<string[]>([]);
  const reader = useRef<FileReader>();
  const [features, setFeatures] = useState<Feature<Polygon>[] | null>(null);

  useEffect(() => {
    reader.current = new FileReader();

    const setError = (error: string) => {
      setUploadFileError(error);
      setFeatures(null);
      setUploadFileWarnings([]);
    };

    const onLoad = async () => {
      if (!reader.current) return;
      let geojson;
      if (typeof reader.current.result === 'string') {
        const rawGeoJSON = reader.current.result;
        if (!rawGeoJSON) {
          setError('Error uploading file.');
          return;
        }
        try {
          geojson = JSON.parse(rawGeoJSON as string);
        } catch (e) {
          setError('Error uploading file: invalid JSON');
          return;
        }
      } else {
        try {
          geojson = await shp(reader.current.result);
        } catch (e) {
          setError(`Error uploading file: invalid Shapefile (${e.message})`);
          return;
        }
      }
      if (!geojson?.features?.length) {
        setError('Error uploading file: Invalid data');
        return;
      }
      try {
        const { simplifiedFeatures, warnings } =
          getAoiAppropriateFeatures(geojson);
        setUploadFileWarnings(warnings);
        setUploadFileError(null);
        setFeatures(
          simplifiedFeatures.map((feat, i) => ({
            id: `${new Date().getTime().toString().slice(-4)}${i}`,
            ...feat
          }))
        );
      } catch (e) {
        setError(e.message);
        return;
      }
    };

    const onError = () => {
      setError('Error uploading file');
    };

    reader.current.addEventListener('load', onLoad);
    reader.current.addEventListener('error', onError);

    return () => {
      if (!reader.current) return;
      reader.current.removeEventListener('load', onLoad);
      reader.current.removeEventListener('error', onError);
    };
  }, []);

  const onUploadFile = useCallback((event) => {
    if (!reader.current) return;

    const file = event.target.files[0];
    if (!file) return;

    const [, extension] = file.name.match(/^.*\.(json|geojson|zip)$/i) ?? [];

    if (!extensions.includes(extension)) {
      setUploadFileError(
        'Wrong file type. Only zipped shapefiles and geojson files are accepted.'
      );
      return;
    }

    setFileInfo({
      name: file.name,
      extension,
      type: extension === 'zip' ? 'Shapefile' : 'GeoJSON'
    });

    if (extension === 'zip') {
      reader.current.readAsArrayBuffer(file);
    } else if (extension === 'json' || extension === 'geojson') {
      reader.current.readAsText(file);
    }
  }, []);

  const reset = useCallback(() => {
    setFeatures(null);
    setUploadFileWarnings([]);
    setUploadFileError(null);
    setFileInfo(null);
  }, []);

  return {
    features,
    onUploadFile,
    uploadFileError,
    uploadFileWarnings,
    fileInfo,
    reset
  };
}

export default useCustomAoI;
