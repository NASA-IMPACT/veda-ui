import { useEffect } from 'react';
import axios from 'axios';
import qs from 'qs';

import { RASTER_ENDPOINT } from './utils';

export function MapLayerRasterTimeseries(props) {
  const { id, layerId, date, mapInstance, sourceParams = {} } = props;

  useEffect(() => {
    if (!id || !layerId || !date) return;

    const load = async () => {
      console.log('start loading');
      const response = await axios.post(`${RASTER_ENDPOINT}/mosaic/register`, {
        filter: {
          op: 'and',
          args: [
            {
              op: 'eq',
              args: [{ property: 'datetime' }, date.toISOString()]
            },
            {
              op: 'eq',
              args: [{ property: 'collection' }, layerId]
            }
          ]
        }
      });

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
    };

    load();

    return () => {
      if (mapInstance.getSource(id)) {
        mapInstance.removeLayer(id);
        mapInstance.removeSource(id);
      }
    };
  }, [id, layerId, date, mapInstance, sourceParams]);

  return null;
}
