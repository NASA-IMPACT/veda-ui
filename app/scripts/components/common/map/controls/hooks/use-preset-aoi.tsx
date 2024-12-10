import { Feature, Polygon } from 'geojson';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { getAoiAppropriateFeatures } from './use-custom-aoi';

function usePresetAOI(selectedState) {
  const [error, setError] = useState<string | null>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [features, setFeatures] = useState<Feature<Polygon>[] | null>(null);

  useEffect(() => {
    if (!selectedState) return;
    const abortController = new AbortController();

    async function loadData() {
      setIsLoading(true);
      try {
        // We're dynamically adjusting the base path based on the environment:
        // 1. If running in Next.js, omit "/public" from the path
        // 2. For legacy instances, we include "/public" as part of the path
        const basePath =
          typeof window !== 'undefined'
            ? `/geo-data/states/`
            : `${process.env.PUBLIC_URL ?? ''}/public/geo-data/states/`;

        const res = await axios.get(`${basePath}${selectedState}.geojson`, {
          signal: abortController.signal
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
  }, [selectedState]);

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
