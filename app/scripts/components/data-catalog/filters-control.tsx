import React, {useCallback } from 'react';
import styled from 'styled-components';
import { Taxonomy } from 'veda';
import SearchField from '$components/common/search-field';
import CheckableFilters, { OptionItem } from '$components/common/form/checkable-filter';
import { Actions, useBrowserControls } from '$components/common/browse-controls/use-browse-controls';

const ControlsWrapper = styled.div<{ width?: string; height?: string }>`
  min-width: 20rem;
  width: ${props => props.width ?? '20rem'};
  position: sticky;
  top: 0;
  height: ${props => props.height == '100%' ? `${props.height}` : `calc(100vh + ${props.height}px)`};
`;

interface FiltersMenuProps extends ReturnType<typeof useBrowserControls> {
  taxonomiesOptions: Taxonomy[];
  allSelected: OptionItem[];
  clearedTagItem?: OptionItem;
  setClearedTagItem?: React.Dispatch<React.SetStateAction<OptionItem | undefined>>;
  width?: string;
  onChangeToFilters?: (item: OptionItem, action: 'add' | 'remove') => void;
  areaHeight?: number;
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
    areaHeight,
  } = props;

  const searchRef = React.useRef<HTMLDivElement>(null);
  const [controlsHeight, setControlsHeight] =  React.useState<number>(0);
  const [heightStyle, setHeightStyle] = React.useState<string>();

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

  const calculateHeightOfAllFilters = (height: number) => {
    setControlsHeight(prev => prev + height);
  };


  React.useEffect(() => {
    if(searchRef.current) {
      const height = searchRef.current.offsetHeight;
      setControlsHeight(prev => prev + height);
    }
  }, [searchRef]);

  React.useEffect(() => {
    if (areaHeight && (controlsHeight >= areaHeight)) {
      setHeightStyle('100%');
    } else if (areaHeight) {
      const total = (areaHeight - controlsHeight) / 3;
      setHeightStyle(`${total}`);
    }
  }, [controlsHeight, areaHeight]);

  return (
    <ControlsWrapper width={width} height={heightStyle}>
      <div ref={searchRef}>
        <SearchField
          size='large'
          placeholder='Search by title, description'
          value={search ?? ''}
          onChange={(v) => onAction(Actions.SEARCH, v)}
        />
      </div>
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
                calculateHeightCallback={calculateHeightOfAllFilters}
              />
          );
        })
      }
    </ControlsWrapper>
  );
}