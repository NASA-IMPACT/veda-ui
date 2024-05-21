import React, { useCallback, useEffect, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import styled from 'styled-components';
import { useAtomValue, useSetAtom } from 'jotai';
import { TourProvider } from '@reactour/tour';
import { themeVal } from '@devseed-ui/theme-provider';
import { DevTools } from 'jotai-devtools';

import { TimelineDatasetStatus } from './types.d.ts';
import Timeline from './components/timeline/timeline';
import { ExplorationMap } from './components/map';
import { DatasetSelectorModal } from './components/dataset-selector-modal';
import { timelineDatasetsAtom } from './atoms/datasets';
import { PopoverTourComponent, TourManager } from './tour-manager';
import { useAnalysisController } from './hooks/use-analysis-data-request';
import { useReconcileWithStacMetadata } from './hooks/use-stac-metadata-datasets';
import { selectedCompareDateAtom, selectedDateAtom } from './atoms/dates';
import { CLEAR_LOCATION, urlAtom } from '$utils/params-location-atom/url';

import { LayoutProps } from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import { PageMainContent } from '$styles/page';
import { usePreviousValue } from '$utils/use-effect-previous';
import { projectionDefault } from '$components/common/map/controls/map-options/projections';
import { useBasemap } from '$components/common/map/controls/hooks/use-basemap';

const Container = styled.div`
  display: flex;
  flex-flow: column;
  flex-grow: 1;

  .panel-wrapper {
    flex-grow: 1;
  }

  .panel {
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .panel-timeline {
    box-shadow: 0 -1px 0 0 ${themeVal('color.base-100')};
  }

  .resize-handle {
    flex: 0;
    position: relative;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 5rem;
    margin: 0 auto -1.25rem auto;
    padding: 0rem 0 0.25rem;
    z-index: 1;

    ::before {
      content: '';
      display: block;
      width: 2rem;
      background: ${themeVal('color.base-200')};
      height: 0.25rem;
      border-radius: ${themeVal('shape.ellipsoid')};
    }
  }
`;

const tourProviderStyles = {
  popover: (base) => ({
    ...base,
    padding: '0',
    background: 'none'
  })
};

function Exploration() {
  const [projection, setProjection] = useState(projectionDefault);

  const {
    mapBasemapId,
    setBasemapId,
    labelsOption,
    boundariesOption,
    onOptionChange
  } = useBasemap();

  const datasets = useAtomValue(timelineDatasetsAtom);
  const setDatasets = useSetAtom(timelineDatasetsAtom);

  useReconcileWithStacMetadata(datasets, setDatasets);

  const selectedDay = useAtomValue(selectedDateAtom);
  const selectedCompareDay = useAtomValue(selectedCompareDateAtom);

  // Different datasets may have a different default projection.
  // When datasets are selected the first time, we set the map projection to the
  // first dataset's projection.
  const prevDatasetCount = usePreviousValue(datasets.length);

  useEffect(() => {
    if (!prevDatasetCount && datasets.length > 0) {
      setProjection(datasets[0].data.projection ?? projectionDefault);
    }
  }, [datasets, prevDatasetCount]);

  // If all the datasets are changed through the modal, we also want to update
  // the map projection, since it is as if the datasets were selected for the
  // first time.
  // The only case where we don't want to update the projection is when not all
  // datasets are changed, because it is not possible to know which projection
  // to use.
  const prevDatasetsIds = usePreviousValue(datasets.map((d) => d.data.id));

  useEffect(() => {
    if (!prevDatasetsIds) return;

    const newDatasetsIds = datasets.map((d) => d.data.id);
    const hasSameId = newDatasetsIds.some((id) => prevDatasetsIds.includes(id));

    if (!hasSameId && datasets.length > 0) {
      setProjection(datasets[0].data.projection ?? projectionDefault);
    }
  }, [prevDatasetsIds, datasets]);

  const onStyleUpdate = useCallback(
    (style) => {
      const updatedDatasets = datasets.map((dataset) => {
        // Skip non loaded datasets
        if (dataset.status !== TimelineDatasetStatus.SUCCESS) return dataset;

        // Check if there's layer information for this dataset.
        const layerMetadata = style.layers.find(
          (l) => l.metadata?.id === dataset.data.id
        );

        // Skip if no metadata.
        if (!layerMetadata) return dataset;

        const currentMeta = dataset.meta ?? {};

        return {
          ...dataset,
          meta: {
            ...currentMeta,
            tileUrls: {
              wmtsTileUrl: layerMetadata.metadata.wmtsTileUrl,
              xyzTileUrl: layerMetadata.metadata.xyzTileUrl
            }
          }
        };
      });

      setDatasets(updatedDatasets);
    },
    [datasets, setDatasets]
  );

  const [datasetModalRevealed, setDatasetModalRevealed] = useState(
    !datasets.length
  );
  // @TECH-DEBT: panelHeight  needs to be passed to work around Safari CSS
  const [panelHeight, setPanelHeight] = useState(0);

  const openModal = useCallback(() => setDatasetModalRevealed(true), []);
  const closeModal = useCallback(() => setDatasetModalRevealed(false), []);

  const setUrl = useSetAtom(urlAtom);
  const { reset: resetAnalysisController } = useAnalysisController();
  // Reset atoms when leaving the page.
  useEffect(() => {
    return () => {
      resetAnalysisController();
      setUrl(CLEAR_LOCATION);
    };
  }, []);

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
        <Container>
          <PanelGroup direction='vertical' className='panel-wrapper'>
            <Panel
              maxSize={75}
              className='panel'
              onResize={(size: number) => {
                setPanelHeight(size);
              }}
            >
              <ExplorationMap
                datasets={datasets}
                selectedDay={selectedDay}
                selectedCompareDay={selectedCompareDay}
                mapBasemapId={mapBasemapId}
                setBasemapId={setBasemapId}
                labelsOption={labelsOption}
                boundariesOption={boundariesOption}
                onOptionChange={onOptionChange}
                onStyleUpdate={onStyleUpdate}
                projection={projection}
                setProjection={setProjection}
              />
            </Panel>
            <PanelResizeHandle className='resize-handle' />
            <Panel maxSize={75} className='panel panel-timeline'>
              <Timeline
                onDatasetAddClick={openModal}
                panelHeight={panelHeight}
              />
            </Panel>
          </PanelGroup>
        </Container>
        <DatasetSelectorModal
          revealed={datasetModalRevealed}
          close={closeModal}
        />
      </PageMainContent>
    </TourProvider>
  );
}
export default Exploration;
