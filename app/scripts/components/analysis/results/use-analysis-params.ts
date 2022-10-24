import { useCallback, useEffect, useState } from 'react';
import qs from 'qs';
import { useLocation } from 'react-router';
import { Feature, MultiPolygon } from 'geojson';
import { DatasetLayer, datasets as deltaDatasets } from 'delta/thematics';

import { userTzDate2utcString, utcString2userTzDate } from '$utils/date';
import { polygonUrlDecode, polygonUrlEncode } from '$utils/polygon-url';

// ?start=2015-01-01T00:00:00.000Z&end=2022-01-01T00:00:00.000Z&datasets=no2-monthly|blue-tarp-planetscope&aoi=-9.60205,36.72127|-7.03125,36.87962|-6.85546,39.45316|-6.52587,40.93011|-5.55908,42.11452|-9.38232,42.22851|-8.89892,40.84706|-9.93164,38.85682|-9.47021,38.08268|-8.96484,38.09998||-12.01904,25.95804|-8.65722,25.97779|-8.67919,27.68352|-13.05175,27.68352|-14.89746,25.95804|-12.04101,24.44714

type AnalysisParams = {
  start: Date;
  end: Date;
  datasetsLayers: DatasetLayer[];
  aoi: Feature<MultiPolygon>;
  errors: any[] | null;
};

type AnalysisParamsNull = Omit<Partial<AnalysisParams>, 'errors'> & {
  errors: any[];
};

type AnyAnalysisParamsKey = keyof AnalysisParams;
type AnyAnalysisParamsType = Date | DatasetLayer[] | Feature<MultiPolygon>;

const initialState: AnalysisParamsNull = {
  start: undefined,
  end: undefined,
  datasetsLayers: undefined,
  aoi: undefined,
  errors: []
};

export function useAnalysisParams(): {
  params: AnalysisParams | AnalysisParamsNull;
  setAnalysisParam: (
    param: AnyAnalysisParamsKey,
    value: AnyAnalysisParamsType
  ) => void;
} {
  const location = useLocation();

  const [params, setParams] = useState<AnalysisParams | AnalysisParamsNull>(
    initialState
  );

  useEffect(() => {
    const { start, end, datasets, aoi } = qs.parse(location.search, {
      ignoreQueryPrefix: true
    });

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
        start: startDate,
        end: endDate,

        datasetsLayers: layers,
        aoi: geojson,
        errors: null
      });
    } catch (error) {
      if (Array.isArray(error)) {
        /* eslint-disable no-console */
        error.forEach((s) => console.log(s));
        /* eslint-enable no-console */

        setParams({
          ...initialState,
          errors: error
        });
      } else {
        throw error;
      }
    }
  }, [location.search]);

  const setAnalysisParam = useCallback(
    (param: AnyAnalysisParamsKey, value: AnyAnalysisParamsType) => {
      setParams({
        ...params,
        [param]: value
      });
    },
    [params]
  );

  return { params, setAnalysisParam };
}

export function analysisParams2QueryString(
  params: Omit<AnalysisParams | AnalysisParamsNull, 'errors'>
) {
  const urlParams = qs.stringify({
    start: params.start ? userTzDate2utcString(params.start) : undefined,
    end: params.end ? userTzDate2utcString(params.end) : undefined,
    datasets: params.datasetsLayers
      ? params.datasetsLayers.map((d) => d.id).join('|')
      : undefined,
    aoi: params.aoi ? polygonUrlEncode(params.aoi, 4) : undefined
  });

  return urlParams ? `?${urlParams}` : '';
}
