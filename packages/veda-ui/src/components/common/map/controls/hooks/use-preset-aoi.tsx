import { Feature, Polygon } from 'geojson';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { getAoiAppropriateFeatures } from './use-custom-aoi';

/**
 * Hook for loading and managing preset Area of Interest (AOI) data from GeoJSON files.
 *
 * This hook fetches GeoJSON data from a given URL, processes it to get appropriate features
 * for AOI use, and provides loading states and error handling. It automatically cancels
 * requests if the component unmounts or the preset path changes.
 *
 * @param presetPath -  URL path to the GeoJSON file to load
 * @returns Object containing the hook's state and utilities
 * @returns returns.features - Array of processed polygon features from the GeoJSON, or null if not loaded
 * @returns returns.isLoading - Boolean indicating if a request is currently in progress
 * @returns returns.error - Error message string if an error occurred while loading, or null if no error
 * @returns returns.reset - Function to clear the current features and error state
 *
 * @example
 * ```tsx
 * const { features, isLoading, error, reset } = usePresetAOI('/path/to/preset.geojson');
 *
 * if (isLoading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error}</div>;
 * if (features) return <div>Loaded {features.length} features</div>;
 * ```
 */
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
