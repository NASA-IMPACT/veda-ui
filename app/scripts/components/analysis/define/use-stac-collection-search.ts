import { useMemo } from 'react';
import { FeatureCollection, Polygon } from 'geojson';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import booleanIntersects from '@turf/boolean-intersects';
import bboxPolygon from '@turf/bbox-polygon';
import { areIntervalsOverlapping } from 'date-fns';
import { DatasetLayer } from 'veda';

import { MAX_QUERY_NUM } from '../constants';
import { TimeseriesMissingSummaries, TimeseriesDataResult } from '../results/timeseries-data';
import { getNumberOfItemsWithinTimeRange } from './utils';
import { allAvailableDatasetsLayers } from '.';

import { utcString2userTzDate } from '$utils/date';

interface UseStacSearchProps {
  start?: Date;
  end?: Date;
  aoi?: FeatureCollection<Polygon> | null;
}

export type DatasetWithCollections = TimeseriesDataResult & DatasetLayer;
type DatasetMissingSummaries = TimeseriesMissingSummaries & DatasetLayer;
export type DatasetWithTimeseriesData = DatasetWithCollections & { numberOfItems: number };
export type InvalidDatasets = DatasetMissingSummaries | DatasetWithTimeseriesData;

const collectionEndpointSuffix = '/collections';

export function useStacCollectionSearch({
  start,
  end,
  aoi
}: UseStacSearchProps) {
  const readyToLoadDatasets = !!(start && end && aoi);

  const result = useQuery({
    queryKey: ['stacCollection'],
    queryFn: async ({ signal }) => {
      const collectionUrlsFromDataSets = allAvailableDatasetsLayers.reduce(
        (filtered, { stacApiEndpoint }) => {
          return stacApiEndpoint
            ? [...filtered, `${stacApiEndpoint}${collectionEndpointSuffix}`]
            : filtered;
        },
        []
      );
      // Get unique values of stac api endpoints from layer data, concat with api_stac_endpoiint from env var
      const collectionUrls = Array.from(
        new Set(collectionUrlsFromDataSets)
      ).concat(`${process.env.API_STAC_ENDPOINT}${collectionEndpointSuffix}`);

      const collectionRequests = collectionUrls.map((url: string) =>
        axios.get(url, { signal }).then((response) => {
          return response.data.collections.map((col) => ({
            ...col,
            stacApiEndpoint: url.replace(collectionEndpointSuffix, '')
          }));
        })
      );
      return axios.all(collectionRequests).then(
        // Merge all responses into one array
        axios.spread((...responses) => [].concat(...responses))
      );
    },
    enabled: readyToLoadDatasets
  });

  const datasetLayersInRange = useMemo(() => {
    try {
      return getInTemporalAndSpatialExtent(result.data, aoi, {
        start,
        end
      });
    } catch (e) {
      return [];
    }
  }, [result.data, aoi, start, end]);

  const [datasetsWithSummaries, invalidDatasets]: [DatasetWithCollections[], DatasetMissingSummaries[]] = datasetLayersInRange.reduce((result: [DatasetWithCollections[], DatasetMissingSummaries[]], d) => {
    /* eslint-disable-next-line fp/no-mutating-methods */
    d.timeseries ? result[0].push(d as DatasetWithCollections) : result[1].push(d as DatasetMissingSummaries);
    return result;
  },[[], []]);
  
  const datasetLayersInRangeWithNumberOfItems: DatasetWithTimeseriesData[] =
    useMemo(() => {
      return datasetsWithSummaries.map((l) => {
        const numberOfItems = getNumberOfItemsWithinTimeRange(start, end, l);
        return { ...l, numberOfItems };
      });
    }, [datasetsWithSummaries, start, end]);

  const selectableDatasetLayers = useMemo(() => {
    return datasetLayersInRangeWithNumberOfItems.filter(
      (l) => l.numberOfItems <= MAX_QUERY_NUM
    );
  }, [datasetLayersInRangeWithNumberOfItems]);

  const datasetsWithTooManyRequests: DatasetWithTimeseriesData[] = useMemo(() => {
    return datasetLayersInRangeWithNumberOfItems.filter(
      (l) => l.numberOfItems > MAX_QUERY_NUM
    );
  }, [datasetLayersInRangeWithNumberOfItems]);
  
  const unselectableDatasetLayers:InvalidDatasets[] = [...datasetsWithTooManyRequests, ...invalidDatasets];

  return {
    selectableDatasetLayers,
    unselectableDatasetLayers,
    stacSearchStatus: result.status,
    readyToLoadDatasets
  };
}

function getInTemporalAndSpatialExtent(collectionData, aoi, timeRange) {
  const matchingCollectionIds = collectionData.reduce((acc, col) => {
    try {
      const { id, stacApiEndpoint } = col;

      // Is is a dataset defined in the app?
      // If not, skip other calculations.
      const isAppDataset = allAvailableDatasetsLayers.some((l) => {
        const stacApiEndpointUsed =
          l.stacApiEndpoint ?? process.env.API_STAC_ENDPOINT;
        return l.stacCol === id && stacApiEndpointUsed === stacApiEndpoint;
      });
  
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
    } catch (e) {
      // If somehow the data is not in the shape we want, just skip it
      return acc;
    }

  }, []);

  const filteredDatasets = allAvailableDatasetsLayers.filter((l) =>
    matchingCollectionIds.includes(l.stacCol)
  );

  const filteredDatasetsWithCollections = filteredDatasets.map((l) => {
    const stacApiEndpointUsed =
      l.stacApiEndpoint ?? process.env.API_STAC_ENDPOINT;
    const collection = collectionData.find(
      (c) => c.id === l.stacCol && stacApiEndpointUsed === c.stacApiEndpoint
    );

    return {
      ...l,
      isPeriodic: collection['dashboard:is_periodic'],
      timeDensity: collection['dashboard:time_density'],
      domain: collection.extent.temporal.interval[0],
      timeseries: collection.summaries?.datetime,
    };
  });
  
  return filteredDatasetsWithCollections;
}
