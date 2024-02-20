import React, { useCallback, useEffect, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import styled from 'styled-components';
import { useAtomValue, useSetAtom } from 'jotai';
import { TourProvider } from '@reactour/tour';
import { themeVal } from '@devseed-ui/theme-provider';

import Timeline from './components/timeline/timeline';
import { ExplorationMap } from './components/map';
import { DatasetSelectorModal } from './components/dataset-selector-modal';
import { timelineDatasetsAtom } from './atoms/datasets';
import { PopoverTourComponent, TourManager } from './tour-manager';
import { useAnalysisController } from './hooks/use-analysis-data-request';
import { CLEAR_LOCATION, urlAtom } from '$utils/params-location-atom/url';

import { LayoutProps } from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import { PageMainContent } from '$styles/page';

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
  const datasets = useAtomValue(timelineDatasetsAtom);
  const [datasetModalRevealed, setDatasetModalRevealed] = useState(
    !datasets.length
  );

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
            <Panel maxSize={75} className='panel'>
              <ExplorationMap />
            </Panel>
            <PanelResizeHandle className='resize-handle' />
            <Panel maxSize={75} className='panel panel-timeline'>
              <Timeline onDatasetAddClick={openModal} />
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
