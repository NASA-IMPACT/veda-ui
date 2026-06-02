import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Polygon } from '@turf/helpers';

import { requestQuickCache } from '../utils';
import { STATUS_KEY } from './hooks';
import { S_FAILED, S_LOADING, S_SUCCEEDED } from '$utils/status';

/**
 * Link in a STAC FeatureCollection response. Used for pagination via
 * the `rel: 'next'` link.
 */
export interface StacLink {
  rel: string;
  href: string;
  method?: string;
  body?: Record<string, unknown>;
}

/**
 * Minimal STAC FeatureCollection shape for /search responses we consume.
 */
export interface StacSearchResponse<T> {
  features: T[];
  context?: {
    matched?: number;
    returned?: number;
  };
  numberMatched?: number;
  numberReturned?: number;
  links?: StacLink[];
}

export interface PaginationState {
  hasMore: boolean;
  totalMatched: number;
  loadedCount: number;
  isLoadingMore: boolean;
  nextLink: StacLink | null;
}

/**
 * Items returned by the hook must have a bbox; geometry is optional and
 * (when present) is forwarded to FootprintsLayer for richer footprints.
 */
export interface StacFeatureWithBbox {
  bbox: [number, number, number, number];
  geometry?: Polygon;
}

export interface Footprint {
  bounds: [[number, number], [number, number]];
  geometry?: Polygon;
}

const INITIAL_PAGINATION: PaginationState = {
  hasMore: false,
  totalMatched: 0,
  loadedCount: 0,
  isLoadingMore: false,
  nextLink: null
};

interface UseStacSearchPaginationParams {
  /** Stable id used in log messages. */
  id: string;
  /** Full URL of the STAC /search endpoint. */
  searchUrl: string;
  /**
   * Initial search payload. Object identity does not need to be stable;
   * the hook reads the latest payload via a ref. The effect re-runs only
   * when `searchKey` changes.
   */
  payload: unknown;
  /**
   * Stable string capturing all inputs that should trigger a fresh search
   * (e.g. `${stacCol}|${date}|${endpoint}|${limit}|cog`). When this changes
   * the hook resets state and re-issues the initial search.
   */
  searchKey: string;
  /** If false, the hook does not fetch. Use to gate on required inputs. */
  enabled?: boolean;
  changeStatus: (params: { status: string; context: STATUS_KEY }) => void;
  /** Prefix for grouped console logs (e.g. 'RasterCogTimeseries'). */
  logPrefix: string;
  /** Whether to print request logs. */
  log?: boolean;
}

interface UseStacSearchPaginationReturn<T> {
  items: T[];
  footprints: Footprint[] | null;
  pagination: PaginationState;
  loadMore: () => void;
}

/**
 * Hook that performs a STAC `/search` request with paginated "Load More"
 * support. Shared between `raster-timeseries` (mosaic mode) and
 * `raster-cog-timeseries` (cog mode) — the two differ only in the payload
 * format and the feature shape, both supplied by the caller.
 *
 * Behaviour:
 * - Issues the initial search when `searchKey` changes.
 * - `loadMore()` follows the `rel: 'next'` link, honouring its HTTP method
 *   (POST with body, otherwise GET).
 * - On `searchKey` change, aborts any in-flight loadMore and resets state.
 * - Items are accumulated across pages; `pagination.loadedCount` tracks the
 *   total fetched so far and `pagination.totalMatched` reflects the server's
 *   reported match count.
 * - Produces `Footprint[]` for FootprintsLayer; uses `feature.geometry`
 *   when present and falls back to bbox otherwise.
 */
export function useStacSearchPagination<T extends StacFeatureWithBbox>({
  id,
  searchUrl,
  payload,
  searchKey,
  enabled = true,
  changeStatus,
  logPrefix,
  log = false
}: UseStacSearchPaginationParams): UseStacSearchPaginationReturn<T> {
  const [items, setItems] = useState<T[]>([]);
  const [pagination, setPagination] =
    useState<PaginationState>(INITIAL_PAGINATION);
  const loadMoreControllerRef = useRef<AbortController | null>(null);

  // Keep the latest payload accessible inside the load effect without making
  // the effect depend on the object's identity.
  const payloadRef = useRef(payload);
  payloadRef.current = payload;

  // Reset when searchKey changes. Also abort any in-flight loadMore so its
  // setState calls don't land after the dataset has changed.
  useEffect(() => {
    loadMoreControllerRef.current?.abort();
    loadMoreControllerRef.current = null;
    setItems([]);
    setPagination(INITIAL_PAGINATION);
  }, [searchKey]);

  useEffect(() => {
    if (!enabled || !id || !searchUrl) return;

    const controller = new AbortController();

    const load = async () => {
      try {
        changeStatus({ status: S_LOADING, context: STATUS_KEY.StacSearch });

        if (log) {
          /* eslint-disable no-console */
          console.groupCollapsed(
            `${logPrefix} %cLoading STAC items`,
            'color: orange;',
            id
          );
          console.log('Search URL', searchUrl);
          console.log('Payload', payloadRef.current);
          console.groupEnd();
          /* eslint-enable no-console */
        }

        const data = await requestQuickCache<StacSearchResponse<T>>({
          url: searchUrl,
          payload: payloadRef.current,
          controller
        });

        if (log) {
          /* eslint-disable no-console */
          console.groupCollapsed(
            `${logPrefix} %cReceived STAC items`,
            'color: green;',
            id
          );
          console.log('STAC response', data);
          console.groupEnd();
          /* eslint-enable no-console */
        }

        const features = data.features || [];
        const totalMatched =
          data.context?.matched ?? data.numberMatched ?? features.length;
        const nextLink = data.links?.find((l) => l.rel === 'next');

        setItems(features);
        setPagination({
          hasMore: !!nextLink,
          totalMatched,
          loadedCount: features.length,
          isLoadingMore: false,
          nextLink: nextLink || null
        });
        changeStatus({ status: S_SUCCEEDED, context: STATUS_KEY.StacSearch });
      } catch (error) {
        if (!controller.signal.aborted) {
          setItems([]);
          setPagination(INITIAL_PAGINATION);
          changeStatus({ status: S_FAILED, context: STATUS_KEY.StacSearch });
        }
        if (log) {
          /* eslint-disable no-console */
          console.log(`${logPrefix} %cAborted STAC search`, 'color: red;', id);
          console.log(error);
          /* eslint-enable no-console */
        }
      }
    };

    load();

    return () => {
      controller.abort();
      changeStatus({ status: 'idle', context: STATUS_KEY.StacSearch });
    };
    // changeStatus/payloadRef intentionally omitted: searchKey covers
    // re-fetch triggers and the payload is read from a ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey, id, searchUrl, enabled, logPrefix, log]);

  const loadMore = useCallback(async () => {
    if (!pagination.nextLink || pagination.isLoadingMore) return;

    const controller = new AbortController();
    loadMoreControllerRef.current?.abort();
    loadMoreControllerRef.current = controller;

    setPagination((prev) => ({ ...prev, isLoadingMore: true }));

    try {
      const isPost =
        pagination.nextLink.method === 'POST' && !!pagination.nextLink.body;
      const data = await requestQuickCache<StacSearchResponse<T>>({
        url: pagination.nextLink.href,
        method: isPost ? 'post' : 'get',
        payload: isPost ? pagination.nextLink.body : null,
        controller
      });

      if (controller.signal.aborted) return;

      const newFeatures = data.features || [];
      const nextLink = data.links?.find((l) => l.rel === 'next');

      setItems((prev) => [...prev, ...newFeatures]);
      setPagination((prev) => ({
        ...prev,
        hasMore: !!nextLink,
        loadedCount: prev.loadedCount + newFeatures.length,
        isLoadingMore: false,
        nextLink: nextLink || null
      }));
    } catch (error) {
      if (controller.signal.aborted) return;
      /* eslint-disable-next-line no-console */
      console.error('Error loading more STAC items:', error);
      setPagination((prev) => ({ ...prev, isLoadingMore: false }));
    } finally {
      if (loadMoreControllerRef.current === controller) {
        loadMoreControllerRef.current = null;
      }
    }
  }, [pagination.nextLink, pagination.isLoadingMore]);

  const footprints = useMemo<Footprint[] | null>(() => {
    if (!items.length) return null;
    return items.map((f) => {
      const [w, s, e, n] = f.bbox;
      return {
        bounds: [
          [w, s],
          [e, n]
        ],
        geometry: f.geometry
      };
    });
  }, [items]);

  return { items, footprints, pagination, loadMore };
}
