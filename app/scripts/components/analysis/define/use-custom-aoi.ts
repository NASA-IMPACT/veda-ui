import { Feature, MultiPolygon, Polygon } from 'geojson';
import { useCallback, useEffect, useRef, useState } from 'react';
import shp from 'shpjs';
import simplify from 'simplify-js';
import { multiPolygonToPolygon } from '../utils';

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
  const [feature, setFeature] = useState<Feature | null>(null);
  useEffect(() => {
    reader.current = new FileReader();

    const setError = (error: string) => {
      setUploadFileError(error);
      setFeature(null);
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
      let feature: Feature = geojson.features[0];
      if (!geojson.features || !geojson.features.length) {
        setError('Error uploading file: Invalid GeoJSON');
        return;
      }

      let warnings: string[] = [];
      if (geojson.features.length > 1) {
        warnings = [
          ...warnings,
          'Files containing multiple features are not supported. Only the first feature will be used.'
        ];
      }

      if (feature.geometry.type === 'MultiPolygon') {
        warnings = [
          ...warnings,
          'Files containing multiple polygons are not supported. Only the first polygon will be used.'
        ];
        feature = multiPolygonToPolygon(feature as Feature<MultiPolygon>);
      } else if (feature.geometry.type !== 'Polygon') {
        setError(
          'Wrong geometry type. Only polygons or multi polygons are accepted.'
        );
        return;
      }

      const originalNumPoints = getNumPoints(feature as Feature<Polygon>);
      let numPoints = originalNumPoints;
      let tolerance = 0.001;
      while (numPoints > 2000) {
        feature = simplifyFeature(feature as Feature<Polygon>, tolerance);
        numPoints = getNumPoints(feature as Feature<Polygon>);
        tolerance *= 5;
      }

      if (originalNumPoints !== numPoints) {
        warnings = [
          ...warnings,
          `The geometry has been simplified (${originalNumPoints} down to ${numPoints} points).`
        ];
      }

      setUploadFileWarnings(warnings);
      setUploadFileError(null);
      setFeature({ ...feature, id: 'aoi-upload' });
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
  }, [setFeature]);

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
    setFeature(null);
    setUploadFileWarnings([]);
    setUploadFileError(null);
    setFileInfo(null);
  }, []);

  return {
    feature,
    onUploadFile,
    uploadFileError,
    uploadFileWarnings,
    fileInfo,
    reset
  };
}

export default useCustomAoI;
