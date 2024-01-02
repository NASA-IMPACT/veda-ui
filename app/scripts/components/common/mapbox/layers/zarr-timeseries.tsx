import { useEffect, useMemo, useState } from 'react';
import qs from 'qs';
import { Map as MapboxMap, RasterSource, RasterLayer } from 'mapbox-gl';

import { requestQuickCache } from './utils';
import { useMapStyle } from './styles';
import { hasNestedKey } from '$utils/utils';

import { ActionStatus, S_FAILED, S_LOADING, S_SUCCEEDED } from '$utils/status';

export interface MapLayerZarrTimeseriesProps {
  id: string;
  stacCol: string;
  date?: Date;
  mapInstance: MapboxMap;
  sourceParams?: Record<string, any>;
  stacApiEndpoint?: string;
  tileApiEndpoint?: string;
  assetUrlReplacements?: [string, string][];
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
    tileApiEndpoint,
    assetUrlReplacements,
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

  const stacApiEndpointToUse = stacApiEndpoint?? process.env.API_STAC_ENDPOINT;

  const generatorId = 'zarr-timeseries' + idSuffix;

  const replaceInAssetUrl = (url: string, replacements: ReplacementTuples[]) => {
    for (const replacement of replacements) {
      const [toReplace, replaceWith] = replacement;
      url = url.replace(toReplace, replaceWith);
    }
    return url;
  };

  //
  // Get the asset url
  //
  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        onStatusChange?.({ status: S_LOADING, id });

        // Zarr collections in _VEDA_ should have a single entrypoint (zarr or virtual zarr / reference)
        // CMR endpoints will be using individual items' assets, so we query for the asset url
        let stacApiEndpointToUse = `${process.env.API_STAC_ENDPOINT}/collections/${stacCol}`;
        // TODO: need a better way to configure this to search for items OR return a collections
        if (stacApiEndpoint) {
          stacApiEndpointToUse = `${stacApiEndpoint}/search?collections=${stacCol}&datetime=${date?.toISOString()}`;
        }

        const data = await requestQuickCache({
          url: stacApiEndpointToUse,
          method: 'GET',
          controller
        });

        const assetUrl = hasNestedKey(data, 'assets', 'zarr') ? data.assets.zarr.href : replaceInAssetUrl(data.features[0].assets.data.href, assetUrlReplacements);
        setAssetUrl(assetUrl);
        onStatusChange?.({ status: S_SUCCEEDED, id });
      } catch (error) {
        if (!controller.signal.aborted) {
          setAssetUrl('');
          onStatusChange?.({ status: S_FAILED, id });
        }
        return;
      }
    };

    load();

    return () => {
      controller.abort();
    };
  }, [mapInstance, id, stacCol, stacApiEndpointToUse, date, onStatusChange]);

  //
  // Generate Mapbox GL layers and sources for raster timeseries
  //
  const haveSourceParamsChanged = useMemo(
    () => JSON.stringify(sourceParams),
    [sourceParams]
  );

  useEffect(
    () => {
      if (!tileApiEndpoint) return;

      const tileParams = qs.stringify({
        url: assetUrl,
        time_slice: date,
        ...sourceParams
      });

      const zarrSource: RasterSource = {
        type: 'raster',
        url: `${tileApiEndpoint}?${tileParams}`
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
