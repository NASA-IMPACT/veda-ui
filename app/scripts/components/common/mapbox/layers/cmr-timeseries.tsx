import React, { useEffect, useState } from 'react';
import { Map as MapboxMap } from 'mapbox-gl';

import { requestQuickCache } from './utils';

import { ZarrPaintLayer } from './zarr-timeseries';
import { ActionStatus, S_FAILED, S_LOADING, S_SUCCEEDED } from '$utils/status';

interface AssetUrlReplacement {
  from: string;
  to: string;
}

export interface MapLayerCMRTimeseriesProps {
  id: string;
  stacCol: string;
  date?: Date;
  mapInstance: MapboxMap;
  sourceParams?: Record<string, any>;
  stacApiEndpoint?: string;
  tileApiEndpoint?: string;
  assetUrlReplacements?: AssetUrlReplacement;
  zoomExtent?: number[];
  onStatusChange?: (result: { status: ActionStatus; id: string }) => void;
  isHidden?: boolean;
  idSuffix?: string;
}


function useCMR({ id, stacCol, stacApiEndpointToUse, date, assetUrlReplacements, stacApiEndpoint, onStatusChange }){
  const [assetUrl, setAssetUrl] = useState('');
  
  const replaceInAssetUrl = (url: string, replacement: AssetUrlReplacement) => {
    const {from, to } = replacement;
    const cmrAssetUrl = url.replace(from, to);
    return cmrAssetUrl;
  };


  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        onStatusChange?.({ status: S_LOADING, id });
        if (!assetUrlReplacements) throw (new Error('CMR  layer requires asset url remplacement attributes'));

        // Zarr collections in _VEDA_ should have a single entrypoint (zarr or virtual zarr / reference)
        // CMR endpoints will be using individual items' assets, so we query for the asset url
        const stacApiEndpointToUse = `${stacApiEndpoint}/search?collections=${stacCol}&datetime=${date?.toISOString()}`;

        const data = await requestQuickCache({
          url: stacApiEndpointToUse,
          method: 'GET',
          controller
        });

        const assetUrl = replaceInAssetUrl(data.features[0].assets.data.href, assetUrlReplacements);
        setAssetUrl(assetUrl);
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
  }, [id, stacCol, stacApiEndpointToUse, date, assetUrlReplacements, stacApiEndpoint, onStatusChange]);

  return assetUrl;

} 

export function MapLayerCMRTimeseries(props:MapLayerCMRTimeseriesProps) {
  const {
    id,
    stacCol,
    stacApiEndpoint,
    date,
    assetUrlReplacements,
    onStatusChange,
  } = props;

  const stacApiEndpointToUse = stacApiEndpoint?? process.env.API_STAC_ENDPOINT;
  const assetUrl = useCMR({ id, stacCol, stacApiEndpointToUse, date, assetUrlReplacements, stacApiEndpoint, onStatusChange });
  return <ZarrPaintLayer {...props} assetUrl={assetUrl} />;
}