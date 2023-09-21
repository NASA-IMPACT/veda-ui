import { DatasetLayer } from 'veda';
import { FeatureCollection, Polygon } from 'geojson';
import { useEffect, useState } from 'react';
import axios from 'axios';
import booleanIntersects from '@turf/boolean-intersects';
import bboxPolygon from '@turf/bbox-polygon';
import { areIntervalsOverlapping } from 'date-fns';

import { allAvailableDatasetsLayers } from '.';
import { utcString2userTzDate } from '$utils/date';
import {
  ActionStatus,
  S_FAILED,
  S_IDLE,
  S_LOADING,
  S_SUCCEEDED
} from '$utils/status';

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
        const collectionUrl = `${process.env.API_STAC_ENDPOINT}/collections`;
        const collectionResponse = await axios.get(collectionUrl, {
          signal: controller.signal
        });

        const matchingCollectionIds = collectionResponse.data.collections
          .filter(
            (col) => col.extent.spatial.bbox && col.extent.temporal.interval
          )
          .map((col) => {
            return {
              id: col.id,
              bbox: col.extent.spatial.bbox[0], // Check
              start: utcString2userTzDate(col.extent.temporal.interval[0][0]),
              end: utcString2userTzDate(col.extent.temporal.interval[0][1])
            };
          })
          .filter((col) => {
            return (
              aoi.features.some((feature) =>
                booleanIntersects(feature, bboxPolygon(col.bbox))
              ) &&
              areIntervalsOverlapping(
                { start: new Date(start), end: new Date(end) },
                {
                  start: new Date(col.start),
                  end: new Date(col.end)
                }
              )
            );
          })
          .map((c) => c.id);

        setStacSearchStatus(S_SUCCEEDED);

        setSelectableDatasetLayers(
          allAvailableDatasetsLayers.filter((l) =>
            matchingCollectionIds.includes(l.stacCol)
          )
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
