import { useCallback, useEffect, useRef, useState } from 'react';
import { requestQuickCache } from '../utils';

import {
  ActionStatus,
  S_FAILED,
  S_IDLE,
  S_LOADING,
  S_SUCCEEDED
} from '$utils/status';

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
  'wms:styles'?: string[];
  'wmts:dimensions'?: string[];
  'wmts:servers'?: string[];
}

interface WebMapResponseData {
  links: Link[];
  tilematrixset?: string;
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
export function useWebMapService({
  id,
  stacCol,
  stacApiEndpointToUse,
  onStatusChange
}) {
  const defaultBounds: [number, number, number, number] = [-180, -90, 180, 90];
  const [urls, setUrls] = useState<string[]>();
  const [tilematrixSet, setTilematrixSet] = useState<string>('');
  const [bounds, setBounds] =
    useState<[number, number, number, number]>(defaultBounds);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        onStatusChange?.({ status: S_LOADING, id });
        const data: WebMapResponseData = await requestQuickCache({
          url: `${stacApiEndpointToUse}/collections/${stacCol}`,
          method: 'GET',
          controller
        });
        const bounds = data.extent.spatial.bbox[0];
        setBounds(bounds);
        const link = data.links.find(
          (l) => l.rel === 'wmts' || l.rel === 'wms'
        );
        const matrixSet = data?.tilematrixset ? data.tilematrixset : '';
        setTilematrixSet(matrixSet);

        if (!link || !link.href) {
          throw new Error('WMTS link is missing or malformed');
        }
        const primaryHref = link.href;
        const alternateServers: string[] = link['href:servers'] ?? [];
        // Ensure all values are strings and non-empty
        const tileUrls = [primaryHref, ...alternateServers].filter(Boolean);
        setUrls(tileUrls.length ? tileUrls : []);
        onStatusChange?.({ status: S_SUCCEEDED, id });
      } catch (error) {
        if (!controller.signal.aborted) {
          setUrls([]);
          setBounds(defaultBounds);
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
    urls,
    bounds,
    tilematrixSet
  };
}

interface UseRequestStatusParams {
  id: string;
  onStatusChange?: (result: { status: ActionStatus; id: string }) => void;
  requestsToTrack: STATUS_KEY[];
}

export enum STATUS_KEY {
  Global,
  Layer,
  StacSearch
}

/**
 * A custom hook for tracking and managing request statuses across multiple contexts.
 *
 * This hook maintains a centralized state for tracking the status of multiple requests.
 * This hook was created because  some layers needing multiple requests to load the layer
 * ex. raster-timeseries require stac (low zoom markers, metadata) & mosaic (for raster data tiling)

 * It provides a global status that aggregates individual
 * context statuses based on priority rules.
 *
 * Status priority rules:
 * - If any request has failed, global status is FAILED
 * - If any request is loading, global status is LOADING
 * - If any request is idle, global status is IDLE
 * - If all requests succeeded, global status is SUCCEEDED
 *
 * @param {UseRequestStatusParams} params - Configuration parameters
 * @param {string|number} params.id - layer id
 * @param {Function} [params.onStatusChange] - Callback triggered when global status changes
 * @param {string[]} [params.requestsToTrack=[]] - Array of request keys to track status for
 *
 * @returns {UseRequestStatusReturn} Object containing status management utilities
 * @returns {Function} returns.changeStatus - Function to update a specific context's status
 * @returns {Object.<string, string>} returns.statuses - Object containing current status values
 *
 */

export function useRequestStatus({
  id,
  onStatusChange,
  requestsToTrack = []
}: UseRequestStatusParams) {
  const initialStatuses = {
    // Global flag to track all the requests
    global: (requestsToTrack.length ? S_IDLE : S_SUCCEEDED) as ActionStatus,
    ...requestsToTrack.reduce(
      (acc, context) => ({
        ...acc,
        [context]: S_IDLE
      }),
      {}
    )
  };

  const statuses = useRef(initialStatuses);

  const changeStatus = useCallback(
    ({ status, context }: { status: ActionStatus; context: STATUS_KEY }) => {
      statuses.current[context] = status;
      const layersToCheck = requestsToTrack.map(
        (context) => statuses.current[context]
      );

      let newStatus = statuses.current.global;
      // All layers must succeed to be considered successful.
      if (layersToCheck.every((s) => s === S_SUCCEEDED)) {
        newStatus = S_SUCCEEDED;
      } else if (layersToCheck.some((s) => s === S_FAILED)) {
        newStatus = S_FAILED;
      } else if (layersToCheck.some((s) => s === S_LOADING)) {
        newStatus = S_LOADING;
      } else if (layersToCheck.some((s) => s === S_IDLE)) {
        newStatus = S_IDLE;
      }
      // Only emit when layers statuses change
      if (newStatus !== statuses.current[STATUS_KEY.Global]) {
        statuses.current[STATUS_KEY.Global] = newStatus;
        onStatusChange?.({ status: newStatus, id });
      }
    },
    [id, onStatusChange, requestsToTrack]
  );

  return {
    changeStatus,
    statuses: statuses.current
  };
}
