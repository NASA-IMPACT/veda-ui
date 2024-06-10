import {useState, useEffect} from 'react';
import { requestQuickCache } from '../utils';
import { S_FAILED, S_LOADING, S_SUCCEEDED } from '$utils/status';

interface AssetUrlReplacement {
  from: string;
  to: string;
}
interface ZarrResponseData {
  assets: {
    zarr: {
      href: string
    }
  },
  //collection_concept_id: string
}
interface CMRResponseData {
  features: {
    assets: {
      data: {
        href: string
      }
    }
  }[]
}

export function useZarr({ id, stacCol, stacApiEndpointToUse, date, onStatusChange }){
  const [assetUrl, setAssetUrl] = useState('');
  // const [sourceParams, setSourceParams] = useState({});

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        onStatusChange?.({ status: S_LOADING, id });
        const data:ZarrResponseData = await requestQuickCache({
          url: `${stacApiEndpointToUse}/collections/${stacCol}`,
          method: 'GET',
          controller
        });

        if (data.assets.zarr.href) {
          setAssetUrl(data.assets.zarr.href);
        }
        // const cmrSourceParams = data.renders['preciptation'];
        // // cmrSourceParams['concept_id'] = data.collection_concept_id;
        // // setSourceParams(cmrSourceParams);
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
  }, [id, stacCol, stacApiEndpointToUse, date, onStatusChange]);

  //return sourceParams;
  return assetUrl;
} 



export function useCMR({ id, stacCol, stacApiEndpointToUse, date, assetUrlReplacements, stacApiEndpoint, onStatusChange }){
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

        const data:CMRResponseData = await requestQuickCache({
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