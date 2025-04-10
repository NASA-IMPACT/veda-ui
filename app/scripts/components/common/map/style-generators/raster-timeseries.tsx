/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { LngLatBoundsLike } from 'mapbox-gl';
import { RasterTimeseriesProps, StacFeature } from '../types';
import {
  FIT_BOUNDS_PADDING,
  getFilterPayload,
  getMergedBBox,
  requestQuickCache
} from '../utils';
import useFitBbox from '../hooks/use-fit-bbox';
import useMaps from '../hooks/use-maps';

import PointsLayer from './points-layer';
import { useRequestStatus, STATUS_KEY } from './hooks';
import { RasterPaintLayer } from './raster-paint-layer';
import { S_FAILED, S_LOADING, S_SUCCEEDED } from '$utils/status';

// Whether or not to print the request logs.
const LOG = process.env.NODE_ENV !== 'production' ? true : false;

export function useStacResponse({
  id,
  changeStatus,
  stacCol,
  date,
  stacApiEndpointToUse
}): [
  StacFeature[],
  Array<{ bounds: LngLatBoundsLike; center: [number, number] }> | null
] {
  //
  // Load stac collection features
  //
  const [stacCollection, setStacCollection] = useState<StacFeature[]>([]);
  useEffect(() => {
    if (!id || !stacCol) return;

    const controller = new AbortController();

    const load = async () => {
      try {
        changeStatus({ status: S_LOADING, context: STATUS_KEY.StacSearch });
        const payload = {
          'filter-lang': 'cql2-json',
          filter: getFilterPayload(date, stacCol),
          limit: 500,
          fields: {
            include: ['bbox'],
            exclude: ['collection', 'links']
          }
        };

        if (LOG) {
          /* eslint-disable no-console */
          console.groupCollapsed(
            'RasterTimeseries %cLoading STAC features',
            'color: orange;',
            id
          );
          console.log('Payload', payload);
          console.groupEnd();
          /* eslint-enable no-console */
        }

        const responseData = await requestQuickCache<{
          features: StacFeature[];
        }>({
          url: `${stacApiEndpointToUse}/search`,
          payload,
          controller
        });

        if (LOG) {
          /* eslint-disable no-console */
          console.groupCollapsed(
            'RasterTimeseries %cAdding STAC features',
            'color: green;',
            id
          );
          console.log('STAC response', responseData);
          console.groupEnd();
          /* eslint-enable no-console */
        }

        setStacCollection(responseData.features);
        changeStatus({ status: S_SUCCEEDED, context: STATUS_KEY.StacSearch });
      } catch (error) {
        if (!controller.signal.aborted) {
          setStacCollection([]);
          changeStatus({ status: S_FAILED, context: STATUS_KEY.StacSearch });
        }
        if (LOG)
          /* eslint-disable-next-line no-console */
          console.log(
            'RasterTimeseries %cAborted STAC features',
            'color: red;',
            id
          );
        // Temporarily turning on log for debugging
        /* eslint-disable-next-line no-console */
        console.log(error);
        return;
      }
    };
    load();
    return () => {
      controller.abort();
      changeStatus({ status: 'idle', context: STATUS_KEY.StacSearch });
    };
  }, [id, changeStatus, stacCol, date, stacApiEndpointToUse]);

  //
  // Markers to show where the data is when zoom is low
  //
  const points = useMemo(() => {
    if (!stacCollection.length) return null;
    const points = stacCollection.map((f) => {
      const [w, s, e, n] = f.bbox;
      return {
        bounds: [
          [w, s],
          [e, n]
        ] as LngLatBoundsLike,
        center: [(w + e) / 2, (s + n) / 2] as [number, number]
      };
    });

    return points;
  }, [stacCollection]);

  return [stacCollection, points];
}

function useMosaicUrl({
  id,
  stacCol,
  date,
  colorMap,
  stacCollection,
  changeStatus,
  tileApiEndpointToUse
}) {
  //
  // Tiles
  //
  const [mosaicUrl, setMosaicUrl] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (!id || !stacCol) return;

    // If the search returned no data, remove anything previously there so we
    // don't run the risk that the selected date and data don't match, even
    // though if a search returns no data, that date should not be available for
    // the dataset - may be a case of bad configuration.
    if (!stacCollection.length) {
      setMosaicUrl(undefined);
      return;
    }

    const controller = new AbortController();

    const load = async () => {
      changeStatus({ status: S_LOADING, context: STATUS_KEY.Layer });
      try {
        const payload = {
          'filter-lang': 'cql2-json',
          filter: getFilterPayload(date, stacCol)
        };

        if (LOG) {
          /* eslint-disable no-console */
          console.groupCollapsed(
            'RasterTimeseries %cLoading Mosaic',
            'color: orange;',
            id
          );
          console.log('Payload', payload);
          console.groupEnd();
          /* eslint-enable no-console */
        }

        let responseData;

        try {
          responseData = await requestQuickCache<any>({
            url: `${tileApiEndpointToUse}/searches/register`,
            payload,
            controller
          });
          const mosaicUrl = responseData.links[1].href;
          setMosaicUrl(
            mosaicUrl.replace('/{tileMatrixSetId}', '/WebMercatorQuad')
          );
        } catch (error) {
          // @NOTE: conditional logic TO BE REMOVED once new BE endpoints have moved to prod... Fallback on old request url if new endpoints error with nonexistance...
          if (error.request) {
            // The request was made but no response was received
            responseData = await requestQuickCache<any>({
              url: `${tileApiEndpointToUse}/mosaic/register`, // @NOTE: This will fail anyways with "staging-raster.delta-backend.com" because its already deprecated...
              payload,
              controller
            });

            const mosaicUrl = responseData.links[1].href;
            setMosaicUrl(mosaicUrl);
          } else {
            if (LOG)
              /* eslint-disable-next-line no-console */
              console.log(
                'Titiler /register %cEndpoint error',
                'color: red;',
                error
              );
            throw error;
          }
        }

        /* eslint-disable no-console */
        if (LOG) {
          console.groupCollapsed(
            'RasterTimeseries %cAdding Mosaic',
            'color: green;',
            id
          );
          // links[0] : metadata , links[1]: tile
          console.log('Url', responseData.links[1].href);
          console.log('STAC response', responseData);
          console.groupEnd();
        }
        /* eslint-enable no-console */
        changeStatus({ status: S_SUCCEEDED, context: STATUS_KEY.Layer });
      } catch (error) {
        if (!controller.signal.aborted) {
          changeStatus({ status: S_FAILED, context: STATUS_KEY.Layer });
        }
        if (LOG)
          /* eslint-disable-next-line no-console */
          console.log('RasterTimeseries %cAborted Mosaic', 'color: red;', id);
        return;
      }
    };

    load();

    return () => {
      controller.abort();
      changeStatus({ status: 'idle', context: STATUS_KEY.Layer });
    };
  }, [
    colorMap,
    stacCollection
    // This hook depends on a series of properties, but whenever they change the
    // `stacCollection` is guaranteed to change because a new STAC request is
    // needed to show the data. The following properties are therefore removed
    // from the dependency array:
    // - id
    // - changeStatus
    // - stacCol
    // - date
    // Keeping then in would cause multiple requests because for example when
    // `date` changes the hook runs, then the STAC request in the hook above
    // fires and `stacCollection` changes, causing this hook to run again. This
    // resulted in a race condition when adding the source to the map leading to
    // an error.
  ]);
  return [mosaicUrl];
}

export function RasterTimeseries(props: RasterTimeseriesProps) {
  const {
    id,
    stacCol,
    date,
    sourceParams,
    zoomExtent,
    bounds,
    onStatusChange,
    isPositionSet,
    hidden,
    opacity,
    stacApiEndpoint,
    tileApiEndpoint,
    colorMap,
    reScale,
    envApiStacEndpoint,
    envApiRasterEndpoint
  } = props;

  const { current: mapInstance } = useMaps();

  const stacApiEndpointToUse = stacApiEndpoint ?? envApiStacEndpoint ?? '';
  const tileApiEndpointToUse = tileApiEndpoint ?? envApiRasterEndpoint ?? '';

  const { changeStatus } = useRequestStatus({
    id,
    onStatusChange,
    requestsToTrack: [STATUS_KEY.StacSearch, STATUS_KEY.Layer]
  });

  const [stacCollection, points] = useStacResponse({
    id,
    changeStatus,
    stacCol,
    date,
    stacApiEndpointToUse
  });

  const [mosaicUrl] = useMosaicUrl({
    id,
    stacCol,
    date,
    colorMap,
    stacCollection,
    changeStatus,
    tileApiEndpointToUse
  });

  //
  // Listen to mouse events on the markers layer
  //
  const onPointsClick = useCallback(
    (features) => {
      const bounds = JSON.parse(features[0].properties.bounds);
      mapInstance?.fitBounds(bounds, { padding: FIT_BOUNDS_PADDING });
    },
    [mapInstance]
  );

  //
  // FitBounds when needed
  //
  const layerBounds = useMemo(
    () => (stacCollection?.length ? getMergedBBox(stacCollection) : undefined),
    [stacCollection]
  );
  useFitBbox(!!isPositionSet, bounds, layerBounds);

  return (
    <>
      points && (
      <PointsLayer
        id={id}
        points={points}
        zoomExtent={zoomExtent}
        onPointsClick={onPointsClick}
      />
      ) mosaicUrl && (
      <RasterPaintLayer
        id={id}
        tileApiEndpoint={mosaicUrl}
        tileParams={{ ...sourceParams, assets: ['cog_default'] }}
        zoomExtent={zoomExtent}
        hidden={hidden}
        opacity={opacity}
        colorMap={colorMap}
        reScale={reScale}
        generatorPrefix='raster-timeseries'
        onStatusChange={changeStatus}
      />
      )
    </>
  );
}
