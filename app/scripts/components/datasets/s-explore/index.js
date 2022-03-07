import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';
import useQsStateCreator from 'qs-state-hook';
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
import { useLocation, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import {
  checkLayerLoadStatus,
  resolveLayerTemporalExtent
} from '$components/common/mapbox/layers/utils';
import { useEffectPrevious } from '$utils/use-effect-previous';

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

  /** *********************************************************************** */
  // Panel relate stuff to ensure it opens and closes and this action resizes
  // the map.
  const panelBodyRef = useRef(null);
  const { isMediumDown } = useMediaQuery();
  const [panelRevealed, setPanelRevealed] = useState(!isMediumDown);

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

  /** *********************************************************************** */
  // Setup Qs State to store data in the url's query string
  // react-router function to get the navigation.
  const navigate = useNavigate();
  const useQsState = useQsStateCreator({
    commit: navigate
  });

  const [selectedLayerId, setSelectedLayerId] = useQsState.memo({
    key: 'layer',
    default: null
  });

  const [selectedDatetime, setSelectedDatetime] = useQsState.memo({
    key: 'datetime',
    default: null,
    hydrator: (v) => {
      const d = new Date(v);
      return isNaN(d.getTime()) ? null : d;
    },
    dehydrator: (v) => (v ? v.toISOString() : null)
  });

  // END QsState setup
  /** *********************************************************************** */

  // Get the dataset's layers.
  // Since async data has to be loaded, each layer is in an async format which
  // has the following structure:
  // Array of { baseLayer, compareLayer }
  // See the type definitions in the layer-data context for more.
  const asyncLayers = useDatasetLayers(dataset.data.id);

  // Current active layer if is loaded, undefined otherwise.
  const activeLayer = useMemo(() => {
    return asyncLayers.find((l) => {
      const status = checkLayerLoadStatus(l);
      return status === 'succeeded' && l.baseLayer.data.id === selectedLayerId;
    });
  }, [asyncLayers, selectedLayerId]);

  // Available dates for the baseLayer of the currently active layer.
  // null if there's no active layer or it hasn't loaded yet.
  // TODO: How to handle intersection with the compareLayer domain.
  const availableActiveLayerDates = useMemo(
    () =>
      activeLayer
        ? resolveLayerTemporalExtent(activeLayer.baseLayer.data)
        : null,
    [activeLayer]
  );

  // When the available dates for the selected layer change, check if the
  // currently selected date is a valid one, otherwise reset to the first one in
  // the domain. Since the selected date it stored in the url we need to make
  // sure it actually exist.
  useEffectPrevious(
    ([prevDates] = []) => {
      const firstDomainDate = availableActiveLayerDates?.[0];
      const prevFirstDate = prevDates?.[0];
      if (firstDomainDate !== prevFirstDate) {
        // Since the available dates changes, check if the currently selected
        // one is valid.
        const validDate = !!availableActiveLayerDates.find(
          (d) => d.getTime() === selectedDatetime.getTime()
        );

        if (!validDate) {
          setSelectedDatetime(firstDomainDate);
        }
      }
    },
    [availableActiveLayerDates, selectedDatetime, setSelectedDatetime]
  );

  /** *********************************************************************** */
  // onAction callbacks
  // Callback for the dataset layers items in the side panel.
  const onLayerAction = useCallback(
    (action, payload) => {
      switch (action) {
        case 'layer.toggle':
          setSelectedLayerId(payload.id);
          break;
      }
    },
    [setSelectedLayerId]
  );
  // End onAction callback.
  /** *********************************************************************** */

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
                      max={availableActiveLayerDates?.last}
                      min={availableActiveLayerDates?.[0]}
                      onConfirm={useCallback(
                        (range) => setSelectedDatetime(range.start),
                        [setSelectedDatetime]
                      )}
                      value={useMemo(
                        () => ({
                          end: selectedDatetime,
                          start: selectedDatetime
                        }),
                        [selectedDatetime]
                      )}
                    />
                  </PanelWidgetBody>
                </PanelWidget>
                <PanelWidget>
                  <PanelWidgetHeader>
                    <PanelWidgetTitle>Layers</PanelWidgetTitle>
                  </PanelWidgetHeader>
                  <PanelWidgetBody>
                    <DatasetLayers
                      layers={asyncLayers}
                      selectedLayerId={selectedLayerId}
                      onAction={onLayerAction}
                    />
                  </PanelWidgetBody>
                </PanelWidget>
              </PanelBody>
            </PanelInner>
          </Panel>
          <Carto>
            <MapboxMap
              ref={mapboxRef}
              datasetId={dataset.data.id}
              layerId={activeLayer?.baseLayer.data?.id}
              date={selectedDatetime}
              isComparing={null}
            />
          </Carto>
        </Explorer>
      </PageMainContent>
    </>
  );
}

export default DatasetsExplore;
