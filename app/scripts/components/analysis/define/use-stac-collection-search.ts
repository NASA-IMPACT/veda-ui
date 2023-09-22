import { useMemo } from 'react';
import { FeatureCollection, Polygon } from 'geojson';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import booleanIntersects from '@turf/boolean-intersects';
import bboxPolygon from '@turf/bbox-polygon';
import { areIntervalsOverlapping } from 'date-fns';

import { allAvailableDatasetsLayers } from '.';

import { utcString2userTzDate } from '$utils/date';

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

  const result = useQuery({
    queryKey: ['stacCollection'],
    queryFn: async ({ signal }) => {
      const collectionResponse = await axios.get(collectionUrl, {
        signal
      });
      return collectionResponse.data.collections;
    },
    enabled: readyToLoadDatasets
  });

  const selectableDatasetLayers = useMemo(() => {
    try {
      return getInTemporalAndSpatialExtent(result.data, aoi, {
        start,
        end
      });
    } catch (e) {
      return [];
    }
  }, [result.data, aoi, start, end]);

  return {
    selectableDatasetLayers: selectableDatasetLayers,
    stacSearchStatus: result.status,
    readyToLoadDatasets
  };
}

function getInTemporalAndSpatialExtent(collectionData, aoi, timeRange) {
  const matchingCollectionIds = collectionData.reduce((acc, col) => {
    const id = col.id;

    // Is is a dataset defined in the app?
    // If not, skip other calculations.
    const isAppDataset = allAvailableDatasetsLayers.some(
      (l) => l.stacCol === id
    );

    if (
      !isAppDataset ||
      !col.extent.spatial.bbox ||
      !col.extent.temporal.interval
    ) {
      return acc;
    }

    const bbox = col.extent.spatial.bbox[0];
    const start = utcString2userTzDate(col.extent.temporal.interval[0][0]);
    const end = utcString2userTzDate(col.extent.temporal.interval[0][1]);

    const isInAOI = aoi.features.some((feature) =>
      booleanIntersects(feature, bboxPolygon(bbox))
    );

    const isInTOI = areIntervalsOverlapping(
      { start: new Date(timeRange.start), end: new Date(timeRange.end) },
      {
        start: new Date(start),
        end: new Date(end)
      }
    );

    if (isInAOI && isInTOI) {
      return [...acc, id];
    } else {
      return acc;
    }
  }, []);

  return allAvailableDatasetsLayers.filter((l) =>
    matchingCollectionIds.includes(l.stacCol)
  );
}
