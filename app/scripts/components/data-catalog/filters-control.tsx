import React, {useCallback } from 'react';
import styled from 'styled-components';
import { Taxonomy } from 'veda';
import SearchField from '$components/common/search-field';
import CheckableFilters, { OptionItem } from '$components/common/form/checkable-filter';
import { Actions, useBrowserControls } from '$components/common/browse-controls/use-browse-controls';

const ControlsWrapper = styled.div<{ width?: string; }>`
  min-width: 20rem;
  width: ${props => props.width ?? '20rem'};
  position: sticky;
  top: 0;
  height: 100vh;
`;

interface FiltersMenuProps extends ReturnType<typeof useBrowserControls> {
  taxonomiesOptions: Taxonomy[];
  allSelected: OptionItem[];
  clearedTagItem?: OptionItem;
  setClearedTagItem?: React.Dispatch<React.SetStateAction<OptionItem | undefined>>;
  width?: string;
  onChangeToFilters?: (item: OptionItem, action: 'add' | 'remove') => void;
}

export default function FiltersControl(props: FiltersMenuProps) {
  const {
    allSelected,
    onAction,
    taxonomiesOptions,
    search,
    width,
    onChangeToFilters,
    clearedTagItem,
    setClearedTagItem,
  } = props;

  const handleChanges = useCallback((item: OptionItem) => {
    if(allSelected.some((selected) => selected.id == item.id && selected.taxonomy == item.taxonomy)) {
      setClearedTagItem?.(undefined);
      if(onChangeToFilters) onChangeToFilters(item, 'remove');
    }
    else {
      setClearedTagItem?.(undefined);
      if(onChangeToFilters) onChangeToFilters(item, 'add');
    }
  }, [allSelected, setClearedTagItem, onChangeToFilters]);


  const displayFiltersOpened = React.useMemo(() => taxonomiesOptions.length > 4 ? false : true, [taxonomiesOptions]);


  return (
    <ControlsWrapper width={width}>
      <SearchField
        size='large'
        placeholder='Search by title, description'
        value={search ?? ''}
        onChange={(v) => onAction(Actions.SEARCH, v)}
      />
      {
        taxonomiesOptions.map((taxonomy) => {
          const items = taxonomy.values.map((t) => ({...t, taxonomy: taxonomy.name}));
          return (
            <CheckableFilters 
              key={taxonomy.name}
              items={items}
              title={taxonomy.name}
              onChanges={handleChanges}
              globallySelected={allSelected}
              tagItemCleared={{item: clearedTagItem, callback: setClearedTagItem}}
              showFiltersOpened={displayFiltersOpened}
            />
          );
        })
      }
    </ControlsWrapper>
  );
}