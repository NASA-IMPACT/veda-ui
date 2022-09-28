import { useEffect, useState } from 'react';
import qs from 'qs';
import { useLocation, useNavigate } from 'react-router';
import { FeatureCollection, Polygon } from 'geojson';
import { DatasetLayer, datasets as deltaDatasets } from 'delta/thematics';

import { thematicAnalysisPath } from '$utils/routes';
import { useThematicArea } from '$utils/thematics';
import { utcString2userTzDate } from '$utils/date';
import { polygonUrlDecode } from '$utils/polygon-url';

// ?start=2015-01-01T00:00:00.000Z&end=2022-01-01T00:00:00.000Z&datasets=no2-monthly|blue-tarp-planetscope&aoi=-9.60205,36.72127|-7.03125,36.87962|-6.85546,39.45316|-6.52587,40.93011|-5.55908,42.11452|-9.38232,42.22851|-8.89892,40.84706|-9.93164,38.85682|-9.47021,38.08268|-8.96484,38.09998||-12.01904,25.95804|-8.65722,25.97779|-8.67919,27.68352|-13.05175,27.68352|-14.89746,25.95804|-12.04101,24.44714

type AnalysisParams =
  | {
      date: {
        start: Date;
        end: Date;
      };
      datasetsLayers: DatasetLayer[];
      aoi: FeatureCollection<Polygon>;
    }
  | {
      date: {
        start: null;
        end: null;
      };
      datasetsLayers: null;
      aoi: null;
    };

export function useAnalysisParams(): AnalysisParams {
  const thematic = useThematicArea();
  const location = useLocation();
  const navigate = useNavigate();

  const [params, setParams] = useState<AnalysisParams>({
    date: {
      start: null,
      end: null
    },
    datasetsLayers: null,
    aoi: null
  });

  useEffect(() => {
    const { start, end, datasets, aoi } = qs.parse(location.search, {
      ignoreQueryPrefix: true
    });

    const analysisPath = thematicAnalysisPath(thematic);

    try {
      if (!start || !end || !datasets || !aoi) {
        throw [
          'Missing required value from URL:',
          {
            start,
            end,
            datasets,
            aoi
          }
        ];
      }

      const startDate = utcString2userTzDate(start);
      const endDate = utcString2userTzDate(end);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw [
          'Invalid start or end date:',
          {
            start,
            end
          }
        ];
      }

      // Create an array with all the dataset layers.
      const allDatasetLayers = Object.values(deltaDatasets).flatMap(
        (d) => d.data.layers
      );
      const layers = datasets.split('|').map((id) =>
        // Find the one we're looking for.
        allDatasetLayers.find((l) => l.id === id)
      );

      if (!datasets.length || layers.includes(undefined)) {
        const sentences = ['Invalid dataset layer ids found:'];
        layers.forEach((l, i) => {
          if (!l) {
            sentences.push(`- ${datasets.split('|')[i]}`);
          }
        });

        throw sentences;
      }

      // lon,lat|lon,lat||lon,lat|lon,lat
      // || separates polygons
      // | separates points
      const { geojson, errors: gjvErrors } = polygonUrlDecode(aoi);

      if (gjvErrors.length) {
        throw ['Invalid AOI string:', ...gjvErrors];
      }

      setParams({
        date: {
          start: startDate,
          end: endDate
        },
        datasetsLayers: layers,
        aoi: geojson
      });
    } catch (error) {
      if (Array.isArray(error)) {
        /* eslint-disable no-console */
        error.forEach((s) => console.log(s));
        console.log('Redirecting user');
        /* eslint-enable no-console */
        // TODO: Uncomment!!!
        // navigate(analysisPath);
      } else {
        throw error;
      }
    }
  }, [thematic, navigate, location.search]);

  return params;
}
