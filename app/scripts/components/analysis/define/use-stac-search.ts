import { DatasetLayer } from 'veda';
import { FeatureCollection, Polygon } from 'geojson';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { endOfDay, startOfDay } from 'date-fns';

import { combineFeatureCollection } from '../utils';
import { allAvailableDatasetsLayers } from '.';
import {
  ActionStatus,
  S_FAILED,
  S_IDLE,
  S_LOADING,
  S_SUCCEEDED
} from '$utils/status';

import { userTzDate2utcString } from '$utils/date';

interface UseStacSearchProps {
  start?: Date;
  end?: Date;
  aoi?: FeatureCollection<Polygon> | null;
}

export function useStacSearch({ start, end, aoi }: UseStacSearchProps) {
  const readyToLoadDatasets = !!(start && end && aoi);

  const [selectableDatasetLayers, setSelectableDatasetLayers] = useState<
    DatasetLayer[]
  >([]);

  const [stacSearchStatus, setStacSearchStatus] =
    useState<ActionStatus>(S_IDLE);

  useEffect(() => {
    if (!readyToLoadDatasets) return;
    const controller = new AbortController();

    const load = async () => {
      setStacSearchStatus(S_LOADING);
      try {
        const url = `${process.env.API_STAC_ENDPOINT}/collection-id-search`;

        const dStart = userTzDate2utcString(startOfDay(start));
        const dEnd = userTzDate2utcString(endOfDay(end));
        const payload = {
          intersects: combineFeatureCollection(aoi).geometry,
          datetime: `${dStart}/${dEnd}`
        };
        const response = await axios.post(url, payload, {
          signal: controller.signal
        });
        setStacSearchStatus(S_SUCCEEDED);
        setSelectableDatasetLayers(
          allAvailableDatasetsLayers.filter((l) => response.data.includes(l.id))
        );
      } catch (error) {
        if (!controller.signal.aborted) {
          setStacSearchStatus(S_FAILED);
        }
      }
    };

    load();

    return () => {
      controller.abort();
    };
  }, [start, end, aoi, readyToLoadDatasets]);

  return { selectableDatasetLayers, stacSearchStatus, readyToLoadDatasets };
}
