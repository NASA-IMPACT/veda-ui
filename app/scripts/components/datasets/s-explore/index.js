import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import useQsStateCreator from 'qs-state-hook';
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
import { useEffectPrevious } from '$utils/use-effect-previous';
import { userTzDate2utcString, utcString2userTzDate } from '$utils/date';
import { useDatasetAsyncLayers } from '$context/layer-data';
import {
  checkLayerLoadStatus,
  resolveLayerTemporalExtent
} from '$components/common/mapbox/layers/utils';

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

function getDatePickerView(timeDensity) {
  // If the data's time density is monthly only allow the user to select a month
  // by setting the picker to a early view.
  if (timeDensity === 'month') {
    return 'year';
  }

  return 'month';
}

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
    // The Date picker returns the selected date at the beginning of the day for
    // the user's timezone. This becomes a problem when converting to string.
    // For example, being in the West European Time when we select September
    // 1st the date is initialized as: Wed Sep 01 2021 00:00:00 GMT+0100
    // which means that if we convert to string using toISOString() it actually
    // is 2021-08-31T23:00:00.000Z. Through toUtcDateString we avoid this.
    dehydrator: (v) => (v ? userTzDate2utcString(v) : null),
    // The same problem happens when reading the date. Using utcDate handles the
    // reverse issue.
    hydrator: (v) => {
      const d = utcString2userTzDate(v);
      return isNaN(d.getTime()) ? null : d;
    }
  });

  // END QsState setup
  /** *********************************************************************** */

  // Get the dataset's layers.
  // Since async data has to be loaded, each layer is in an async format which
  // has the following structure:
  // Array of { baseLayer, compareLayer }
  // See the type definitions in the layer-data context for more.
  const asyncLayers = useDatasetAsyncLayers(dataset.data.id);

  // Current active layer if is loaded, undefined otherwise.
  const activeLayer = useMemo(() => {
    return asyncLayers.find((l) => {
      const status = checkLayerLoadStatus(l);
      return status === 'succeeded' && l.baseLayer.data.id === selectedLayerId;
    });
  }, [asyncLayers, selectedLayerId]);

  // Get the active layer timeseries data so we can render the date selector.
  const activeLayerTimeseries = useMemo(
    () => (activeLayer ? activeLayer.baseLayer.data.timeseries : null),
    [activeLayer]
  );

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
  // the domain. Since the selected date is stored in the url we need to make
  // sure it actually exists.
  useEffectPrevious(
    ([prevAvailableDates] = []) => {
      const currDates = JSON.stringify(availableActiveLayerDates);
      const prevDates = JSON.stringify(prevAvailableDates);
      if (availableActiveLayerDates && currDates !== prevDates) {
        // Since the available dates changes, check if the currently selected
        // one is valid.
        const validDate = !!availableActiveLayerDates.find(
          (d) => d.getTime() === selectedDatetime.getTime()
        );

        if (!validDate) {
          setSelectedDatetime(availableActiveLayerDates[0]);
        }
      }
    },
    [availableActiveLayerDates, selectedDatetime, setSelectedDatetime]
  );

  const datePickerConfirm = useCallback(
    (range) => setSelectedDatetime(range.start),
    [setSelectedDatetime]
  );

  const datePickerValue = useMemo(
    () => ({
      end: selectedDatetime,
      start: selectedDatetime
    }),
    [selectedDatetime]
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
                {activeLayerTimeseries && (
                  <PanelWidget>
                    <PanelWidgetHeader>
                      <PanelWidgetTitle>Date</PanelWidgetTitle>
                    </PanelWidgetHeader>
                    <PanelWidgetBody>
                      <DatePicker
                        id='date-picker'
                        alignment='left'
                        direction='down'
                        view={getDatePickerView(
                          activeLayerTimeseries.timeDensity
                        )}
                        max={availableActiveLayerDates?.last}
                        min={availableActiveLayerDates?.[0]}
                        onConfirm={datePickerConfirm}
                        value={datePickerValue}
                      />
                    </PanelWidgetBody>
                  </PanelWidget>
                )}
                <PanelWidget>
                  <PanelWidgetHeader>
                    <PanelWidgetTitle>Layers</PanelWidgetTitle>
                  </PanelWidgetHeader>
                  <PanelWidgetBody>
                    <DatasetLayers
                      asyncLayers={asyncLayers}
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
