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

    async function loadData() {
      const res = await axios.get(`${presetFilePath}${selectedState}${presetSuffix}`);
      const geojson = res.data;
      if (!geojson?.features?.length) {
        setError('Error uploading file: Invalid GeoJSON');
        return;
      }

      const { simplifiedFeatures } = getAoiAppropriateFeatures(geojson);
  
      setFeatures(
        simplifiedFeatures.map((feat, i) => ({
          id: `${new Date().getTime().toString().slice(-4)}${i}`,
          ...feat
        }))
      );
    }
    loadData();
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
