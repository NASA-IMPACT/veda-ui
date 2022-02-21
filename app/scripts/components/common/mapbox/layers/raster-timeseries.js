import { useEffect } from 'react';
import axios from 'axios';
import qs from 'qs';

const RASTER_ENDPOINT =
  'https://b38fnvpkoh.execute-api.us-east-1.amazonaws.com';

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
      console.log('🚀 ~ file: map.js ~ line 123 ~ load ~ data', response.data);

      const tileParams = qs.stringify(
        {
          assets: 'cog_default',
          ...sourceParams
        },
        { arrayFormat: 'comma' }
      );

      console.log('Adding source and layer', id);

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
