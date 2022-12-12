import { Feature, FeatureCollection } from "geojson";
import { useCallback, useEffect, useRef, useState } from "react";

function useCustomAoI(onFeatureSet: (feature: Feature) => void) {
  const [uploadFileError, setUploadFileError] = useState<string | null>(null);
  const reader = useRef<FileReader>();
  useEffect(() => {
    reader.current = new FileReader();
    const onLoad = (event) => {
      const rawGeoJSON = event.target?.result;
      if (!rawGeoJSON) {
        setUploadFileError('Error uploading file');
        return;
      }
      let feature: Feature;
      try {
        const geoJSON = JSON.parse(rawGeoJSON as string) as FeatureCollection;
        feature = geoJSON.features[0];
      } catch (e) {
        setUploadFileError('Error uploading file: Invalid JSON');
        return;
      }
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

  const onUploadFile = useCallback(
    (event) => {
      if (!reader.current) return;
      const file = event.target.files[0];
      reader.current.readAsText(file);
    },
    []
  );
  return { onUploadFile, uploadFileError };
}

export default useCustomAoI;
