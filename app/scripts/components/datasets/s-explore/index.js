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
import { glsp, themeVal, truncated } from '@devseed-ui/theme-provider';
import {
  CollecticonChevronDownSmall,
  CollecticonChevronUpSmall,
  CollecticonExpandFromLeft,
  CollecticonShrinkToLeft,
  CollecticonSwapHorizontal
} from '@devseed-ui/collecticons';
import { DatePicker } from '@devseed-ui/date-picker';
import { Toolbar, ToolbarButton } from '@devseed-ui/toolbar';
import { Heading } from '@devseed-ui/typography';

import { resourceNotFound } from '$components/uhoh';
import PageLocalNav, {
  DatasetsLocalMenu
} from '$components/common/page-local-nav';
import { LayoutProps } from '$components/common/layout-root';
import MapboxMap from '$components/common/mapbox';
import PageHero from '$components/common/page-hero';
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
  PANEL_REVEAL_DURATION,
  WidgetItemHeader,
  WidgetItemHeadline,
  WidgetItemHGroup
} from '$styles/panel';
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
import { variableGlsp } from '$styles/variable-utils';
import { S_SUCCEEDED } from '$utils/status';

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

    .mapboxgl-ctrl-top-left {
      margin-top: calc(2rem + ${variableGlsp(0.5)});
    }
  }
`;

const HeadingButton = styled.button`
  appearance: none;
  max-width: 100%;
  position: relative;
  display: flex;
  gap: ${glsp(0.25)};
  align-items: center;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  color: currentColor;
  font-weight: bold;
  text-decoration: none;
  text-align: left;
  transition: all 0.32s ease 0s;

  &:hover {
    opacity: 0.64;
  }

  svg {
    flex-shrink: 0;
  }

  > span {
    ${truncated()}
  }
`;

function getDatePickerView(timeDensity) {
  const view = {
    day: 'month',
    // If the data's time density is yearly only allow the user to select a year
    // by setting the picker to a decade view.
    month: 'year',
    // If the data's time density is monthly only allow the user to select a
    // month by setting the picker to a early view.
    year: 'decade'
  }[timeDensity];

  return view || 'month';
}

function DatasetsExplore() {
  const mapboxRef = useRef(null);
  const thematic = useThematicArea();
  const dataset = useThematicAreaDataset();

  if (!dataset.data.layers?.length) {
    throw new Error(
      `There are no layers defined in dataset ${dataset.data.id}`
    );
  }

  /** *********************************************************************** */
  // Panel relate stuff to ensure it opens and closes and this action resizes
  // the map.
  const panelBodyRef = useRef(null);
  const { isMediumDown } = useMediaQuery();
  const [panelRevealed, setPanelRevealed] = useState(!isMediumDown);

  // Click listener for the whole body panel so we can close it when clicking
  // the overlay on medium down media query.
  // The overlay is created with an ::after so it can't be targeted directly,
  // but it is still part of the panel.
  const onPanelClick = useCallback(
    (e) => {
      const thePanel = e.currentTarget;
      // For the panel to close the click must be done on an element inside the
      // panel. This avoids that the panel closes when clicking the date picker,
      // since it is not inside the panel (portaled to body).
      const isSelfOrContained = e.target === thePanel;

      if (
        isMediumDown &&
        isSelfOrContained &&
        !panelBodyRef.current?.contains(e.target)
      ) {
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

  const [selectedLayerId, setSelectedLayerId] = useQsState.memo(
    {
      key: 'layer',
      default: dataset.data.layers[0].id
    },
    [dataset]
  );

  const [mapPosition, setMapPosition] = useQsState.memo({
    key: 'position',
    default: null,
    hydrator: (v) => {
      if (!v) return null;
      const [lng, lat, zoom] = v.split('|').map(Number);
      return { lng, lat, zoom };
    },
    dehydrator: (v) => {
      if (!v) return null;
      const { lng, lat, zoom } = v;
      return [lng, lat, zoom].join('|');
    }
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

  const [isComparing, setComparing] = useQsState.memo({
    key: 'comparing',
    default: false,
    hydrator: (v) => v === 'true',
    dehydrator: (v) => v.toString()
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
      return status === S_SUCCEEDED && l.baseLayer.data.id === selectedLayerId;
    });
  }, [asyncLayers, selectedLayerId]);

  // Get the active layer timeseries data so we can render the date selector.
  const activeLayerTimeseries = useMemo(
    () => (activeLayer ? activeLayer.baseLayer.data.timeseries : null),
    [activeLayer]
  );

  // Available dates for the baseLayer of the currently active layer.
  // null if there's no active layer or it hasn't loaded yet.
  const availableActiveLayerDates = useMemo(() => {
    if (!activeLayer) return null;
    const { baseLayer, compareLayer } = activeLayer;

    if (isComparing && compareLayer) {
      const bTimeDensity = baseLayer.data.timeseries.timeDensity;
      const cTimeDensity = compareLayer.data.timeseries.timeDensity;

      if (bTimeDensity !== cTimeDensity) {
        throw new Error(`Failed to enable compare.
Time density value must be the same for both layers.
Base layer: ${baseLayer.data.id} >> ${bTimeDensity}
Compare layer: ${compareLayer.data.id} >> ${cTimeDensity}
`);
      }
    }

    return resolveLayerTemporalExtent(activeLayer.baseLayer.data);
  }, [activeLayer, isComparing]);

  useEffect(() => {
    if (activeLayer && !activeLayer.compareLayer) {
      setComparing(false);
    }
  }, [activeLayer, setComparing]);

  // When the available dates for the selected layer change, check if the
  // currently selected date is a valid one, otherwise reset to the first one in
  // the domain. Since the selected date is stored in the url we need to make
  // sure it actually exists.
  useEffectPrevious(
    ([prevAvailableDates]) => {
      const currDates = JSON.stringify(availableActiveLayerDates);
      const prevDates = JSON.stringify(prevAvailableDates);
      if (availableActiveLayerDates && currDates !== prevDates) {
        // Since the available dates changes, check if the currently selected
        // one is valid.
        const validDate = !!availableActiveLayerDates.find(
          (d) => d.getTime() === selectedDatetime?.getTime()
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
      <LayoutProps
        title={`${dataset.data.name} Exploration`}
        description={dataset.data.description}
        thumbnail={dataset.data.media?.src}
        hideFooter
      />
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
        <PageHero title={`${dataset.data.name} Exploration`} isHidden />
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
                  >
                    {panelRevealed ? (
                      <CollecticonShrinkToLeft
                        title='Toggle panel visibility'
                        meaningful
                      />
                    ) : (
                      <CollecticonExpandFromLeft
                        title='Toggle panel visibility'
                        meaningful
                      />
                    )}
                  </PanelToggle>
                </PanelActions>
              </PanelHeader>
              <PanelBody>
                <PanelWidget>
                  <PanelWidgetHeader>
                    <PanelWidgetTitle>Date</PanelWidgetTitle>
                  </PanelWidgetHeader>
                  <PanelWidgetBody>
                    <WidgetItemHeader>
                      <WidgetItemHGroup>
                        <WidgetItemHeadline>
                          {activeLayerTimeseries && (
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
                              renderTriggerElement={(
                                { active, className, ...rest },
                                label
                              ) => {
                                return (
                                  <Heading as='h4' size='xmall'>
                                    <HeadingButton {...rest} as='button'>
                                      <span>{label}</span>{' '}
                                      {active ? (
                                        <CollecticonChevronUpSmall />
                                      ) : (
                                        <CollecticonChevronDownSmall />
                                      )}
                                    </HeadingButton>
                                  </Heading>
                                );
                              }}
                            />
                          )}
                        </WidgetItemHeadline>
                        <Toolbar size='small'>
                          <ToolbarButton
                            variation='base-text'
                            active={isComparing}
                            disabled={!activeLayer?.compareLayer}
                            onClick={() => setComparing(!isComparing)}
                          >
                            <CollecticonSwapHorizontal
                              title='Compare to'
                              meaningful
                            />
                            Baseline
                          </ToolbarButton>
                        </Toolbar>
                      </WidgetItemHGroup>
                    </WidgetItemHeader>
                  </PanelWidgetBody>
                </PanelWidget>
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
              withGeocoder
              datasetId={dataset.data.id}
              layerId={activeLayer?.baseLayer.data?.id}
              date={selectedDatetime}
              isComparing={isComparing}
              initialPosition={mapPosition}
              onPositionChange={setMapPosition}
            />
          </Carto>
        </Explorer>
      </PageMainContent>
    </>
  );
}

export default DatasetsExplore;
