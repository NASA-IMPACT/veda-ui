import React from 'react';
import styled from 'styled-components';
import { Taxonomy } from 'veda';
import FilterTag from './filter-tag';
import { themeVal } from '@devseed-ui/theme-provider';
import SearchField from '$components/common/search-field';
import CheckableFilters, { OptionItem } from '$components/common/form/checkable-filter';
import { BrowserControlsAction } from '$components/common/browse-controls/use-browse-controls';



interface FiltersMenuProps {
  handleSearch: BrowserControlsAction;
  width?: number;
  taxonomiesOptions: Taxonomy[];
}

const ControlsWrapper = styled.div`
  width: 100%;
  min-width: 20rem;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const PlainTextButton = styled.button`
  background: none;
  border: none;
  outline: none;
  box-shadow: none;
  color: ${themeVal('color.primary-400')};
  text-decoration: underline;
  &:hover {
    color: ${themeVal('color.primary-800')};
  }
`;

export default function FiltersControl(props: FiltersMenuProps) {
  const {
    handleSearch,
    width,
    taxonomiesOptions
  } = props;

  const [selectedFilters, setSelectedFilters] = React.useState<OptionItem[]>([]);

  const handleFilterChanges = (item: OptionItem) => {
    const selectedFilterIds = selectedFilters.map((f) => f.id);
    if(selectedFilterIds.includes(item.id)) {
      setSelectedFilters(selectedFilters.filter((selected) => selected.id !== item.id));
    }
    else {
      setSelectedFilters([...selectedFilters, item]);
    }
  };

  const handleClearTags = () => setSelectedFilters([]);

  return (
    <ControlsWrapper>
      <SearchField
        size='medium'
        placeholder='Search by title, description'
        value='' // @TODO-SANDRA: Hook-up
        onChange={props.handleSearch}
      />
      {
        selectedFilters.length > 0 && (
          <Tags>
            {
              selectedFilters.map((filter) => <FilterTag key={filter.id} title={filter.name} />)
            }
            <PlainTextButton onClick={handleClearTags}>Clear all</PlainTextButton>
          </Tags>

        )
      }
      {
        taxonomiesOptions.map((taxonomy) => (
          <CheckableFilters 
            key={taxonomy.name}
            items={taxonomy.values}
            title={taxonomy.name}
            onChanges={handleFilterChanges}
            globallySelected={selectedFilters}
          />
        ))
      }
    </ControlsWrapper>
  );
}