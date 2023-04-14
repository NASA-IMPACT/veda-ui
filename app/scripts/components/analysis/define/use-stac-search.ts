import { DatasetLayer } from 'veda';
import { FeatureCollection, Polygon } from 'geojson';
import { useEffect, useState } from 'react';
import { uniq } from 'lodash';
import axios from 'axios';
import { getFilterPayload } from '../utils';
import { allAvailableDatasetsLayers } from '.';
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
        const url = `${process.env.API_STAC_ENDPOINT}/search`;

        const allAvailableDatasetsLayersIds = allAvailableDatasetsLayers.map(
          (layer) => layer.id
        );
        const payload = {
          'filter-lang': 'cql2-json',
          filter: getFilterPayload(
            start,
            end,
            aoi,
            allAvailableDatasetsLayersIds
          ),
          limit: 100,
          fields: {
            exclude: [
              'links',
              'assets',
              'bbox',
              'geometry',
              'properties',
              'stac_extensions',
              'stac_version',
              'type'
            ]
          }
        };
        const response = await axios.post(url, payload, {
          signal: controller.signal
        });
        setStacSearchStatus(S_SUCCEEDED);
        const itemsParentCollections: string[] = uniq(
          response.data.features.map((feature) => feature.collection)
        );
        setSelectableDatasetLayers(
          allAvailableDatasetsLayers.filter((l) =>
            itemsParentCollections.includes(l.id)
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
