import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DevTools } from 'jotai-devtools';
import { useAtom, useSetAtom } from 'jotai';

import { DatasetSelectorModal } from '$components/exploration/components/dataset-selector-modal';
import useTimelineDatasetAtom from '$components/exploration/hooks/use-timeline-dataset-atom';
import { externalDatasetsAtom } from '$components/exploration/atoms/datasetLayers';
import { viewModeAtom } from '$components/exploration/atoms/viewMode';
import ExplorationSimpleView from '$components/exploration/views/simple';
import ExplorationAndAnalysisDefaultView from '$components/exploration/views/default';
import { allExploreDatasets } from '$data-layer/datasets';
import { urlAtom } from '$utils/params-location-atom/url';
import { PageMainContent } from '$styles/page';
import { LayoutProps } from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import { DATASETS_PATH, EXPLORATION_PATH } from '$utils/routes';

/**
 * @LEGACY-SUPPORT
 *
 * @NOTE: This container component serves as a wrapper for the purpose of data management, this is ONLY to support current instances.
 * veda2 instances can just use the direct component, 'ExplorationAndAnalysis', and manage data directly in their page views
 */

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
  const [viewMode] = useAtom(viewModeAtom);

  if (!currentUrl.pathname?.includes(EXPLORATION_PATH)) return null;

  const openModal = () => setDatasetModalRevealed(true);
  const closeModal = () => setDatasetModalRevealed(false);

  return (
    <>
      <DevTools />
      <LayoutProps
        title='Exploration'
        description='Explore and analyze datasets'
        hideFooter
        {...(viewMode === 'simple' && { hideNav: true, hideHeader: true })}
      />
      <PageMainContent>
        <PageHero title='Exploration' isHidden />
        {viewMode === 'simple' ? (
          <ExplorationSimpleView datasets={timelineDatasets} />
        ) : (
          <>
            <ExplorationAndAnalysisDefaultView
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
                  <p>
                    There are no datasets to show with the selected filters.
                  </p>
                  <p>
                    This tool allows the exploration and analysis of time-series
                    datasets in raster format. For a comprehensive list of
                    available datasets, please visit the{' '}
                    <Link to={DATASETS_PATH}>Data Catalog</Link>.
                  </p>
                </>
              }
            />
          </>
        )}
      </PageMainContent>
    </>
  );
}
