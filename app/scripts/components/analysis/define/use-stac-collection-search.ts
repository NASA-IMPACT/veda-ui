import { useMemo } from 'react';
import { FeatureCollection, Polygon } from 'geojson';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import booleanIntersects from '@turf/boolean-intersects';
import bboxPolygon from '@turf/bbox-polygon';
import { areIntervalsOverlapping, eachDayOfInterval, eachMonthOfInterval, eachYearOfInterval } from 'date-fns';

import { TimeseriesDataResult } from '../results/timeseries-data';
import { allAvailableDatasetsLayers } from '.';

import { utcString2userTzDate } from '$utils/date';

interface UseStacSearchProps {
  start?: Date;
  end?: Date;
  aoi?: FeatureCollection<Polygon> | null;
}

const DATE_INTERVAL_FN = {
  day: eachDayOfInterval,
  month: eachMonthOfInterval,
  year: eachYearOfInterval
};

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

  const selectableDatasetLayersWithNumberOfItems = selectableDatasetLayers.map(
    (l) => {
      const numberOfItems = getNumberOfItemsWithinTimeRange(
        start,
        end,
        l
      );
      return { ...l, numberOfItems };
    }
  );

  return {
    selectableDatasetLayers: selectableDatasetLayersWithNumberOfItems,
    stacSearchStatus: result.status,
    readyToLoadDatasets
  };
}

function getNumberOfItemsWithinTimeRange(start, end, collection) {
  const {isPeriodic, timeDensity, domain, timeseries} = collection;
  if (!isPeriodic) {
    return timeseries.length; // Check in with back-end team
  }
  const eachOf = DATE_INTERVAL_FN[timeDensity];
  const statStart = +(new Date(domain[0])) > +(new Date(start))? new Date(domain[0]): new Date(start);
  const statEnd = +(new Date(domain[1])) < +(new Date(end))? new Date(domain[1]): new Date(end);

  return eachOf({start: statStart, end: statEnd}).length;
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

  const filteredDatasets = allAvailableDatasetsLayers.filter((l) =>
    matchingCollectionIds.includes(l.stacCol)
  );

  const filteredDatasetsWithCollections: TimeseriesDataResult[] =
    filteredDatasets.map((l) => {
      const collection = collectionData.find((c) => c.id === l.stacCol);
      return {
        ...l,
        isPeriodic: collection['dashboard:is_periodic'],
        timeDensity: collection['dashboard:time_density'],
        domain: collection.extent.temporal.interval[0],
        timeseries: collection.summaries.datetime
      };
    });

  return filteredDatasetsWithCollections;
}
