import { Feature, FeatureCollection } from 'geojson';
import { useCallback, useEffect, useRef, useState } from 'react';
import shp from 'shpjs';

const extensions = ['geojson', 'json', 'zip'] as const;
// https://steveholgado.com/typescript-types-from-arrays/
// type Extension = typeof extensions[number];

export const acceptExtensions = extensions.map((ext) => `.${ext}`).join(', ');

function useCustomAoI(onFeatureSet: (feature: Feature) => void) {
  const [uploadFileError, setUploadFileError] = useState<string | null>(null);
  const reader = useRef<FileReader>();
  useEffect(() => {
    reader.current = new FileReader();

    const onLoad = async () => {
      if (!reader.current) return;
      let geojson: FeatureCollection;
      if (typeof reader.current.result === 'string') {
        const rawGeoJSON = reader.current.result;
        if (!rawGeoJSON) {
          setUploadFileError('Error uploading file');
          return;
        }
        try {
          geojson = JSON.parse(rawGeoJSON as string) as FeatureCollection;
        } catch (e) {
          setUploadFileError('Error uploading file: Invalid JSON');
          return;
        }
      }
      else {
        geojson = await shp(reader.current.result);
      } 
      const feature: Feature = geojson.features[0];
      if (!feature) {
        setUploadFileError('Error uploading file: Invalid GeoJSON');
        return;
      }
      onFeatureSet(feature);
    };

    const onError = () => {
      setUploadFileError('Error uploading file');
    };

    reader.current.addEventListener('load', onLoad);
    reader.current.addEventListener('error', onError);

    return () => {
      if (!reader.current) return;
      reader.current.removeEventListener('load', onLoad);
      reader.current.removeEventListener('error', onError);
    };
  }, [onFeatureSet]);

  const onUploadFile = useCallback((event) => {
    if (!reader.current) return;

    const file = event.target.files[0];
    if (!file) return;

    const [, extension] = file.name.match(/^.*\.(json|geojson|zip)$/i);

    if (extension === 'zip') {
      reader.current.readAsArrayBuffer(file);
    } else if (extension === 'json' || extension === 'geojson') {
      reader.current.readAsText(file);
    } else {
      setUploadFileError(
        'Wrong file type. Only zipped shapefiles and geojson files are accepted.'
      );
    }
  }, []);
  return { onUploadFile, uploadFileError };
}

export default useCustomAoI;
