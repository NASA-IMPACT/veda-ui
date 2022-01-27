import { useParams } from 'react-router';
import deltaThematics, { discoveries, datasets } from 'delta/thematics';
import { useEffect, useState } from 'react';

/**
 * Returns the data for the thematic are taking the url parameter into account.
 * @returns Object
 */
export function useThematicArea() {
  const { thematicId } = useParams();

  // If there's only one thematic area, the app is setup with only one thematic
  // area, and therefore return the first one.
  if (deltaThematics.length === 1) {
    return deltaThematics[0];
  }

  return deltaThematics.find((t) => t.id === thematicId) || null;
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

  const discovery = discoveries[discoveryId];

  // Stop if the discovery doesn't exist or if it doesn't belong to this
  // thematic area.
  if (!discovery || !discovery.data.thematics.includes(thematic.id)) {
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

  const dataset = datasets[datasetId];

  // Stop if the datasets doesn't exist or if it doesn't belong to this
  // thematic area.
  if (!dataset || !dataset.data.thematics.includes(thematic.id)) {
    return null;
  }

  return dataset;
}

/**
 * Loads the MDX page returning an object with loading status and the component.
 *
 * @param {function} loader Async function to load the mdx page
 * @returns Object
 */
export function useMdxPageLoader(loader) {
  const [pageMdx, setPageMdx] = useState({
    status: 'idle',
    MdxContent: null
  });

  useEffect(() => {
    if (!loader) return null;

    const load = async () => {
      setPageMdx({
        status: 'loading',
        MdxContent: null
      });

      const content = await loader();
      setPageMdx({
        status: 'success',
        MdxContent: content.default
      });
    };

    load();
  }, [loader]);

  return pageMdx;
}
