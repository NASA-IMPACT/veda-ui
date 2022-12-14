import { Feature, FeatureCollection } from 'geojson';
import { useCallback, useEffect, useRef, useState } from 'react';
import shp from 'shpjs';

const extensions = ['geojson', 'json', 'zip'];
export const acceptExtensions = extensions.map((ext) => `.${ext}`).join(', ');

export interface FileInfo {
  name: string
  extension: string
  type: 'Shapefile' | 'GeoJSON'
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
      let geojson: FeatureCollection;
      if (typeof reader.current.result === 'string') {
        const rawGeoJSON = reader.current.result;
        if (!rawGeoJSON) {
          setError('Error uploading file');
          return;
        }
        try {
          geojson = JSON.parse(rawGeoJSON as string) as FeatureCollection;
        } catch (e) {
          setError('Error uploading file: Invalid JSON');
          return;
        }
      } else {
        geojson = await shp(reader.current.result);
      }
      const feature: Feature = geojson.features[0];
      if (!feature) {
        setError('Error uploading file: Invalid GeoJSON');
        return;
      }

      let warnings: string[] = [];
      if (geojson.features.length > 1) {
        warnings = [
          ...warnings,
          'Your file contains multiple features. Only the first one will be used.'
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

    const [, extension] = file.name.match(/^.*\.(json|geojson|zip)$/i);

    if (!extensions.includes(extension))  {
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
  return { onUploadFile, uploadFileError, uploadFileWarnings, fileInfo, feature };
}

export default useCustomAoI;
