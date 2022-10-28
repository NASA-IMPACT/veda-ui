import { DatasetLayer } from 'delta/thematics';
import { Feature, Polygon } from 'geojson';
import { useEffect, useMemo, useRef, useState } from 'react';
import { uniq, uniqBy } from 'lodash';
import axios from 'axios';
import { getFilterPayload } from '../utils';
import { ActionStatus, S_FAILED, S_IDLE, S_LOADING, S_SUCCEEDED } from '$utils/status';
import { useThematicArea } from '$utils/thematics';

interface UseStacSearchProps {
  start?: Date;
  end?: Date;
  aoi?: Feature<Polygon> | null;
}

export function useStacSearch({
  start,
  end,
  aoi
}: UseStacSearchProps) {
  const thematic = useThematicArea();

  const readyToLoadDatasets = start && end && aoi;
  const allAvailableDatasetsLayers: DatasetLayer[] = useMemo(() => {
    if (!thematic?.data.datasets) return [];
    return uniqBy(
      thematic.data.datasets.map((dataset) => dataset.layers).flat(),
      'stacCol'
    );
  }, [thematic]);

  const [selectableDatasetLayers, setSelectableDatasetLayers] = useState<
    DatasetLayer[]
  >([]);
  const [stacSearchStatus, setStacSearchStatus] =
  useState<ActionStatus>(S_IDLE);
  useEffect(() => {
    if (!readyToLoadDatasets || !allAvailableDatasetsLayers) return;
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
        setStacSearchStatus(S_FAILED);
      }
    };
    load();
    return () => {
      controller.abort();
    };
  }, [
    start,
    end,
    aoi,
    allAvailableDatasetsLayers,
    readyToLoadDatasets
  ]);

  return { selectableDatasetLayers, stacSearchStatus, readyToLoadDatasets };
}
