import React, {useState, useCallback, useEffect, useRef} from 'react';
import styled from 'styled-components';
import { Taxonomy } from 'veda';
import { themeVal } from '@devseed-ui/theme-provider';
import FilterTag from './filter-tag';
import SearchField from '$components/common/search-field';
import CheckableFilters, { OptionItem } from '$components/common/form/checkable-filter';
import { Actions, optionAll, useBrowserControls } from '$components/common/browse-controls/use-browse-controls';



interface FiltersMenuProps extends ReturnType<typeof useBrowserControls> {
  taxonomiesOptions: Taxonomy[];
  redirect?: () => void; // redirect to a specific view
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

// @TODO-SANDRA: Will need to move somewhere else
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value; //assign the value of ref to the argument
  },[value]); //this code will run when the value of 'value' changes
  return ref.current; //in the end, return the current ref value.
}

export default function FiltersControl(props: FiltersMenuProps) {
  const {
    onAction,
    taxonomiesOptions,
    search,
    redirect,
  } = props;

  const [selectedFilters, setSelectedFilters] = useState<OptionItem[]>([]);
  const [clearedTagItem, setClearedTagItem] = useState<OptionItem>();

  const prevSelectedFilters = usePrevious(selectedFilters) || [];

  const handleFilterChanges = useCallback((item: OptionItem) => {
    const selectedFilterIds = selectedFilters.map((f) => f.id);
    if(selectedFilterIds.includes(item.id)) {
      setSelectedFilters(selectedFilters.filter((selected) => selected.id !== item.id));
    }
    else {
      setSelectedFilters([...selectedFilters, item]);
      onAction(Actions.TAXONOMY, { key: item.taxonomy, value: item.id });
    }
  }, [selectedFilters]);

  const handleClearTag = useCallback((item: OptionItem) => {
    setSelectedFilters(selectedFilters.filter((selected) => selected.id !== item.id));
    setClearedTagItem(item);
  }, [selectedFilters]);

  const handleClearTags = () => {
    onAction(Actions.CLEAR);
    setSelectedFilters([]);
    redirect?.();
  };

  useEffect(() => {
    if (clearedTagItem && (selectedFilters.length == prevSelectedFilters.length-1)) {
      // @TODO-SANDRA: Revisit... this removes all from the taxonomy in url but we need to remove just a single value from the taxonomy, must look at use-browse-controls
      onAction(Actions.TAXONOMY, { key: clearedTagItem.taxonomy, value: optionAll.id }); 
    }
  }, [selectedFilters, clearedTagItem]);

  return (
    <ControlsWrapper>
      <SearchField
        size='large'
        placeholder='Search by title, description'
        value={search ?? ''}
        onChange={(v) => onAction(Actions.SEARCH, v)}
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
        taxonomiesOptions.map((taxonomy) => {
          const items = taxonomy.values.map((t) => ({...t, taxonomy: taxonomy.name.split(' ')[0]}));
          return (
            <CheckableFilters 
              key={taxonomy.name}
              items={items}
              title={taxonomy.name}
              onChanges={handleFilterChanges}
              globallySelected={selectedFilters}
              tagItemCleared={{item: clearedTagItem, callback: setClearedTagItem}}
            />
          );
        })
      }
    </ControlsWrapper>
  );
}