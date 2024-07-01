import {useState, useEffect} from 'react';
import { requestQuickCache, getFilterPayload } from '../utils';
import { S_FAILED, S_LOADING, S_SUCCEEDED } from '$utils/status';
import { 
  StacFeature,
  STATUS_KEY,
  ZarrResponseData,
  AssetUrlReplacement,
  CMRResponseData,
  STACforCMRResponseData,  
} from '$components/common/map/types.d';

const LOG = true;

export function useZarr({ id, stacCol, stacApiEndpointToUse, date, onStatusChange, sourceParams }){
  const [tileParams, setTileParams] = useState({});

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
          setTileParams({
            url: data.assets.zarr.href,
            time_slice: date,
            ...sourceParams
          });
        }

        onStatusChange?.({ status: S_SUCCEEDED, id });
      } catch (error) {
        if (!controller.signal.aborted) {
          setTileParams({});
          onStatusChange?.({ status: S_FAILED, id });
        }
        return;
      }
    }

    load();

    return () => {
      controller.abort();
    };
  }, [id, stacCol, stacApiEndpointToUse, date, onStatusChange, sourceParams]);

  return tileParams;
}



export function useCMRSTAC({ id, stacCol, stacApiEndpointToUse, date, assetUrlReplacements, onStatusChange, sourceParams }){
  const [tileParams, setTileParams] = useState({});

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
        const data:CMRResponseData = await requestQuickCache({
          url: `${stacApiEndpointToUse}/search?collections=${stacCol}&datetime=${date?.toISOString()}`,
          method: 'GET',
          controller
        });

        const assetUrl = replaceInAssetUrl(data.features[0].assets.data.href, assetUrlReplacements);
        setTileParams({
          url: assetUrl,
          time_slice: date,
          ...sourceParams
        });
        onStatusChange?.({ status: S_SUCCEEDED, id });
      } catch (error) {
        if (!controller.signal.aborted) {
          setTileParams({});
          onStatusChange?.({ status: S_FAILED, id });
        }
        return;
      }
    }

    load();

    return () => {
      controller.abort();
    };
  }, [id, stacCol, stacApiEndpointToUse, date, assetUrlReplacements, stacApiEndpoint, onStatusChange, sourceParams]);

  return tileParams;

}


export function useTitilerCMR({ id, stacCol, stacApiEndpointToUse, date, onStatusChange, sourceParams }){
  const [tileParams, setTileParams] = useState({});

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        onStatusChange?.({ status: S_LOADING, id });

        const data: STACforCMRResponseData = await requestQuickCache({
          url: `${stacApiEndpointToUse}/collections/${stacCol}`,
          method: 'GET',
          controller
        });

        const baseParams = {
          concept_id: data.collection_concept_id,
          datetime: date,
          ...sourceParams
        };

        const variable = sourceParams?.variable;

        if (variable) {
          baseParams.variable = variable;
          const renderParams = data.renders[variable] || {};
          setTileParams({ ...renderParams, ...baseParams });
        } else {
          setTileParams(baseParams);
        }

        onStatusChange?.({ status: S_SUCCEEDED, id });
      } catch (error) {
        if (!controller.signal.aborted) {
          setTileParams({});
          onStatusChange?.({ status: S_FAILED, id });
        }
        return;
      }
    }

    load();

    return () => {
      controller.abort();
    };
  }, [id, stacCol, stacApiEndpointToUse, date, onStatusChange, sourceParams]);

  return tileParams;
}

export function useMosaic({id, stacCol, tileApiEndpointToUse, date, sourceParams}) {
  const [tileUrlWithParams, setTileUrlWithParams] = useState<string>('');
  const [wmtsTilesUrl, setWmtsTilesUrl] = useState<string>('');

  useEffect(() => {
    if (!id || !stacCol) return;

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

        // create tileParams
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

        // don't fully understand this
        // this is diff from how other layers work because they don't use tilejson endpoint
        const tilejsonData = await requestQuickCache<any>({
          url: tileJsonUrl,
          method: 'GET',
          payload: null,
          controller
        });

        setTileUrlWithParams(tilejsonData.tiles[0]);
        const wmtsUrlWithParams = `${registeredMosaicUrl.replace('tilejson.json', 'WMTSCapabilities.xml')}?${tileParamsAsString}`;
        setWmtsTilesUrl(wmtsUrlWithParams);

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
    sourceParams
  ]);
  return [tileUrlWithParams, wmtsTilesUrl];
}

// Load stac collection features
// stacCollection could also get passed through to the raster timeseries as an optional parameter
// but how to handle change status
export function useStacCollection({ id, stacCol, date, stacApiEndpoint, onStatusChange }) {
  const stacApiEndpointToUse = stacApiEndpoint ?? process.env.API_STAC_ENDPOINT ?? '';
  const [stacCollection, setStacCollection] = useState<StacFeature[]>([]);
  useEffect(() => {
    if (!id || !stacCol) return;

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
  }, [id, onStatusChange, stacCol, date, stacApiEndpointToUse]);  
  return stacCollection;
}