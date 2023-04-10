import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import vedaThematics, {
  thematics,
  discoveries,
  datasets,
  VedaDatum,
  VedaThematicListItem
} from 'veda/thematics';

import { MDXContent, MDXModule } from 'mdx/types';
import { S_IDLE, S_LOADING, S_SUCCEEDED } from './status';

export const allDatasetsProps = Object.values(datasets).map((d) => d!.data);

/**
 * Interface for the Thematic area data and the related discoveries and datasets
 */
export type ThematicItemFull = VedaDatum<VedaThematicListItem> | null;

/**
 * Returns the data for the thematic are taking the url parameter into account.
 * @returns Object
 */
export function useThematicArea(): ThematicItemFull {
  const { thematicId, discoveryId, datasetId } = useParams();

  // If there's only one thematic area, the app is setup with only one thematic
  // area, and therefore return the first one.
  let tId = vedaThematics.length === 1 ? vedaThematics[0].id : thematicId;

  if (!tId) {
    const discovery = discoveries[discoveryId ?? ''];
    const dataset = datasets[datasetId ?? ''];
    if (discovery) {
      tId = discovery.data.thematics[0];
    } else if (dataset) {
      tId = dataset.data.thematics[0];
    }
  }

  return useMemo(() => {
    if (!tId) return null;

    const relData = vedaThematics.find((d) => d.id === tId);
    // Relationship data between thematics and datasets/discoveries.
    const thematic = thematics[tId];
    if (!relData || !thematic) return null;

    return {
      ...thematic,
      data: {
        ...relData,
        ...thematic.data
      }
    };
  }, [tId]);
}

/**
 * Returns the meta data for a discovery taking into account the url parameters.
 * If the discovery does not belong to the thematic area being viewed, null is
 * returned.
 * @returns Object
 */
export function useThematicAreaDiscovery() {
  const thematic = useThematicArea();
  const { discoveryId } = useParams();

  const discovery = discoveries[discoveryId ?? ''];

  // Stop if the discovery doesn't exist or if it doesn't belong to this
  // thematic area.
  if (
    !thematic ||
    !discovery ||
    !discovery.data.thematics.includes(thematic.data.id)
  ) {
    return null;
  }

  return discovery;
}

/**
 * Returns the meta data for a dataset taking into account the url parameters.
 * If the dataset does not belong to the thematic area being viewed, null is
 * returned.
 * @returns Object
 */
export function useThematicAreaDataset() {
  const thematic = useThematicArea();
  const { datasetId } = useParams();

  const dataset = datasets[datasetId ?? ''];

  // Stop if the datasets doesn't exist or if it doesn't belong to this
  // thematic area.
  if (
    !thematic ||
    !dataset ||
    !dataset.data.thematics.includes(thematic.data.id)
  ) {
    return null;
  }

  return dataset;
}

type MdxPageLoadResult =
  | {
      status: typeof S_IDLE | typeof S_LOADING;
      MdxContent: null;
    }
  | {
      status: typeof S_SUCCEEDED;
      MdxContent: MDXContent;
    };

/**
 * Loads the MDX page returning an object with loading status and the component.
 *
 * @param {function} loader Async function to load the mdx page
 * @returns Object
 */
export function useMdxPageLoader(loader?: () => Promise<MDXModule>) {
  const [pageMdx, setPageMdx] = useState<MdxPageLoadResult>({
    status: S_IDLE,
    MdxContent: null
  });

  useEffect(() => {
    if (!loader) return;

    const load = async () => {
      setPageMdx({
        status: S_LOADING,
        MdxContent: null
      });

      const content = await loader();
      setPageMdx({
        status: S_SUCCEEDED,
        MdxContent: content.default
      });
    };

    load();
  }, [loader]);

  return pageMdx;
}
