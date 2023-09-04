import React, { useCallback, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';

import { MockControls } from './datasets-mock';
import Timeline from './components/timeline/timeline';
import { DatasetSelectorModal } from './components/dataset-selector-modal';
import { useStacMetadataOnDatasets } from './hooks/use-stac-metadata-datasets';

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
    padding: 0.25rem 0;
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

function Exploration() {
  const [datasetModalRevealed, setDatasetModalRevealed] = useState(true);

  const openModal = useCallback(() => setDatasetModalRevealed(true), []);
  const closeModal = useCallback(() => setDatasetModalRevealed(false), []);

  useStacMetadataOnDatasets();

  return (
    <>
      <LayoutProps
        title='Exploration'
        description='Explore and analyze datasets'
        hideFooter
      />
      <PageMainContent>
        <PageHero title='Exploration' isHidden />

        <Container>
          <PanelGroup direction='vertical' className='panel-wrapper'>
            <Panel maxSize={75} className='panel'>
              <div>Top</div>
              <MockControls />
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
    </>
  );
}
export default Exploration;
