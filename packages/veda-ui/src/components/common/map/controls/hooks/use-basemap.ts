import { useCallback, useState } from 'react';
import { BASEMAP_ID_DEFAULT, BasemapId, Option } from '../map-options/basemap';

export function useBasemap() {
  const [mapBasemapId, setBasemapId] = useState<BasemapId>(BASEMAP_ID_DEFAULT);
  const [labelsOption, setLabelsOption] = useState(true);
  const [boundariesOption, setBoundariesOption] = useState(true);
  const onOptionChange = useCallback(
    (option: Option, value: boolean) => {
      if (option === 'labels') {
        setLabelsOption(value);
      } else {
        setBoundariesOption(value);
      }
    },
    [setLabelsOption, setBoundariesOption]
  );

  return {
    mapBasemapId,
    setBasemapId,
    labelsOption,
    boundariesOption,
    onOptionChange
  };
}
