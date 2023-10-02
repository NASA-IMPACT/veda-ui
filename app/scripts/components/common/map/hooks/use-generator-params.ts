import { useMemo } from 'react';
import { BaseGeneratorParams } from '../types';

export default function useGeneratorParams(props: BaseGeneratorParams) {
  return useMemo(() => {
    return props;
    // Memoize only required abse params
  }, [props.generatorOrder, props.hidden, props.opacity]);
}
