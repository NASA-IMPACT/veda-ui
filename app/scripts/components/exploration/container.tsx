import React, { useState } from 'react';
import { TourProvider } from '@reactour/tour';
import { Link } from 'react-router-dom';
import { DevTools } from 'jotai-devtools';
import { useAtom, useSetAtom } from 'jotai';
import { PopoverTourComponent, TourManager } from './tour-manager';

import { DatasetSelectorModal } from './components/dataset-selector-modal';
import { allExploreDatasets } from './data-utils';
import useTimelineDatasetAtom from './hooks/use-timeline-dataset-atom';
import { externalDatasetsAtom } from './atoms/datasetLayers';
import ExplorationAndAnalysis from '.';
import { urlAtom } from '$utils/params-location-atom/url';
import { PageMainContent } from '$styles/page';

import { LayoutProps } from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import { DATASETS_PATH, EXPLORATION_PATH } from '$utils/routes';

/**
 * @VEDA2-REFACTOR-WORK
 *
 * @NOTE: This container component serves as a wrapper for the purpose of data management, this is ONLY to support current instances.
 * veda2 instances can just use the direct component, 'ExplorationAndAnalysis', and manage data directly in their page views
 */

const tourProviderStyles = {
  popover: (base) => ({
    ...base,
    padding: '0',
    background: 'none'
  })
};

export default function ExplorationAndAnalysisContainer() {
  const setExternalDatasets = useSetAtom(externalDatasetsAtom);
  setExternalDatasets(allExploreDatasets);
  const [timelineDatasets, setTimelineDatasets] = useTimelineDatasetAtom();
  const [datasetModalRevealed, setDatasetModalRevealed] = useState(
    !timelineDatasets.length
  );

  // @NOTE: When Exploration page is preloaded (ex. Linked with react-router)
  // atomWithLocation gets initialized outside of Exploration page and returns the previous page's value
  // We check if url Atom actually returns the values for exploration page here.
  const [currentUrl] = useAtom(urlAtom);
  if (!currentUrl.pathname?.includes(EXPLORATION_PATH)) return null;

  const openModal = () => setDatasetModalRevealed(true);
  const closeModal = () => setDatasetModalRevealed(false);

  return (
    <TourProvider
      steps={[]}
      styles={tourProviderStyles}
      ContentComponent={PopoverTourComponent}
    >
      <DevTools />
      <LayoutProps
        title='Exploration'
        description='Explore and analyze datasets'
        hideFooter
      />
      <TourManager />
      <PageMainContent>
        <PageHero title='Exploration' isHidden />
        <ExplorationAndAnalysis
          datasets={timelineDatasets}
          setDatasets={setTimelineDatasets}
          openDatasetsSelectionModal={openModal}
        />
        <DatasetSelectorModal
          revealed={datasetModalRevealed}
          close={closeModal}
          datasets={allExploreDatasets}
          timelineDatasets={timelineDatasets}
          setTimelineDatasets={setTimelineDatasets}
          emptyStateContent={
            <>
              <p>There are no datasets to show with the selected filters.</p>
              <p>
                This tool allows the exploration and analysis of time-series
                datasets in raster format. For a comprehensive list of available
                datasets, please visit the{' '}
                <Link to={DATASETS_PATH}>Data Catalog</Link>.
              </p>
            </>
          }
        />
      </PageMainContent>
    </TourProvider>
  );
}
