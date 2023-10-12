import { useCallback, useEffect, useState } from 'react';
import qs from 'qs';
import { useLocation } from 'react-router';
import { FeatureCollection, Polygon } from 'geojson';
import { DatasetLayer, datasets as vedaDatasets } from 'veda';

import { userTzDate2utcString, utcString2userTzDate } from '$utils/date';
import { polygonUrlDecode, polygonUrlEncode } from '$utils/polygon-url';

// ?start=2020-01-01T00%3A00%3A00.000Z&end=2020-03-01T00%3A00%3A00.000Z&datasetsLayers=no2-monthly&aoi=ngtcAqjcyEqihCg_%60%7C%40c%7CbyAr%60tJftcApyb~%40%7C%7C%60g~vA%7DlirHc%7BhyBf%60wAngtcA%7D_qaA

export interface AnalysisParams {
  start: Date;
  end: Date;
  datasetsLayers: DatasetLayer[];
  aoi: FeatureCollection<Polygon>;
  errors: any[] | null;
}

type AnalysisParamsNull = Omit<Partial<AnalysisParams>, 'errors'> & {
  errors: any[] | null;
};

type AnyAnalysisParamsKey = keyof AnalysisParams;
type AnyAnalysisParamsType = Date | DatasetLayer[] | FeatureCollection<Polygon>;

const initialState: AnalysisParamsNull = {
  start: new Date(2018, 0, 1),
  end: new Date(2022, 11, 31),
  datasetsLayers: undefined,
  aoi: undefined,
  errors: null
};

const LOG = process.env.NODE_ENV !== 'production';
export class ValidationError extends Error {
  hints: any[];

  constructor(hints: any[]) {
    super('Invalid parameters');
    this.hints = hints;
  }
}

export function useAnalysisParams(): {
  params: AnalysisParams | AnalysisParamsNull;
  setAnalysisParam: (
    param: AnyAnalysisParamsKey,
    value: AnyAnalysisParamsType | null
  ) => void;
} {
  const location = useLocation();

  const [params, setParams] = useState<AnalysisParams | AnalysisParamsNull>(
    initialState
  );

  useEffect(() => {
    const { start, end, datasetsLayers, aoi } = qs.parse(location.search, {
      ignoreQueryPrefix: true
    });

    try {
      if (!start || !end || !datasetsLayers || !aoi) {
        throw new ValidationError([
          'Missing required value from URL:',
          {
            start,
            end,
            datasetsLayers,
            aoi
          }
        ]);
      }

      const startDate = utcString2userTzDate(start);
      const endDate = utcString2userTzDate(end);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new ValidationError([
          'Invalid start or end date:',
          {
            start,
            end
          }
        ]);
      }

      // Create an array with all the dataset layers.
      const allDatasetLayers = Object.values(vedaDatasets).flatMap(
        // When accessing the object values with Object.values, they'll always
        // be defined.
        (d) => d!.data.layers
      ).filter((l) => !l.analysis?.exclude);
      const layers = datasetsLayers.split('|').map((id) =>
        // Find the one we're looking for.
        allDatasetLayers.find((l) => l.id === id)
      );

      if (!datasetsLayers.length || layers.includes(undefined)) {
        const sentences = ['Invalid dataset layer ids found:'];
        layers.forEach((l, i) => {
          if (!l) {
            /* eslint-disable-next-line fp/no-mutating-methods */
            sentences.push(`- ${datasetsLayers.split('|')[i]}`);
          }
        });

        throw new ValidationError(sentences);
      }

      // polyline-encoding;polyline-encoding
      // ; separates polygons
      const { geojson, errors: gjvErrors } = polygonUrlDecode(aoi);

      if (gjvErrors.length) {
        throw new ValidationError(['Invalid AOI string:', ...gjvErrors]);
      }

      setParams({
        start: startDate,
        end: endDate,
        datasetsLayers: layers,
        aoi: geojson,
        errors: null
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        /* eslint-disable no-console */
        if (LOG) error.hints.forEach((s) => console.log(s));
        /* eslint-enable no-console */
        setParams({
          ...initialState,
          errors: error.hints
        });
      } else {
        throw error;
      }
    }
  }, [location.search]);

  const setAnalysisParam = useCallback(
    (param: AnyAnalysisParamsKey, value: AnyAnalysisParamsType) => {
      setParams((oldParams) => ({
        ...oldParams,
        [param]: value
      }));
    },
    []
  );

  return { params, setAnalysisParam };
}

export function analysisParams2QueryString(
  params: Omit<AnalysisParams | AnalysisParamsNull, 'errors'>
) {
  const urlParams = qs.stringify({
    start: params.start ? userTzDate2utcString(params.start) : undefined,
    end: params.end ? userTzDate2utcString(params.end) : undefined,
    datasetsLayers: params.datasetsLayers
      ? params.datasetsLayers.map((d) => d.id).join('|')
      : undefined,
    aoi: params.aoi ? polygonUrlEncode(params.aoi) : undefined
  });

  return urlParams ? `?${urlParams}` : '';
}
