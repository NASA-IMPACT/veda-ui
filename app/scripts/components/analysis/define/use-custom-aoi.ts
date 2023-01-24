import { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import { useCallback, useEffect, useRef, useState } from 'react';
import shp from 'shpjs';
import simplify from 'simplify-js';
import { multiPolygonToPolygons } from '../utils';

import { makeFeatureCollection } from '$components/common/aoi/utils';
import { round } from '$utils/format';

const extensions = ['geojson', 'json', 'zip'];
export const acceptExtensions = extensions.map((ext) => `.${ext}`).join(', ');

export interface FileInfo {
  name: string;
  extension: string;
  type: 'Shapefile' | 'GeoJSON';
}

function simplifyFeature(
  feature: Feature<Polygon>,
  tolerance: number
): Feature<Polygon> {
  return {
    ...feature,
    geometry: {
      ...feature.geometry,
      coordinates: feature.geometry.coordinates.map((coords) => {
        return simplify(
          coords.map((c) => ({ x: c[0], y: c[1] })),
          tolerance
        ).map((c) => [c.x, c.y]);
      })
    }
  };
}

function getNumPoints(feature: Feature<Polygon>): number {
  return feature.geometry.coordinates.reduce((acc, current) => {
    return acc + current.length;
  }, 0);
}

function useCustomAoI() {
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [uploadFileError, setUploadFileError] = useState<string | null>(null);
  const [uploadFileWarnings, setUploadFileWarnings] = useState<string[]>([]);
  const reader = useRef<FileReader>();
  const [featureCollection, setFeatureCollection] =
    useState<FeatureCollection | null>(null);

  useEffect(() => {
    reader.current = new FileReader();

    const setError = (error: string) => {
      setUploadFileError(error);
      setFeatureCollection(null);
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
        setError('Error uploading file: Invalid GeoJSON');
        return;
      }

      let warnings: string[] = [];

      if (
        geojson.features.some(
          (feature) =>
            !['MultiPolygon', 'Polygon'].includes(feature.geometry.type)
        )
      ) {
        setError(
          'Wrong geometry type. Only polygons or multi polygons are accepted.'
        );
        return;
      }

      const features: Feature<Polygon>[] = geojson.features.reduce(
        (acc, feature: Feature<Polygon | MultiPolygon>) => {
          if (feature.geometry.type === 'MultiPolygon') {
            return acc.concat(
              multiPolygonToPolygons(feature as Feature<MultiPolygon>)
            );
          }

          return acc.concat(feature);
        },
        []
      );

      if (features.length > 200) {
        setError('Only files with up to 200 polygons are accepted.');
        return;
      }

      // Simplify features;
      const originalTotalFeaturePoints = features.reduce(
        (acc, f) => acc + getNumPoints(f),
        0
      );
      let numPoints = originalTotalFeaturePoints;
      let tolerance = 0.001;
      let simplifiedFeatures = [...features];

      while (numPoints > 200 && tolerance < 5) {
        simplifiedFeatures = simplifiedFeatures.map((feature) =>
          simplifyFeature(feature, tolerance)
        );
        numPoints = simplifiedFeatures.reduce(
          (acc, f) => acc + getNumPoints(f),
          0
        );
        tolerance *= 5;
      }

      if (originalTotalFeaturePoints !== numPoints) {
        warnings = [
          ...warnings,
          `The geometry has been simplified (${round(
            (1 - numPoints / originalTotalFeaturePoints) * 100
          )} % less).`
        ];
      }

      setUploadFileWarnings(warnings);
      setUploadFileError(null);
      setFeatureCollection(
        makeFeatureCollection(
          simplifiedFeatures.map((feat, i) => ({
            id: `aoi-upload-${i}`,
            ...feat
          }))
        )
      );
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
    setFeatureCollection(null);
    setUploadFileWarnings([]);
    setUploadFileError(null);
    setFileInfo(null);
  }, []);

  return {
    featureCollection,
    onUploadFile,
    uploadFileError,
    uploadFileWarnings,
    fileInfo,
    reset
  };
}

export default useCustomAoI;
