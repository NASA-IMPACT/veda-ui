import React from 'react';
import styled from 'styled-components';
import { FormGroupStructure, FormCheckableGroup,  FormCheckable} from '@devseed-ui/form';
import { CollecticonChevronDown, CollecticonChevronUp } from '@devseed-ui/collecticons';
import { Toolbar, ToolbarIconButton } from '@devseed-ui/toolbar';
import { variableGlsp } from '$styles/variable-utils';
import { themeVal } from '@devseed-ui/theme-provider';

interface CheckableFiltersProps {
  title: string;
  items: OptionItem[];
}

interface OptionItem {
  id: string;
  name: string;
}

const FilterMenu = styled.div`
  border: 2px solid ${themeVal('color.base-200')};
  border-radius: 4px;
  padding: 12px;
  margin: 18px 0;
`;

const FilterTitle = styled.div`
  display: flex;
  justify-content: space-between;

  .title-selected {
    gap: ${variableGlsp()};
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

export default function CheckableFilters(props: CheckableFiltersProps) {
  const {items, title} = props;
  const [show, setShow] = React.useState<boolean>(true);
  const [count, setCount] = React.useState<number>(0);
  const [selected, setSelected] = React.useState<OptionItem[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`event: `, e.target.name, e.target.id, e.target)
    const optionItem = {
      name: e.target.name,
      id: e.target.id
    };
    if(e.target.checked) {
      setCount((prevValue) => prevValue + 1);
      setSelected([...selected, optionItem]);
    }
    else {
      setCount((prevValue) => prevValue - 1);
      setSelected(selected.filter((item) => item.id !== e.target.id));
    }
  };

  const isChecked = (item: OptionItem) => selected.map(item => item.id).includes(item.id)

  return (
    <FilterMenu>
      <FilterTitle>
        <div id='title-selected'>
          <h3>{title}</h3>
          <span>{count} selected</span>
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
                    <div className={checked ? 'checked' : 'unchecked'}>
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