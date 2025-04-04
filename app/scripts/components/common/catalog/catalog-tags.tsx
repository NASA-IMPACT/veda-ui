import React from 'react';
import FilterTag from './filter-tag';

import { OptionItem } from '$components/common/form/checkable-filter';

interface CatalogTagsContainerProps {
  allSelectedFilters: OptionItem[];
  urlTaxonomyItems: OptionItem[];
  handleClearTag: (item: OptionItem) => void;
  handleClearTags: () => void;
}

const CatalogTagsContainer: React.FC<CatalogTagsContainerProps> = ({
  allSelectedFilters,
  urlTaxonomyItems,
  handleClearTag,
  handleClearTags
}) => {
  if (allSelectedFilters.length > 0 || urlTaxonomyItems.length > 0) {
    return (
      <div
        className='display-flex flex-end flex-align-end tablet:margin-bottom-2'
        style={{ rowGap: '8px', columnGap: '8px' }}
      >
        {allSelectedFilters.length > 0
          ? allSelectedFilters.map((filter) => (
              <FilterTag
                key={`${filter.taxonomy}-${filter.id}`}
                item={filter}
                onClick={handleClearTag}
              />
            ))
          : urlTaxonomyItems.map((filter) => (
              <FilterTag
                key={`${filter.taxonomy}-${filter.id}`}
                item={filter}
                onClick={handleClearTag}
              />
            ))}
        <span className='usa-link font-sans-2xs' onClick={handleClearTags}>
          Clear all
        </span>
      </div>
    );
  }
  return null;
};

export default CatalogTagsContainer;
