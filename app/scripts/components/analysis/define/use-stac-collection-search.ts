import { DatasetLayer } from 'veda';
import { FeatureCollection, Polygon } from 'geojson';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
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

const collectionUrl = `${process.env.API_STAC_ENDPOINT}/collections`;

export function useStacCollectionSearch({
  start,
  end,
  aoi
}: UseStacSearchProps) {
  const readyToLoadDatasets = !!(start && end && aoi);

  const [selectableDatasetLayers, setSelectableDatasetLayers] = useState<
    DatasetLayer[]
  >([]);

  const [stacSearchStatus, setStacSearchStatus] =
    useState<ActionStatus>(S_IDLE);

  const { data: collectionData } = useQuery({
    queryKey: ['stacCollection'],
    queryFn: async ({ signal }) => {
      setStacSearchStatus(S_LOADING);
      try {
        const collectionResponse = await axios.get(collectionUrl, {
          signal
        });
        setStacSearchStatus(S_SUCCEEDED);
        return collectionResponse.data.collections;
      } catch (e) {
        if (!signal?.aborted) {
          setStacSearchStatus(S_FAILED);
        }
      }
    },
    enabled: readyToLoadDatasets
  });

  useEffect(() => {
    if (!collectionData || !readyToLoadDatasets) return;
    try {
      setStacSearchStatus(S_LOADING);
      const matchingCollectionIds = collectionData
        .filter(
          (col) => col.extent.spatial.bbox && col.extent.temporal.interval
        )
        .map((col) => {
          return {
            id: col.id,
            bbox: col.extent.spatial.bbox[0],
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
      setSelectableDatasetLayers(
        allAvailableDatasetsLayers.filter((l) =>
          matchingCollectionIds.includes(l.stacCol)
        )
      );
    } catch (e) {
      setStacSearchStatus(S_FAILED);
    }
    setStacSearchStatus(S_SUCCEEDED);
  }, [collectionData, start, end, aoi, readyToLoadDatasets]);

  return { selectableDatasetLayers, stacSearchStatus, readyToLoadDatasets };
}
