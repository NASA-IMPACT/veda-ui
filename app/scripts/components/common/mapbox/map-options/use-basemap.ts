import { useCallback, useState } from 'react';
import { BasemapId, Option } from './basemaps';

export function useBasemap() {
  const [basemapStyleId, setBasemapStyleId] = useState<BasemapId>('satellite');

  const onBasemapStyleIdChange = useCallback((basemapId) => {
    setBasemapStyleId(basemapId);
  }, []);

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
    basemapStyleId,
    onBasemapStyleIdChange,
    labelsOption,
    boundariesOption,
    onOptionChange
  };
}
