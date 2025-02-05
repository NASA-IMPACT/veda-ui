import { DatasetData, StoryData } from '$types/veda';
import { optionAll } from '$components/common/browse-controls/constants';

const TAXONOMY_TOPICS = 'Topics';

const isDatasetData = (data: DatasetData | StoryData): data is DatasetData => {
  return 'layers' in data;
};

interface FilterOptionsType {
  search: string | null;
  taxonomies: Record<string, string | string[]> | null;
  sortField?: 'pubDate' | 'name';
  sortDir?: 'asc' | 'desc';
  filterLayers?: boolean | null;
}

export function prepareDatasets(
  data: DatasetData[],
  options: FilterOptionsType
): DatasetData[];
export function prepareDatasets(
  data: StoryData[],
  options: FilterOptionsType
): StoryData[];
export function prepareDatasets(
  data: (DatasetData | StoryData)[],
  options: FilterOptionsType
) {
  const { sortField, sortDir, search, taxonomies, filterLayers } = options;
  let filtered = data.filter((d) => !d.isHidden);

  if (search && search.length >= 3) {
    const searchLower = search.toLowerCase();
    // Function to check if searchLower is included in any of the string fields
    const includesSearchLower = (str) =>
      str.toLowerCase().includes(searchLower);
    // Function to determine if a layer matches the search criteria
    const layerMatchesSearch = (layer) =>
      includesSearchLower(layer.stacCol) ||
      includesSearchLower(layer.name) ||
      includesSearchLower(layer.parentDataset.name) ||
      includesSearchLower(layer.parentDataset.id) ||
      includesSearchLower(layer.description);

    filtered = filtered.filter((d) => {
      // Pre-calculate lowercased versions to use in comparisons
      const idLower = d.id.toLowerCase();
      const nameLower = d.name.toLowerCase();
      const descriptionLower = d.description?.toLowerCase();
      const cardDescriptionLower = d.cardDescription?.toLowerCase();
      const topicsTaxonomy = d.taxonomy.find((t) => t.name === TAXONOMY_TOPICS);
      // Check if any of the conditions for including the item are met
      return (
        idLower.includes(searchLower) ||
        nameLower.includes(searchLower) ||
        descriptionLower?.includes(searchLower) ||
        cardDescriptionLower?.includes(searchLower) ||
        (isDatasetData(d) && d.layers.some(layerMatchesSearch)) ||
        topicsTaxonomy?.values.some((t) => includesSearchLower(t.name))
      );
    });

    if (filterLayers)
      filtered = filtered.map((d) => ({
        ...d,
        layers: isDatasetData(d) && d.layers.filter(layerMatchesSearch)
      })) as DatasetData[];
  }

  taxonomies &&
    Object.entries(taxonomies).forEach(([name, value]) => {
      if (!value.includes(optionAll.id)) {
        filtered = filtered.filter((d) =>
          d.taxonomy.some(
            (t) => t.name === name && t.values.some((v) => value.includes(v.id))
          )
        );
      }
    });

  sortField &&
    /* eslint-disable-next-line fp/no-mutating-methods */
    filtered.sort((a, b) => {
      if (!a[sortField] || typeof a[sortField] !== 'string') return Infinity;

      return a[sortField]?.localeCompare(b[sortField]);
    });

  if (sortDir === 'desc') {
    /* eslint-disable-next-line fp/no-mutating-methods */
    filtered.reverse();
  }

  return filtered;
}
