import { useEffect } from 'react';
import axios from 'axios';
import qs from 'qs';

import { RASTER_ENDPOINT } from './utils';
import { userTzDate2utcString } from '$utils/date';

export function MapLayerRasterTimeseries(props) {
  const { id, layerId, date, mapInstance, sourceParams = {} } = props;

  useEffect(() => {
    if (!id || !layerId || !date) return;

    const controller = new AbortController();

    const load = async () => {
      try {
        console.log('start loading');
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

        console.log('Adding source and layer', id, response.data.tiles);

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
        return;
      }
    };

    load();

    return () => {
      controller && controller.abort();

      if (mapInstance.getSource(id)) {
        mapInstance.removeLayer(id);
        mapInstance.removeSource(id);
      }
    };
  }, [id, layerId, date, mapInstance, sourceParams]);

  return null;
}
