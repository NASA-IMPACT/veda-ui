import { useEffect, useState } from 'react';
import { uniqBy } from 'lodash';

import { MDXContent, MDXModule } from 'mdx/types';
import { S_IDLE, S_LOADING, S_SUCCEEDED } from './status';
import {
  DatasetData,
  StoryData,
  Taxonomy,
  TaxonomyItem,
  DatasetDataWithEnhancedLayers
} from '$types/veda';

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

export function generateTaxonomies(data: DatasetDataWithEnhancedLayers[] | DatasetData[]): Taxonomy[] {
  const concat = (arr, v) => (arr || []).concat(v);

  const taxonomyData = {};
  // for loops are faster than reduces.
  for (const { taxonomy } of data) {
    for (const { name, values } of taxonomy) {
      if (!name || !values.length) continue;
      taxonomyData[name] = concat(taxonomyData[name], values);
    }
  }

  const taxonomiesUnique = Object.entries(taxonomyData).map(([key, tx]): Taxonomy => ({
    name: key,
    // eslint-disable-next-line fp/no-mutating-methods
    values: uniqBy(tx as TaxonomyItem[], (t) => t.id).sort((a, b) => a.name.localeCompare(b.name)) as TaxonomyItem[]
  }));
  return taxonomiesUnique;
}


// Taxonomies with special meaning as they're used in the app, like in the cards
// for example.
export const TAXONOMY_TOPICS = 'Topics';
export const TAXONOMY_SOURCE = 'Source';
export const TAXONOMY_GRADE = 'Grade';
export const TAXONOMY_UNCERTAINTY = 'Uncertainty';

export function getTaxonomy(
  data: DatasetData | StoryData | Taxonomy[],
  taxonomyName: string
) {
  const list = Array.isArray(data) ? data : data.taxonomy;

  return list.find((t) => t.name === taxonomyName);
}

export function getAllTaxonomyValues(
  data: DatasetData | StoryData | Taxonomy[]
) {
  const list = Array.isArray(data) ? data : data.taxonomy;
  const allValues = list.map((l) => l.values).flat();
  return allValues;
}

export function getTaxonomyByIds(group: string, ids: string | string[], taxonomies: Taxonomy[]) {
  const groupValues = taxonomies.find((t) => t.name == group)?.values;
  
  let taxonomyItems: any[] = [];

  if (ids instanceof Array) {
    const items = ids.map((id) => groupValues?.filter((value) => value.id == id)[0]);
    taxonomyItems = items.map((item) => ({...item, ...{taxonomy: group}}));
  } else {
    const taxonomy = groupValues?.filter((value) => value.id == ids)[0];
    /* eslint-disable-next-line fp/no-mutating-methods */
    if(taxonomy) taxonomyItems.push({...taxonomy, ...{taxonomy: group}});
  }
  return taxonomyItems;
}