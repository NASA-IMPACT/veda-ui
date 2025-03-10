import React from 'react';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import FilterTag from './filter-tag';
import { OptionItem } from '$components/common/form/checkable-filter';
import { variableBaseType } from '$styles/variable-utils';

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: ${glsp(1)};
`;

const PlainTextButton = styled.button`
  background: none;
  border: none;
  outline: none;
  box-shadow: none;
  color: ${themeVal('color.primary-400')};
  text-decoration: underline;
  font-size: ${variableBaseType('0.6rem')};
  &:hover {
    color: ${themeVal('color.primary-800')};
  }
`;

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


      <div className='display-flex flex-wrap tablet:margin-bottom-3'>
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
        <PlainTextButton onClick={handleClearTags}>Clear all</PlainTextButton>
      </div>
    );
  }
  return null;
};

export default CatalogTagsContainer;
