import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import useQsStateCreator from 'qs-state-hook';
import { isSameDay } from 'date-fns';
import { themeVal } from '@devseed-ui/theme-provider';
import {
  CollecticonExpandFromLeft,
  CollecticonShrinkToLeft,
  CollecticonArrowLeft,
} from '@devseed-ui/collecticons';
import { ProjectionOptions } from 'veda';
import { FormSwitch } from '@devseed-ui/form';

import LayerVisibilityToggleButton from './layer-visibility-toggle';
import TileLinkButton from './tile-link';
import DatasetLayers from './dataset-layers';
import { PanelDateWidget } from './panel-date-widget';
import { DATASETS_PATH } from '$utils/routes';
import { resourceNotFound } from '$components/uhoh';
import { LayoutProps } from '$components/common/layout-root';
import MapboxMap, { MapboxMapRef } from '$components/common/mapbox';
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
  PANEL_REVEAL_DURATION
} from '$styles/panel';


import { useDataset } from '$utils/veda-data';
import { useMediaQuery } from '$utils/use-media-query';
import { useEffectPrevious } from '$utils/use-effect-previous';
import { userTzDate2utcString, utcString2userTzDate } from '$utils/date';
import { AsyncDatasetLayer, useDatasetAsyncLayers } from '$context/layer-data';
import {
  checkLayerLoadStatus,
  resolveLayerTemporalExtent
} from '$components/common/mapbox/layers/utils';
import { variableGlsp } from '$styles/variable-utils';
import { S_SUCCEEDED } from '$utils/status';
import { projectionDefault } from '$components/common/mapbox/map-options/utils';
import { NotebookConnectButton } from '$components/common/notebook-connect';
import { ExtendedStyle } from '$components/common/mapbox/layers/styles';
import {
  BasemapId,
  BASEMAP_ID_DEFAULT
} from '$components/common/mapbox/map-options/basemaps';

const BackLink = styled(Link)`
  display: flex;
  padding: ${variableGlsp(0.5)};
  font-size: 1rem;
  font-weight: ${themeVal('type.base.bold')};
  color: ${themeVal('color.link')};
  background-color: ${themeVal('color.surface')};
  cursor: pointer;

  & > svg {
    flex: 0 0 auto;
    margin: 0.25rem 0.5rem 0 0;
  }

  &:hover {
    opacity: 0.8;
  }
`;

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

const CustomControlWrapper = styled.div`
  position: absolute;
  right: ${variableGlsp()};
  top: ${variableGlsp()};
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: ${variableGlsp(0.5)};
`;

const DatesWrapper = styled.div`
  position: relative;
  z-index: 10;
  box-shadow: 0 1px 0 0 ${themeVal('color.base-100a')};
  > ${PanelWidget} {
    width: 100%;
    position: relative;
    z-index: 10;
    box-shadow: 0 -1px 0 0 ${themeVal('color.base-100a')};
  }
`;

const PositionPlaceHolderForScroll = styled.div`
  position: absolute;
  pointer-events: none;
  z-index: 1000;
  top: 0px;
  left: 0px;
  width: 1.5rem;
  height: 100%;
  background: linear-gradient(
    to left,
    rgba(255, 255, 255, 0) 0%,
    rgb(255, 255, 255) 100%
  );
`;

const ScrollArea = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
`;

const ScrollAreaInner = styled.div`
  position: absolute;
  inset: 0px;
  overflow-y: auto;
`;

const isSelectedDateValid = (dateList, selectedDate) => {
  if (dateList) {
    // Since the available dates changes, check if the currently selected
    // one is valid.
    const validDate = !!dateList.find(
      // Only check if the date of the selected date is in the range.
      // Because Dashboard can only provide daily level selection.
      (d) => isSameDay(new Date(d), new Date(selectedDate))
    );
    return !!validDate;
  }
  return true;
};

const getInitialDate = (dateList, initialDatetime) => {
  if (!initialDatetime || initialDatetime === 'oldest') {
    return dateList[0];
  }

  if (initialDatetime === 'newest') {
    return dateList.last;
  }

  const initialDate = utcString2userTzDate(initialDatetime);
  // Reuse isSelectedDateValid function.
  return isSelectedDateValid(dateList, initialDate) ? initialDate : dateList[0];
};

const useValidSelectedDate = (
  dateList,
  selectedDate,
  initialDatetime,
  setDate
) => {
  useEffect(() => {
    if (!isSelectedDateValid(dateList, selectedDate)) {
      setDate(getInitialDate(dateList, initialDatetime));
    }
  }, [dateList, selectedDate, initialDatetime, setDate]);
};

const useValidSelectedCompareDate = (
  dateList,
  selectedDate,
  initialDatetime,
  setDate
) => {
  useEffect(() => {
    // A compare date can be null.
    if (selectedDate && !isSelectedDateValid(dateList, selectedDate)) {
      setDate(getInitialDate(dateList, initialDatetime));
    }
  }, [dateList, selectedDate, initialDatetime, setDate]);
};

const useDatePickerValue = (
  value: Date | null,
  setter: (v: Date | null) => void
) => {
  const onConfirm = useCallback((range) => setter(range.start), [setter]);

  const val = useMemo(
    () => ({
      end: value,
      start: value
    }),
    [value]
  );
  return [val, onConfirm] as [typeof val, typeof onConfirm];
};

function DatasetsExplore() {
  const mapboxRef = useRef<MapboxMapRef>(null);
  const dataset = useDataset();

  if (!dataset) throw resourceNotFound();

  if (!dataset.data.layers.length) {
    throw new Error(
      `There are no layers defined in dataset ${dataset.data.id}`
    );
  }

  /** *********************************************************************** */
  // Panel relate stuff to ensure it opens and closes and this action resizes
  // the map.
  const panelBodyRef = useRef<HTMLDivElement>(null);
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
    return () => clearTimeout(id);
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

  const [mapPosition, setMapPosition] = useQsState.memo<{
    lng: number;
    lat: number;
    zoom: number;
  }>({
    key: 'position',
    default: null,
    hydrator: (v) => {
      if (!v) return null;
      const [lng, lat, zoom] = v.split('|').map(Number);
      return { lng, lat, zoom };
    },
    dehydrator: (v) => {
      if (!v) return '';
      const { lng, lat, zoom } = v;
      return [lng, lat, zoom].join('|');
    }
  });

  const [mapProjection, setMapProjection] = useQsState.memo<ProjectionOptions>({
    key: 'projection',
    default: null,
    hydrator: (v) => {
      if (!v) return null;
      const [id, rawCenter, rawParallels] = v.split('|');
      const center = rawCenter ? rawCenter.split(',').map(Number) : undefined;
      const parallels = rawParallels
        ? rawParallels.split(',').map(Number)
        : undefined;
      return { id, center, parallels } as ProjectionOptions;
    },
    dehydrator: (v) => {
      if (!v) return '';
      const { id, center, parallels } = v;
      return `${id}|${center?.join(',') ?? ''}|${parallels?.join(',') ?? ''}`;
    }
  });

  const [mapBasemapId, setBasemapId] = useQsState.memo<BasemapId>({
    key: 'basemapid',
    default: null
  });

  const [selectedDatetime, setSelectedDatetime] = useQsState.memo<Date>({
    key: 'datetime',
    default: null,
    // The Date picker returns the selected date at the beginning of the day for
    // the user's timezone. This becomes a problem when converting to string.
    // For example, being in the West European Time when we select September
    // 1st the date is initialized as: Wed Sep 01 2021 00:00:00 GMT+0100
    // which means that if we convert to string using toISOString() it actually
    // is 2021-08-31T23:00:00.000Z. Through toUtcDateString we avoid this.
    dehydrator: (v) => (v ? userTzDate2utcString(v) : ''),
    // The same problem happens when reading the date. Using utcDate handles the
    // reverse issue.
    hydrator: (v) => {
      const d = utcString2userTzDate(v);
      return isNaN(d.getTime()) ? null : d;
    }
  });

  const [selectedCompareDatetime, setSelectedCompareDatetime] =
    useQsState.memo<Date>({
      key: 'datetime_compare',
      default: null,
      dehydrator: (v) => (v ? userTzDate2utcString(v) : ''),
      // The same problem happens when reading the date. Using utcDate handles the
      // reverse issue.
      hydrator: (v) => {
        const d = utcString2userTzDate(v);
        return isNaN(d.getTime()) ? null : d;
      }
    });

  // END QsState setup
  /** *********************************************************************** */

  const [isComparing, setIsComparing] = useState(!!selectedCompareDatetime);
  const [isDatasetLayerHidden, setIsDatasetLayerHidden] = useState(false);
  const [layerStyle, setLayerStyle] = useState<ExtendedStyle | undefined>(
    undefined
  );

  const currentLayerStyle = layerStyle?.layers.find((l) => {
    return l.metadata.id === `base-${selectedLayerId}`;
  });

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
      // @ts-expect-error l.baseLayer.data is always defined if S_SUCCEEDED.
      return status === S_SUCCEEDED && l.baseLayer.data.id === selectedLayerId;
    });
  }, [asyncLayers, selectedLayerId]);

  // Get the active layer timeseries data so we can render the date selector.
  // Done both for the base layer and the compare layer.
  const activeLayerTimeseries = useMemo(
    // @ts-expect-error if there is activeLayer the the rest is loaded.
    () => activeLayer?.baseLayer.data.timeseries ?? null,
    [activeLayer]
  );
  const activeLayerCompareTimeseries = useMemo(
    // @ts-expect-error if there is activeLayer the the rest is loaded.
    () => activeLayer?.compareLayer?.data.timeseries ?? null,
    [activeLayer]
  );

  // On layer change, reset the projection.
  // When activating a layer always use the layer projection (if defined),
  // otherwise default to mercator. If this is the first layer loading (like
  // when the user enters the page), then use the projection in the url. This is
  // needed in case the url was shared with a different projection.
  useEffectPrevious<[AsyncDatasetLayer | undefined, ProjectionOptions | null]>(
    (prev) => {
      const prevActiveData = prev[0]?.baseLayer.data;
      const currActiveData = activeLayer?.baseLayer.data;

      if (prevActiveData?.id === undefined && currActiveData) {
        // First load.
        if (mapProjection === null) {
          // Nothing in the url. Set the layer default is able.
          if (currActiveData.projection?.id) {
            setMapProjection(currActiveData.projection);
          } else {
            setMapProjection(projectionDefault);
          }
        } else {
          // Do nothing. The projection will be set by the url.
          return;
        }
      }

      if (!currActiveData || prevActiveData?.id === currActiveData.id) {
        // Same layer. Do nothing.
        return;
      }

      // Layer change. Set the projection.
      if (currActiveData.projection?.id) {
        setMapProjection(currActiveData.projection);
      } else {
        setMapProjection(projectionDefault);
      }
    },
    [activeLayer, mapProjection]
  );

  // On layer change, reset the basemapId.
  // When activating a layer always use the layer basemap (if defined),
  // otherwise default to satellite. If this is the first layer loading (like
  // when the user enters the page), then use the basemap in the url. This is
  // needed in case the url was shared with a different basemap.
  useEffectPrevious<[AsyncDatasetLayer | undefined, BasemapId | null]>(
    (prev) => {
      const prevActiveData = prev[0]?.baseLayer.data;
      const currActiveData = activeLayer?.baseLayer.data;

      if (prevActiveData?.id === undefined && currActiveData) {
        // First load.
        if (mapBasemapId === null) {
          // Nothing in the url. Set the layer default is able.
          if (currActiveData.basemapId) {
            setBasemapId(currActiveData.basemapId);
          } else {
            setBasemapId(BASEMAP_ID_DEFAULT);
          }
        } else {
          // Do nothing. The basemap will be set by the url.
          return;
        }
      }

      if (!currActiveData || prevActiveData?.id === currActiveData.id) {
        // Same layer. Do nothing.
        return;
      }

      // Layer change. Set the projection.
      if (currActiveData.basemapId) {
        setBasemapId(currActiveData.basemapId);
      } else {
        setBasemapId(BASEMAP_ID_DEFAULT);
      }
    },
    [activeLayer, mapBasemapId]
  );

  // Available dates for the baseLayer of the currently active layer.
  // null if there's no active layer or it hasn't loaded yet.
  const availableActiveLayerDates = useMemo(() => {
    if (!activeLayer) return undefined;
    return resolveLayerTemporalExtent(activeLayer.baseLayer.data) ?? undefined;
  }, [activeLayer]);
  // Available dates for the compareLayer of the currently active layer.
  // null if there's no compare layer or it hasn't loaded yet.
  const availableActiveLayerCompareDates = useMemo(() => {
    if (!activeLayer?.compareLayer) return undefined;
    return (
      resolveLayerTemporalExtent(activeLayer.compareLayer.data) ?? undefined
    );
  }, [activeLayer]);

  // On layer change, if there's no compare layer, unset the date.
  useEffect(() => {
    if (activeLayer && !activeLayer.compareLayer) {
      setIsComparing(false);
      setSelectedCompareDatetime(null);
    }
  }, [activeLayer, setSelectedCompareDatetime]);

  const initialDatetime = activeLayer?.baseLayer.data?.initialDatetime;

  // Deselect compare dates when compare toggle changes.
  useEffect(() => {
    if (isComparing) {
      if (
        !selectedCompareDatetime &&
        availableActiveLayerCompareDates?.length
      ) {
        setSelectedCompareDatetime(
          getInitialDate(availableActiveLayerCompareDates, initialDatetime)
        );
      }
    } else {
      setSelectedCompareDatetime(null);
    }
  }, [
    isComparing,
    availableActiveLayerCompareDates,
    setSelectedCompareDatetime,
    selectedCompareDatetime,
    initialDatetime
  ]);

  // When the available dates for the selected layer change, check if the
  // currently selected date is a valid one, otherwise reset to the first one in
  // the domain. Since the selected date is stored in the url we need to make
  // sure it actually exists.
  useValidSelectedDate(
    availableActiveLayerDates,
    selectedDatetime,
    initialDatetime,
    setSelectedDatetime
  );
  // Same but for compare dates.
  useValidSelectedCompareDate(
    availableActiveLayerCompareDates,
    selectedCompareDatetime,
    initialDatetime,
    setSelectedCompareDatetime
  );

  /** *********************************************************************** */
  // Setters and values for the date picker.
  const [datePickerValue, datePickerConfirm] = useDatePickerValue(
    selectedDatetime,
    setSelectedDatetime
  );

  const [datePickerCompareValue, datePickerCompareConfirm] = useDatePickerValue(
    selectedCompareDatetime,
    setSelectedCompareDatetime
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
  return (
    <>
      <LayoutProps
        title={`${dataset.data.name} - Exploration`}
        description={dataset.data.description}
        thumbnail={dataset.data.media?.src}
        hideFooter
      />
      <PageMainContent>
        <PageHero title={dataset.data.name} isHidden />
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
                <PositionPlaceHolderForScroll />
                <ScrollArea>
                  <ScrollAreaInner>
                    <BackLink
                      to={`${DATASETS_PATH}/${dataset.data.id}`}
                    >
                      <CollecticonArrowLeft /> Back to dataset overview
                    </BackLink>
                    <DatesWrapper>
                      {activeLayerTimeseries && (
                        <PanelDateWidget
                          title='Date'
                          value={datePickerValue}
                          onConfirm={datePickerConfirm}
                          timeDensity={activeLayerTimeseries.timeDensity}
                          availableDates={availableActiveLayerDates}
                        >
                          {activeLayerCompareTimeseries && (
                            <FormSwitch
                              id='compare-date-toggle'
                              name='compare-date-toggle'
                              value='compare-date-toggle'
                              checked={isComparing}
                              textPlacement='right'
                              onChange={() => setIsComparing((v) => !v)}
                            >
                              Toggle date comparison
                            </FormSwitch>
                          )}
                        </PanelDateWidget>
                      )}
                      {isComparing && activeLayerCompareTimeseries && (
                        <PanelDateWidget
                          title='Date comparison'
                          value={datePickerCompareValue}
                          onConfirm={datePickerCompareConfirm}
                          timeDensity={activeLayerCompareTimeseries.timeDensity}
                          availableDates={availableActiveLayerCompareDates}
                        />
                      )}
                    </DatesWrapper>
                    <PanelWidget id='panel-widget'>
                      <PanelWidgetHeader>
                        <PanelWidgetTitle>Layers</PanelWidgetTitle>
                      </PanelWidgetHeader>
                      <PanelWidgetBody>
                        <DatasetLayers
                          datasetId={dataset.data.id}
                          asyncLayers={asyncLayers}
                          selectedLayerId={selectedLayerId ?? undefined}
                          onAction={onLayerAction}
                        />
                      </PanelWidgetBody>
                    </PanelWidget>
                  </ScrollAreaInner>
                </ScrollArea>
              </PanelBody>
            </PanelInner>
          </Panel>
          <Carto>
            <CustomControlWrapper>
              <NotebookConnectButton dataset={dataset.data} />
              <TileLinkButton
                layerData={currentLayerStyle}
                disabled={!currentLayerStyle?.metadata.xyzTileUrl}
              />
              <LayerVisibilityToggleButton
                isDatasetLayerHidden={isDatasetLayerHidden}
                onLayerVisibilityClick={setIsDatasetLayerHidden}
              />
            </CustomControlWrapper>
            <MapboxMap
              ref={mapboxRef}
              withGeocoder
              withScale
              datasetId={dataset.data.id}
              layerId={activeLayer?.baseLayer.data?.id}
              date={selectedDatetime ?? undefined}
              compareDate={selectedCompareDatetime ?? undefined}
              isComparing={isComparing}
              initialPosition={mapPosition ?? undefined}
              onPositionChange={(v) => {
                // Only store the map position if the change was initiated by
                // the user.
                if (v.userInitiated) {
                  setMapPosition(v);
                }
              }}
              projection={mapProjection ?? projectionDefault}
              onProjectionChange={setMapProjection}
              basemapStyleId={mapBasemapId ?? BASEMAP_ID_DEFAULT}
              onBasemapStyleIdChange={setBasemapId}
              isDatasetLayerHidden={isDatasetLayerHidden}
              onStyleChange={setLayerStyle}
            />
          </Carto>
        </Explorer>
      </PageMainContent>
    </>
  );
}

export default DatasetsExplore;
