import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';
import { CollecticonSlidersHorizontal } from '@devseed-ui/collecticons';
import { DatePicker } from '@devseed-ui/date-picker';

import { resourceNotFound } from '$components/uhoh';
import PageLocalNav, {
  DatasetsLocalMenu
} from '$components/common/page-local-nav';
import { PageMainContent } from '$styles/page';
import {
  Panel,
  PanelActions,
  PanelBody,
  PanelHeader,
  PanelHeadline,
  PanelInner,
  PanelTitle,
  PanelToggle,
  PanelWidget,
  PanelWidgetBody,
  PanelWidgetHeader,
  PanelWidgetTitle,
  PANEL_REVEAL_DURATION
} from '$styles/panel';
import { LayoutProps } from '$components/common/layout-root';
import MapboxMap from '$components/common/mapbox';
import DatasetLayers from './dataset-layers';

import { useThematicArea, useThematicAreaDataset } from '$utils/thematics';
import { useMediaQuery } from '$utils/use-media-query';
import { thematicDatasetsPath } from '$utils/routes';
import { useDatasetLayers } from '$context/layer-data';

const Explorer = styled.div`
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-flow: row nowrap;
  overflow: hidden;
`;

const Carto = styled.div`
  position: relative;
  flex-grow: 1;
  background: ${themeVal('color.surface')};

  ${MapboxMap} {
    position: absolute;
    inset: 0;
  }
`;

function DatasetsExplore() {
  const mapboxRef = useRef(null);
  const thematic = useThematicArea();
  const dataset = useThematicAreaDataset();

  const { isMediumDown } = useMediaQuery();

  const [panelRevealed, setPanelRevealed] = useState(!isMediumDown);

  const panelBodyRef = useRef(null);
  // Click listener for the whole body panel so we can close it when clicking
  // the overlay on medium down media query.
  const onPanelClick = useCallback(
    (e) => {
      if (isMediumDown && !panelBodyRef.current?.contains(e.target)) {
        setPanelRevealed(false);
      }
    },
    [isMediumDown]
  );

  // Close panel when media query changes.
  useEffect(() => {
    setPanelRevealed(!isMediumDown);
  }, [isMediumDown]);
  // When the panel changes resize the map after a the animation finishes.
  useEffect(() => {
    const id = setTimeout(
      () => mapboxRef.current?.resize(),
      PANEL_REVEAL_DURATION
    );
    return () => id && clearTimeout(id);
  }, [panelRevealed]);

  const [params, setParams] = useState({
    layer: null,
    date: null
  });

  // const asyncLayers = useDatasetLayers(dataset.data.id);
  // console.log("🚀 ~ file: index.js ~ line 90 ~ DatasetsExplore ~ asyncLayers", asyncLayers);

  if (!thematic || !dataset) throw resourceNotFound();

  return (
    <>
      <LayoutProps title={dataset.data.name} hideFooter />
      <PageLocalNav
        parentName='Dataset'
        parentLabel='Datasets'
        parentTo={thematicDatasetsPath(thematic)}
        items={thematic.data.datasets}
        currentId={dataset.data.id}
        localMenuCmp={
          <DatasetsLocalMenu thematic={thematic} dataset={dataset} />
        }
      />
      <PageMainContent>
        <Explorer>
          <Panel revealed={panelRevealed} onClick={onPanelClick}>
            <PanelInner ref={panelBodyRef}>
              <PanelHeader>
                <PanelHeadline>
                  <PanelTitle>Controls</PanelTitle>
                </PanelHeadline>
                <PanelActions>
                  <PanelToggle
                    variation='primary-fill'
                    fitting='skinny'
                    onClick={() => setPanelRevealed((v) => !v)}
                    active={panelRevealed}
                  >
                    <CollecticonSlidersHorizontal
                      title='Toggle panel visibility'
                      meaningful
                    />
                  </PanelToggle>
                </PanelActions>
              </PanelHeader>
              <PanelBody>
                <PanelWidget>
                  <PanelWidgetHeader>
                    <PanelWidgetTitle>Date</PanelWidgetTitle>
                  </PanelWidgetHeader>
                  <PanelWidgetBody>
                    <DatePicker
                      id='date-picker'
                      alignment='left'
                      direction='down'
                      max={null}
                      min={null}
                      // onConfirm={}
                      value={{
                        end: null,
                        start: null
                      }}
                    />
                  </PanelWidgetBody>
                </PanelWidget>
                <PanelWidget>
                  <PanelWidgetHeader>
                    <PanelWidgetTitle>Layers</PanelWidgetTitle>
                  </PanelWidgetHeader>
                  <PanelWidgetBody>
                    <DatasetLayers dataset={dataset.data} />
                  </PanelWidgetBody>
                </PanelWidget>
              </PanelBody>
            </PanelInner>
          </Panel>
          <Carto>
            <MapboxMap
              ref={mapboxRef}
              datasetId={dataset.data.id}
              layerId={null}
              date={null}
              isComparing={null}
            />
          </Carto>
        </Explorer>
      </PageMainContent>
    </>
  );
}

export default DatasetsExplore;
