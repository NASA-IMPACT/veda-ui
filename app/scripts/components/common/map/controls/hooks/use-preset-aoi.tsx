import { Feature, Polygon } from 'geojson';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

import { getAoiAppropriateFeatures } from './use-custom-aoi';

const presetFilePath = `/public/geo-data/states/`;
const presetSuffix = `.geojson`;

function usePresetAOI(selectedState) {
  const [error, setError] = useState<string|null>('');
  const [features, setFeatures] = useState<Feature<Polygon>[] | null>(null);

  useEffect(() => {
    if (!selectedState) return;
    const abortController = new AbortController();  // Create an instance of AbortController

    async function loadData() {
      try {
        const res = await axios.get(`${presetFilePath}${selectedState}${presetSuffix}`, {
          signal: abortController.signal  // Pass the abort signal to Axios
        });
        const geojson = res.data;
        if (!geojson?.features?.length) {
          setError('Error: Invalid GeoJSON');
          return;
        }
        const { simplifiedFeatures } = getAoiAppropriateFeatures(geojson);
    
        setFeatures(simplifiedFeatures.map((feat, i) => ({
          id: `${new Date().getTime().toString().slice(-4)}${i}`,
          ...feat
        })));
      } catch (error) {
        if (axios.isCancel(error)) {
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
  }, [selectedState]);

  const reset = useCallback(() => {
    setFeatures(null);
    setError(null);
  }, []);

  return {
    features,
    error,
    reset
  };

}

export default usePresetAOI;
