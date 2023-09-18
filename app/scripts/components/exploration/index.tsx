import React, { useCallback, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';

import { MockControls } from './datasets-mock';
import Timeline from './components/timeline/timeline';
import { DatasetSelectorModal } from './components/dataset-selector-modal';

import { LayoutProps } from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import { PageMainContent } from '$styles/page';
import Map, { Compare } from '$components/common/map';
import { Basemap } from '$components/common/map/style-generators/basemap';
import GeocoderControl from '$components/common/map/controls/geocoder';
import {
  NavigationControl,
  ScaleControl
} from '$components/common/map/controls';
import MapCoordsControl from '$components/common/map/controls/coords';
import MapOptionsControl from '$components/common/map/controls/options';
import { projectionDefault } from '$components/common/map/controls/map-options/projections';
import { useBasemap } from '$components/common/map/controls/hooks/use-basemap';
import { RasterTimeseries } from '$components/common/map/style-generators/raster-timeseries';

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
    padding: 0.8rem 0 0.25rem;
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
  const [compare, setCompare] = useState(true);
  const [datasetModalRevealed, setDatasetModalRevealed] = useState(true);

  const openModal = useCallback(() => setDatasetModalRevealed(true), []);
  const closeModal = useCallback(() => setDatasetModalRevealed(false), []);

  const [projection, setProjection] = useState(projectionDefault);

  const {
    mapBasemapId,
    setBasemapId,
    labelsOption,
    boundariesOption,
    onOptionChange
  } = useBasemap();

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
              <Map id='exploration' projection={projection}>
                {/* Map layers */}
                <Basemap
                  basemapStyleId={mapBasemapId}
                  labelsOption={labelsOption}
                  boundariesOption={boundariesOption}
                />
                <RasterTimeseries
                  id='test'
                  stacCol='nightlights-hd-monthly'
                  date={new Date('2019-01-01')}
                  zoomExtent={[4, 16]}
                  sourceParams={{
                    bidx: 1,
                    colormap_name: 'inferno',
                    rescale: [0, 255]
                  }}
                />
                {/* Map controls */}
                <GeocoderControl />
                <NavigationControl />
                <ScaleControl />
                <MapCoordsControl />
                <MapOptionsControl
                  projection={projection}
                  onProjectionChange={setProjection}
                  basemapStyleId={mapBasemapId}
                  onBasemapStyleIdChange={setBasemapId}
                  labelsOption={labelsOption}
                  boundariesOption={boundariesOption}
                  onOptionChange={onOptionChange}
                />
                {compare && (
                  // Compare map layers
                  <Compare>
                    <Basemap basemapStyleId={mapBasemapId} />
                    <RasterTimeseries
                      id='test2'
                      stacCol='nightlights-hd-monthly'
                      date={new Date('2020-04-01')}
                      zoomExtent={[4, 16]}
                      sourceParams={{
                        bidx: 1,
                        colormap_name: 'inferno',
                        rescale: [0, 255]
                      }}
                      hidden={true}
                    />
                  </Compare>
                )}
              </Map>
              <MockControls
                comparing={compare}
                onCompareClick={() => setCompare((v) => !v)}
              />
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
