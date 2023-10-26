import { useEffect, useMemo, useState } from 'react';
import qs from 'qs';
import { Map as MapboxMap, RasterSource, RasterLayer } from 'mapbox-gl';

import { requestQuickCache } from './utils';
import { useMapStyle } from './styles';

import { ActionStatus, S_FAILED, S_LOADING, S_SUCCEEDED } from '$utils/status';

const tilerUrl = process.env.API_XARRAY_ENDPOINT;

export interface MapLayerZarrTimeseriesProps {
  id: string;
  stacCol: string;
  stacApiEndpoint?: string;
  date?: Date;
  mapInstance: MapboxMap;
  sourceParams?: Record<string, any>;
  zoomExtent?: number[];
  onStatusChange?: (result: { status: ActionStatus; id: string }) => void;
  isHidden?: boolean;
  idSuffix?: string;
}

export function MapLayerZarrTimeseries(props: MapLayerZarrTimeseriesProps) {
  const {
    id,
    stacCol,
    stacApiEndpoint,
    date,
    mapInstance,
    sourceParams,
    zoomExtent,
    onStatusChange,
    isHidden,
    idSuffix = ''
  } = props;

  const { updateStyle } = useMapStyle();
  const [assetUrl, setAssetUrl] = useState('');

  const [minZoom] = zoomExtent ?? [0, 20];

  const generatorId = 'zarr-timeseries' + idSuffix;

  //
  // Get the asset url
  //
  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        onStatusChange?.({ status: S_LOADING, id });
        const stacApiEndpointToUse = stacApiEndpoint || process.env.STAC_API_ENDPOINT;
        const data = await requestQuickCache({
          url: `${stacApiEndpointToUse}/search?collections=${stacCol}&datetime=${date?.toISOString()}`,
          method: 'GET',
          controller
        });

        const dataUrl = data.features[0].assets.data.href.replace('https://data.gesdisc.earthdata.nasa.gov/data', 's3://gesdisc-cumulus-prod-protected')
        setAssetUrl(dataUrl);
        onStatusChange?.({ status: S_SUCCEEDED, id });
      } catch (error) {
        if (!controller.signal.aborted) {
          setAssetUrl('');
          onStatusChange?.({ status: S_FAILED, id });
        }
        return;
      }
    }

    load();

    return () => {
      controller.abort();
    };
  }, [mapInstance, id, stacCol, date, onStatusChange]);

  //
  // Generate Mapbox GL layers and sources for raster timeseries
  //
  const haveSourceParamsChanged = useMemo(
    () => JSON.stringify(sourceParams),
    [sourceParams]
  );

  useEffect(
    () => {
      if (!tilerUrl) return;

      const tileParams = qs.stringify({
        url: assetUrl,
        time_slice: date,
        ...sourceParams
      });

      const zarrSource: RasterSource = {
        type: 'raster',
        url: `${tilerUrl}?${tileParams}`
      };

      const zarrLayer: RasterLayer = {
        id: id,
        type: 'raster',
        source: id,
        layout: {
          visibility: isHidden ? 'none' : 'visible'
        },
        paint: {
          'raster-opacity': Number(!isHidden),
          'raster-opacity-transition': {
            duration: 320
          }
        },
        minzoom: minZoom,
        metadata: {
          layerOrderPosition: 'raster'
        }
      };

      const sources = {
        [id]: zarrSource
      };
      const layers = [zarrLayer];

      updateStyle({
        generatorId,
        sources,
        layers
      });
    },
    // sourceParams not included, but using a stringified version of it to detect changes (haveSourceParamsChanged)
    [
      updateStyle,
      id,
      date,
      assetUrl,
      minZoom,
      haveSourceParamsChanged,
      isHidden,
      generatorId
    ]
  );

  //
  // Cleanup layers on unmount.
  //
  useEffect(() => {
    return () => {
      updateStyle({
        generatorId,
        sources: {},
        layers: []
      });
    };
  }, [updateStyle, generatorId]);

  return null;
}
