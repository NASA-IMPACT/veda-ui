import { useEffect, useState } from 'react';

import { MDXContent, MDXModule } from 'mdx/types';
import { S_IDLE, S_LOADING, S_SUCCEEDED } from '../status';

// @NOTE: Independent of veda faux modules

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