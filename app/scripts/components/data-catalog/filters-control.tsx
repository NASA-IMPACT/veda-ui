import React, {useState, useCallback} from 'react';
import styled from 'styled-components';
import { Taxonomy } from 'veda';
import { themeVal } from '@devseed-ui/theme-provider';
import FilterTag from './filter-tag';
import SearchField from '$components/common/search-field';
import CheckableFilters, { OptionItem } from '$components/common/form/checkable-filter';
import { Actions, BrowserControlsAction } from '$components/common/browse-controls/use-browse-controls';



interface FiltersMenuProps {
  handleSearch: BrowserControlsAction;
  taxonomiesOptions: Taxonomy[];
  search: string | null;
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
    taxonomiesOptions,
    search,
  } = props;

  const [selectedFilters, setSelectedFilters] = useState<OptionItem[]>([]);
  const [tagItem, setTagItem] = useState<OptionItem>();

  const handleFilterChanges = useCallback((item: OptionItem) => {
    const selectedFilterIds = selectedFilters.map((f) => f.id);
    if(selectedFilterIds.includes(item.id)) {
      setSelectedFilters(selectedFilters.filter((selected) => selected.id !== item.id));
    }
    else {
      setSelectedFilters([...selectedFilters, item]);
    }
  }, [selectedFilters]);

  const handleClearTag = useCallback((item: OptionItem) => {
    setSelectedFilters(selectedFilters.filter((selected) => selected.id !== item.id));
    setTagItem(item);
  }, [selectedFilters]);

  const handleClearTags = () => setSelectedFilters([]);

  return (
    <ControlsWrapper>
      <SearchField
        size='large'
        placeholder='Search by title, description'
        value={search ?? ''}
        onChange={(v) => handleSearch(Actions.SEARCH, v)}
      />
      {
        selectedFilters.length > 0 && (
          <Tags>
            {
              selectedFilters.map((filter) => <FilterTag key={filter.id} item={filter} onClick={handleClearTag} />)
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
            tagItemCleared={{item: tagItem, callback: setTagItem}}
          />
        ))
      }
    </ControlsWrapper>
  );
}