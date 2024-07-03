import {useState, useEffect} from 'react';
import qs from 'qs';
import { requestQuickCache, getFilterPayload } from '../utils';
import { S_FAILED, S_LOADING, S_SUCCEEDED } from '$utils/status';
import { 
  StacFeature,
  STATUS_KEY,
  ZarrResponseData,
  CMRResponseData,
  STACforCMRResponseData,  
} from '$components/common/map/types.d';

const LOG = true;

interface AssetUrlReplacement {
  from: string;
  to: string;
}

interface UseDatasetTilesOptions {
  id: string,
  stacCol: string,
  tileApiEndpointToUse?: string,
  stacApiEndpointToUse?: string,
  date: Date,
  onStatusChange: CallableFunction,
  sourceParams?: Record<string, any>,
  assetUrlReplacements?: AssetUrlReplacement,
  datasetType?: 'vector' | 'raster' | 'titiler-cmr' | 'zarr' | 'cmr-stac';
}

export interface TileUrls {
  tileJsonUrl?: string,
  wmtsUrl?: string,
  tileServerUrl?: string
}

type UseDatasetTilesFunction = (options: UseDatasetTilesOptions) => TileUrls;

function generateTileJsonUrlWithParams(tileParams: Record<string, any>, tileApiEndpointToUse?: string) {
  const paramsOptions = { arrayFormat: 'comma' };
  return `${tileApiEndpointToUse}?${qs.stringify(tileParams, paramsOptions)}`;
}

export const useZarr: UseDatasetTilesFunction = (options: UseDatasetTilesOptions) => {
  const { id, stacCol, tileApiEndpointToUse, stacApiEndpointToUse, date, onStatusChange, sourceParams } = options;
  const [tileUrls, setTileUrls] = useState<TileUrls>({});

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        onStatusChange({ status: S_LOADING, id });
        const data:ZarrResponseData = await requestQuickCache({
          url: `${stacApiEndpointToUse}/collections/${stacCol}`,
          method: 'GET',
          controller
        });

        if (data.assets.zarr.href) {
          const tileParams = {
            url: data.assets.zarr.href,
            time_slice: date,
            ...sourceParams
          };
          setTileUrls({
            tileJsonUrl: generateTileJsonUrlWithParams(tileParams, tileApiEndpointToUse),
          });
        }

        onStatusChange({ status: S_SUCCEEDED, id });
      } catch (error) {
        if (!controller.signal.aborted) {
          setTileUrls({});
          onStatusChange({ status: S_FAILED, id });
        }
        return;
      }
    }

    load();

    return () => {
      controller.abort();
    };
  }, [id, stacCol, tileApiEndpointToUse, stacApiEndpointToUse, date, onStatusChange, sourceParams]);
  return tileUrls;
};


export const useCMRSTAC: UseDatasetTilesFunction = (options: UseDatasetTilesOptions) => {
  const { id, stacCol, tileApiEndpointToUse, stacApiEndpointToUse, date, onStatusChange, sourceParams, assetUrlReplacements } = options;
  const [tileUrls, setTileUrls] = useState({});

  const replaceInAssetUrl = (url: string, replacement: AssetUrlReplacement) => {
    const {from, to } = replacement;
    const cmrAssetUrl = url.replace(from, to);
    return cmrAssetUrl;
  };


  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        onStatusChange({ status: S_LOADING, id });
        if (!assetUrlReplacements) throw (new Error('CMR  layer requires asset url remplacement attributes'));

        // Zarr collections in _VEDA_ should have a single entrypoint (zarr or virtual zarr / reference)
        // CMR endpoints will be using individual items' assets, so we query for the asset url
        const data:CMRResponseData = await requestQuickCache({
          url: `${stacApiEndpointToUse}/search?collections=${stacCol}&datetime=${date?.toISOString()}`,
          method: 'GET',
          controller
        });

        const assetUrl = replaceInAssetUrl(data.features[0].assets.data.href, assetUrlReplacements);
        const tileParams = {
          url: assetUrl,
          time_slice: date,
          ...sourceParams
        };
        setTileUrls({
          tileJsonUrl: generateTileJsonUrlWithParams(tileParams, tileApiEndpointToUse),
        });
        onStatusChange({ status: S_SUCCEEDED, id });
      } catch (error) {
        if (!controller.signal.aborted) {
          setTileUrls({});
          onStatusChange({ status: S_FAILED, id });
        }
        return;
      }
    }

    load();

    return () => {
      controller.abort();
    };
  }, [id, stacCol, tileApiEndpointToUse, stacApiEndpointToUse, date, assetUrlReplacements, onStatusChange, sourceParams]);

  return tileUrls;

};

interface CmrSourceParams {
  concept_id: string;
  datetime: Date;
  variable?: string; // Assuming variable is of type string and optional
  [key: string]: any; // This allows for additional properties not explicitly defined
}

export const useTitilerCMR: UseDatasetTilesFunction = (options: UseDatasetTilesOptions) => {
  const { id, stacCol, tileApiEndpointToUse, stacApiEndpointToUse, date, onStatusChange, sourceParams } = options;
  const [tileUrls, setTileUrls] = useState({});

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        onStatusChange({ status: S_LOADING, id });

        const data: STACforCMRResponseData = await requestQuickCache({
          url: `${stacApiEndpointToUse}/collections/${stacCol}`,
          method: 'GET',
          controller
        });

        const baseParams: CmrSourceParams = {
          concept_id: data.collection_concept_id,
          datetime: date,
          ...sourceParams
        };

        const variable = sourceParams?.variable;

        if (variable) {
          baseParams.variable = variable;
          const renderParams = data.renders[variable] || {};
          const tileParams = { ...renderParams, ...baseParams };
          setTileUrls({
            tileJsonUrl: generateTileJsonUrlWithParams(tileParams, tileApiEndpointToUse),
          });
        } else {
          setTileUrls(baseParams);
        }

        onStatusChange({ status: S_SUCCEEDED, id });
      } catch (error) {
        if (!controller.signal.aborted) {
          setTileUrls({});
          onStatusChange({ status: S_FAILED, id });
        }
        return;
      }
    }

    load();

    return () => {
      controller.abort();
    };
  }, [id, stacCol, tileApiEndpointToUse, stacApiEndpointToUse, date, onStatusChange, sourceParams]);

  return tileUrls;
};

export function useMosaic(options: UseDatasetTilesOptions) {
  const { id, tileApiEndpointToUse, stacCol, date, sourceParams, datasetType } = options;
  const [tileUrls, setTileUrls] = useState({});

  useEffect(() => {
    if (!id || !stacCol) return;
    if (datasetType !== 'raster') return;

    const controller = new AbortController();

    const load = async () => {
      try {
        const payload = {
          'filter-lang': 'cql2-json',
          filter: getFilterPayload(date, stacCol)
        };

        /* eslint-disable no-console */
        LOG &&
          console.groupCollapsed(
            'RasterTimeseries %cLoading Mosaic',
            'color: orange;',
            id
          );
        LOG && console.log('Payload', payload);
        LOG && console.groupEnd();
        /* eslint-enable no-console */

        const responseData = await requestQuickCache<any>({
          url: `${tileApiEndpointToUse}/mosaic/register`,
          payload,
          controller
        });

        const registeredMosaicUrl = responseData.links[1].href;

        // create tileUrls
        const tileParamsAsString = qs.stringify(
          {
            assets: 'cog_default',
            ...(sourceParams ?? {})
          },
          // Temporary solution to pass different tile parameters for hls data
          {
            arrayFormat: id.toLowerCase().includes('hls') ? 'repeat' : 'comma'
          }
        );

        const tileJsonUrl = `${registeredMosaicUrl}?${tileParamsAsString}`;
        let tileServerUrl = '';
        try {
          const tileJsonData: Record<string, any> = await requestQuickCache({
            url: tileJsonUrl,
            method: 'GET',
            payload: null,
            controller
          });
          tileServerUrl = tileJsonData.tiles[0];
        } catch (error) {
          // Ignore errors.
        }

        const wmtsUrl = `${registeredMosaicUrl.replace('tilejson.json', 'WMTSCapabilities.xml')}?${tileParamsAsString}`;

        setTileUrls({tileJsonUrl, wmtsUrl, tileServerUrl});

        /* eslint-disable no-console */
        LOG &&
          console.groupCollapsed(
            'RasterTimeseries %cAdding Mosaic',
            'color: green;',
            id
          );
        // links[0] : metadata , links[1]: tile
        LOG && console.log('Url', responseData.links[1].href);
        LOG && console.log('STAC response', responseData);
        LOG && console.groupEnd();
      } catch (error) {
        LOG &&
          /* eslint-disable-next-line no-console */
          console.log('RasterTimeseries %cAborted Mosaic', 'color: red;', id);
          console.log(error);
      }
    };

    load();

    return () => {
      controller.abort();
    };
  }, [
    id,
    stacCol,
    tileApiEndpointToUse,
    date,
    sourceParams,
    datasetType
  ]);
  return tileUrls;
}

// Load stac collection features
// stacCollection could also get passed through to the raster timeseries as an optional parameter
// but how to handle change status
export function useStacCollection(options: UseDatasetTilesOptions) {
  const { id, stacCol, date, stacApiEndpointToUse, onStatusChange, datasetType } = options;
  const [stacCollection, setStacCollection] = useState<StacFeature[]>([]);
  useEffect(() => {
    if (!id || !stacCol) return;
    if (datasetType !== 'raster') return;

    const controller = new AbortController();

    const load = async () => {
      try {
        onStatusChange({ status: S_LOADING, context: STATUS_KEY.StacSearch });
        const payload = {
          'filter-lang': 'cql2-json',
          filter: getFilterPayload(date, stacCol),
          limit: 500,
          fields: {
            include: ['bbox'],
            exclude: ['collection', 'links']
          }
        };

        /* eslint-disable no-console */
        LOG &&
          console.groupCollapsed(
            'RasterTimeseries %cLoading STAC features',
            'color: orange;',
            id
          );
        LOG && console.log('Payload', payload);
        LOG && console.groupEnd();
        /* eslint-enable no-console */

        const responseData = await requestQuickCache<any>({
          url: `${stacApiEndpointToUse}/search`,
          payload,
          controller
        });

        /* eslint-disable no-console */
        LOG &&
          console.groupCollapsed(
            'RasterTimeseries %cAdding STAC features',
            'color: green;',
            id
          );
        LOG && console.log('STAC response', responseData);
        LOG && console.groupEnd();
        /* eslint-enable no-console */

        setStacCollection(responseData.features);
        onStatusChange({ status: S_SUCCEEDED, context: STATUS_KEY.StacSearch });
      } catch (error) {
        if (!controller.signal.aborted) {
          setStacCollection([]);
          onStatusChange({ status: S_FAILED, context: STATUS_KEY.StacSearch });
        }
        LOG &&
          /* eslint-disable-next-line no-console */
          console.log(
            'RasterTimeseries %cAborted STAC features',
            'color: red;',
            id
          );
        return;
      }
    };
    load();
    return () => {
      controller.abort();
      onStatusChange({ status: 'idle', context: STATUS_KEY.StacSearch });
    };
  }, [id, onStatusChange, stacCol, date, stacApiEndpointToUse, datasetType]);  
  return stacCollection;
}