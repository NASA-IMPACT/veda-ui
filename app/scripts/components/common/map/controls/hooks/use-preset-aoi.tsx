import { Feature, Polygon } from 'geojson';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { getAoiAppropriateFeatures } from './use-custom-aoi';

function usePresetAOI(presetPath?: string) {
  const [error, setError] = useState<string | null>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [features, setFeatures] = useState<Feature<Polygon>[] | null>(null);

  useEffect(() => {
    if (!presetPath) return;
    const abortController = new AbortController(); // Create an instance of AbortController

    async function loadData() {
      setIsLoading(true);
      try {
        const res = await axios.get(presetPath!, {
          signal: abortController.signal // Pass the abort signal to Axios
        });
        setIsLoading(false);
        const geojson = res.data;
        if (!geojson?.features?.length) {
          setError('Error: Invalid GeoJSON');
          return;
        }
        const { simplifiedFeatures } = getAoiAppropriateFeatures(geojson);

        setFeatures(
          simplifiedFeatures.map((feat, i) => ({
            id: `${new Date().getTime().toString().slice(-4)}${i}`,
            ...feat
          }))
        );
      } catch (error) {
        if (axios.isCancel(error)) {
          setIsLoading(false);
          // Request canceled
          setError(error.message);
        } else {
          setError('Error: Unable to load data');
        }
      }
    }

    loadData();

    return () => {
      abortController.abort();
    };
  }, [presetPath]);

  const reset = useCallback(() => {
    setFeatures(null);
    setError(null);
  }, []);

  return {
    features,
    isLoading,
    error,
    reset
  };
}

export default usePresetAOI;
