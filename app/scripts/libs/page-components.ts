import CatalogContentDefault from '$components/common/catalog/catalog-content';
import ExplorationAndAnalysisDefault from '$components/exploration';
// DataSelectorModal needs to be paried with E&A, so putting this for now.
import { DatasetSelectorModal } from '$components/exploration/components/dataset-selector-modal';
import StoriesHubContentDefault from '$components/stories/hub/hub-content';

const CatalogContent = CatalogContentDefault;
const ExplorationAndAnalysis = ExplorationAndAnalysisDefault;
const StoriesHubContent = StoriesHubContentDefault;

export {
  CatalogContent,
  ExplorationAndAnalysis,
  StoriesHubContent,
  DatasetSelectorModal
};
