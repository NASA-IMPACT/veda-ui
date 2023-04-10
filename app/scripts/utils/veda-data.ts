import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { discoveries, datasets } from 'veda';

import { MDXContent, MDXModule } from 'mdx/types';
import { S_IDLE, S_LOADING, S_SUCCEEDED } from './status';

/**
 * List with the meta information of all datasets.
 */
export const allDatasetsProps = Object.values(datasets).map((d) => d!.data);

/**
 * List with the meta information of all discoveries.
 */
export const allDiscoveriesProps = Object.values(discoveries).map(
  (d) => d!.data
);

/**
 * Returns the meta data for a discovery taking into account the url parameters.
 * If the discovery does not exist, null is returned.
 * @returns Object
 */
export function useDiscovery() {
  const { discoveryId } = useParams();

  const discovery = discoveries[discoveryId ?? ''];

  // Stop if the discovery doesn't exist.
  return discovery ?? null;
}

/**
 * Returns the meta data for a dataset taking into account the url parameters.
 * If the dataset does not exist, null is returned.
 * @returns Object
 */
export function useDataset() {
  const { datasetId } = useParams();

  const dataset = datasets[datasetId ?? ''];

  // Stop if the datasets doesn't exist.
  return dataset ?? null;
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
