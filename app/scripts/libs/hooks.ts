import { DevseedUiThemeProvider } from '../theme-provider';
import { VedaUIProvider } from '$context/veda-ui-provider';
import ReactQueryProviderDefault from '$context/react-query';
import useTimelineDatasetAtomDefault from '$components/exploration/hooks/use-timeline-dataset-atom';
import { useFiltersWithQS } from '$components/common/catalog/controls/hooks/use-filters-with-query';

const ReactQueryProvider = ReactQueryProviderDefault;
const useTimelineDatasetAtom = useTimelineDatasetAtomDefault;

export {
  DevseedUiThemeProvider,
  VedaUIProvider,
  ReactQueryProvider,
  useTimelineDatasetAtom,
  useFiltersWithQS
};
