import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import {
  FormGroupStructure,
  FormCheckableGroup,
  FormCheckable
} from '@devseed-ui/form';
import {
  CollecticonChevronDown,
  CollecticonChevronUp
} from '@devseed-ui/collecticons';
import { Toolbar, ToolbarIconButton } from '@devseed-ui/toolbar';
import { themeVal } from '@devseed-ui/theme-provider';
import { variableBaseType, variableGlsp } from '$styles/variable-utils';
import { CardTitle } from '$components/common/card/styles';
import { USWDSAccordion, USWDSCheckbox } from '$components/common/uswds';

const FilterMenu = styled.div`
  border: 2px solid ${themeVal('color.base-200')};
  border-radius: ${themeVal('shape.rounded')};
  padding: 12px;
  margin-bottom: 1.5rem;
`;

const FilterTitle = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;

  #title-selected {
    display: flex;
    flex-direction: column;
    gap: ${variableGlsp(0.1)};

    ${CardTitle} {
      font-size: ${variableBaseType('0.7rem')};
    }
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

const Option = styled(FormCheckable)`
  font-size: ${variableBaseType('0.6rem')};
  display: flex;
  align-items: center;
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
  tagItemCleared?: {
    // An option item that was removed globally
    item?: OptionItem;
    callback?: React.Dispatch<React.SetStateAction<any>>;
  };
  openByDefault?: boolean;
}

export interface OptionItem {
  taxonomy: string;
  id: string;
  name: string;
}

export default function CheckableFilters(props: CheckableFiltersProps) {
  const {
    items,
    title,
    onChanges,
    globallySelected,
    tagItemCleared,
    openByDefault = true
  } = props;
  const [show, setShow] = useState<boolean>(openByDefault);
  const [count, setCount] = useState<number>(0);
  const [selected, setSelected] = useState<OptionItem[]>([]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const idInfo = e.target.id.split('&&');
      const taxonomy = idInfo[0];
      const id = idInfo[1];

      const optionItem = {
        taxonomy: taxonomy,
        name: e.target.name,
        id: id
      };

      if (e.target.checked) {
        setCount((prevValue) => prevValue + 1);
        setSelected([...selected, optionItem]); // Local
        onChanges(optionItem); // Global to filters-control
      } else {
        setCount((prevValue) => prevValue - 1);
        setSelected(selected.filter((item) => item.id !== e.target.id));
        onChanges(optionItem);
      }
    },
    [selected]
  );

  const isChecked = (item: OptionItem) =>
    globallySelected.some(
      (selected) => selected.id == item.id && selected.taxonomy == item.taxonomy
    );

  useEffect(() => {
    if (!globallySelected || globallySelected.length === 0) {
      setCount(0);
    }

    if (globallySelected.length > 0) {
      setCount(
        globallySelected.filter((item) => items.some((i) => i.id === item.id))
          .length
      );
      setSelected(selected.filter((item) => item.id));
    } else {
      setSelected([]);
    }
  }, [globallySelected]);

  useEffect(() => {
    if (tagItemCleared?.item && globallySelected.length > 0) {
      setCount((prevValue) => prevValue - 1);
      setSelected(
        selected.filter((item) => item.id !== tagItemCleared.item?.id)
      );
      tagItemCleared.callback?.(undefined);
    }
  }, [tagItemCleared, globallySelected]);

  const createCheckboxes = (items) => {
    const newItem = items.map((item) => {
      const { id, name, taxonomy } = item;
      const checked = isChecked(item);

      return (
        <div
          key={id}
          id='veda-checkbox-container'
          className={`border-2px radius-md  margin-bottom-105 ${
            checked
              ? 'border-primary-light bg-primary-lighter'
              : 'border-base-light'
          }`}
        >
          <USWDSCheckbox
            id={`${taxonomy}&&${id}`}
            name={name}
            label={name}
            checked={checked}
            onChange={(e) => handleChange(e)}
            className={`margin-bottom-105 margin-x-1 ${
              checked && 'bg-primary-lighter'
            }`}
          />
        </div>
      );
    });

    return newItem;
  };
  return (
    <USWDSAccordion
      key={title}
      title={title}
      bordered={true}
      items={[
        {
          title: title,
          id: 'testing',
          headingLevel: 'h1',
          content: createCheckboxes(items)
        }
      ]}
    />
  );
}
