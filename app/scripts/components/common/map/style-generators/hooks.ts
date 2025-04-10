import { useState, useEffect } from 'react';
import { requestQuickCache } from '../utils';
import { S_FAILED, S_LOADING, S_SUCCEEDED } from '$utils/status';

interface AssetUrlReplacement {
  from: string;
  to: string;
}
interface ZarrResponseData {
  assets: {
    zarr: {
      href: string;
    };
  };
}
interface CMRResponseData {
  features: {
    assets: {
      data: {
        href: string;
      };
    };
  }[];
}
interface Link {
  href: string;
  rel: string;
  type: string;
  title: string;
  'wms:layers': string[];
  'wms:styles': string[];
}

interface WMSResponseData {
  links: Link[];
  extent: {
    spatial: {
      bbox: [number, number, number, number][];
    };
  };
}

export function useZarr({
  id,
  stacCol,
  stacApiEndpointToUse,
  date,
  onStatusChange
}) {
  const [assetUrl, setAssetUrl] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        onStatusChange?.({ status: S_LOADING, id });
        const data: ZarrResponseData = await requestQuickCache({
          url: `${stacApiEndpointToUse}/collections/${stacCol}`,
          method: 'GET',
          controller
        });

        setAssetUrl(data.assets.zarr.href);
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

  return assetUrl;
}

export function useCMR({
  id,
  stacCol,
  stacApiEndpointToUse,
  date,
  assetUrlReplacements,
  stacApiEndpoint,
  onStatusChange
}) {
  const [assetUrl, setAssetUrl] = useState('');

  const replaceInAssetUrl = (url: string, replacement: AssetUrlReplacement) => {
    const { from, to } = replacement;
    const cmrAssetUrl = url.replace(from, to);
    return cmrAssetUrl;
  };

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        onStatusChange?.({ status: S_LOADING, id });
        if (!assetUrlReplacements)
          throw new Error(
            'CMR  layer requires asset url replacement attributes'
          );

        // Zarr collections in _VEDA_ should have a single entrypoint (zarr or virtual zarr / reference)
        // CMR endpoints will be using individual items' assets, so we query for the asset url
        const stacApiEndpointToUse = `${stacApiEndpoint}/search?collections=${stacCol}&datetime=${date?.toISOString()}`;

        const data: CMRResponseData = await requestQuickCache({
          url: stacApiEndpointToUse,
          method: 'GET',
          controller
        });

        const assetUrl = replaceInAssetUrl(
          data.features[0].assets.data.href,
          assetUrlReplacements
        );
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
  }, [
    id,
    stacCol,
    stacApiEndpointToUse,
    date,
    assetUrlReplacements,
    stacApiEndpoint,
    onStatusChange
  ]);

  return assetUrl;
}

export function useWMS({ id, stacCol, stacApiEndpointToUse, onStatusChange }) {
  const [wmsUrl, setWmsUrl] = useState('');
  const [bounds, setBounds] = useState<[number, number, number, number]>([
    -180, -90, 180, 90
  ]);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        onStatusChange?.({ status: S_LOADING, id });
        const data: WMSResponseData = await requestQuickCache({
          url: `${stacApiEndpointToUse}/collections/${stacCol}`,
          method: 'GET',
          controller
        });
        const bounds = data.extent.spatial.bbox[0];
        setBounds(bounds);
        const wms = data.links.find((l) => l.rel === 'wms');
        if (wms) setWmsUrl(wms.href);
        else throw new Error('no wms link');
        onStatusChange?.({ status: S_SUCCEEDED, id });
      } catch (error) {
        if (!controller.signal.aborted) {
          setWmsUrl('');
          onStatusChange?.({ status: S_FAILED, id });
        }
        return;
      }
    }

    load();

    return () => {
      controller.abort();
    };
  }, [id, stacCol, stacApiEndpointToUse, onStatusChange]);

  return {
    wmsUrl,
    bounds
  };
}
