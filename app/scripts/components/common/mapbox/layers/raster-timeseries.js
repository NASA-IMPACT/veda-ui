import { useEffect } from 'react';
import axios from 'axios';
import qs from 'qs';

import { RASTER_ENDPOINT } from './utils';
import { userTzDate2utcString } from '$utils/date';

const LOG = true;

export function MapLayerRasterTimeseries(props) {
  const { id, layerId, date, mapInstance, sourceParams = {} } = props;

  useEffect(() => {
    if (!id || !layerId || !date) return;

    const controller = new AbortController();

    const load = async () => {
      try {
        LOG &&
          /* eslint-disable-next-line no-console */
          console.groupCollapsed(
            'MapLayerRasterTimeseries %cLoading',
            'color: orange;',
            id
          );

        const payload = {
          filter: {
            op: 'and',
            args: [
              {
                op: 'eq',
                args: [{ property: 'datetime' }, userTzDate2utcString(date)]
              },
              {
                op: 'eq',
                args: [{ property: 'collection' }, layerId]
              }
            ]
          }
        };

        /* eslint-disable no-console */
        LOG && console.log('Payload', payload);
        LOG && console.log('Source Params', sourceParams);
        LOG && console.groupEnd();
        /* eslint-enable no-console */

        const response = await axios.post(
          `${RASTER_ENDPOINT}/mosaic/register`,
          payload,
          {
            signal: controller.signal
          }
        );

        const tileParams = qs.stringify(
          {
            assets: 'cog_default',
            ...sourceParams
          },
          { arrayFormat: 'comma' }
        );

        /* eslint-disable no-console */
        LOG &&
          console.groupCollapsed(
            'MapLayerRasterTimeseries %cAdding',
            'color: green;',
            id
          );
        LOG && console.log('Url', response.data.tiles);
        LOG && console.log('STAC response', response.data);
        LOG && console.groupEnd();
        /* eslint-enable no-console */

        mapInstance.addSource(id, {
          type: 'raster',
          url: `${response.data.tiles}?${tileParams}`
        });

        mapInstance.addLayer({
          id: id,
          type: 'raster',
          source: id
        });
      } catch (error) {
        LOG &&
          /* eslint-disable-next-line no-console */
          console.log('MapLayerRasterTimeseries %cAborted', 'color: red;', id);
        return;
      }
    };

    load();

    return () => {
      controller && controller.abort();

      if (mapInstance?.getSource(id)) {
        mapInstance.removeLayer(id);
        mapInstance.removeSource(id);
      }
    };
  }, [id, layerId, date, mapInstance, sourceParams]);

  return null;
}
