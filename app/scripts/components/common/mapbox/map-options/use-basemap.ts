import { useCallback, useState } from 'react';
import { Option } from './basemaps';

export function useBasemap() {
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
    labelsOption,
    boundariesOption,
    onOptionChange
  };
}
