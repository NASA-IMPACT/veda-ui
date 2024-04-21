import React, {useState, useCallback, useEffect} from 'react';
import styled from 'styled-components';
import { FormGroupStructure, FormCheckableGroup,  FormCheckable} from '@devseed-ui/form';
import { CollecticonChevronDown, CollecticonChevronUp } from '@devseed-ui/collecticons';
import { Toolbar, ToolbarIconButton } from '@devseed-ui/toolbar';
import { themeVal } from '@devseed-ui/theme-provider';
import { variableGlsp } from '$styles/variable-utils';


const FilterMenu = styled.div`
  border: 2px solid ${themeVal('color.base-200')};
  border-radius: 4px;
  padding: 12px;
  margin: 18px 0;
`;

const FilterTitle = styled.div`
  display: flex;
  justify-content: space-between;

  #title-selected {
    display: flex;
    flex-direction: column;
    gap: ${variableGlsp(0.1)};
  }

  span {
    font-size: 1rem;
    color: ${themeVal('color.base-500')};
  }
`;

const Options = styled(FormCheckableGroup)`
  padding-top: 6px;

  div {
    width: 100%;
    padding: 4px 8px;
  }
  
  .checked {
    background-color: ${themeVal('color.primary-100')};
    outline-width: 1px;
    outline-color: ${themeVal('color.primary-300')};
    outline-style: solid;
  }
`;

const Toggle = styled(Toolbar)`
  align-items: start;
`;

const ToggleIconButton = styled(ToolbarIconButton)`
  background-color: inherit;
`;

interface CheckableFiltersProps {
  title: string;
  items: OptionItem[];
  onChanges: (items: OptionItem) => void;
  globallySelected: OptionItem[]; // Selected values across all filters
  tagItemCleared?: { // An option item that was removed globally
    item?: OptionItem;
    callback?: React.Dispatch<React.SetStateAction<any>>;
  }
}

export interface OptionItem {
  taxonomy: string;
  id: string;
  name: string;
}

export default function CheckableFilters(props: CheckableFiltersProps) {
  const {items, title, onChanges, globallySelected, tagItemCleared} = props;
  // const [show, setShow] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(true); // @TODO-SANDRA: Keep open for fast testing purposes for now
  const [count, setCount] = useState<number>(0);
  const [selected, setSelected] = useState<OptionItem[]>([]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const optionItem = {
      taxonomy: title.split(' ')[0],
      name: e.target.name,
      id: e.target.id
    };

    if(e.target.checked) {
      setCount((prevValue) => prevValue + 1);
      setSelected([...selected, optionItem]); // Local
      onChanges(optionItem); // Global to filters-control
    }
    else {
      setCount((prevValue) => prevValue - 1);
      setSelected(selected.filter((item) => item.id !== e.target.id));
      onChanges(optionItem);
    }
  }, [selected]);

  const isChecked = (item: OptionItem) => globallySelected.map(item => item.id).includes(item.id);
  
  useEffect(() => {
    if(!globallySelected || globallySelected.length === 0) {
      setCount(0);
    }
  }, [globallySelected]);

  useEffect(() => {
    if(tagItemCleared?.item && globallySelected.length > 0) {
      setCount((prevValue) => prevValue - 1);
      setSelected(selected.filter((item) => item.id !== tagItemCleared.item?.id));
      tagItemCleared?.callback?.(undefined);
    }
  }, [tagItemCleared, globallySelected]);

  // @NOTE-SANDRA: Idk why this is needed for the tags to persist... still a mystery to me
  useEffect(() => {
    if(globallySelected.length > 0) {
      setSelected(selected.filter((item) => item.id));
    } else {
      setSelected([]);
    }
  }, [globallySelected]);

  return (
    <FilterMenu>
      <FilterTitle>
        <div id='title-selected'>
          <h3>{title}</h3>
          {
            count > 0 && (
              <span>{count} selected</span> 
            )
          }
        </div>
        <Toggle size='small'>
          <ToggleIconButton
            active={show}
            onClick={() => setShow(!show)}
          >
            {
              show ? 
              <CollecticonChevronUp />
              : 
              <CollecticonChevronDown />
            }
          </ToggleIconButton>
        </Toggle>
      </FilterTitle>
      {
        show && (
          <FormGroupStructure label='' id=''>
            <Options>
              {
                items.map((item) => {
                  const checked = isChecked(item);
                  return (
                    <div className={checked ? 'checked' : 'unchecked'} key={item.id}>
                      <FormCheckable
                        key={item.id}
                        value={item.name}
                        onChange={(e) => handleChange(e)}
                        checked={checked}
                        type='checkbox'
                        name={item.name}
                        id={item.id}
                      >
                        {item.name}
                      </FormCheckable>
                    </div>
                  );
                })
              }
            </Options>
          </FormGroupStructure>
        )
      }
    </FilterMenu>
  );
}