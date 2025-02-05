import React from 'react';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import {
  CollecticonXmarkSmall
} from '@devseed-ui/collecticons';
import { variableBaseType } from '$styles/variable-utils';
import { OptionItem } from '$components/common/form/checkable-filter';

interface FilterTagProps {
  item: OptionItem;
  onClick: (item: OptionItem) => void;
}

const Tag = styled.span`
  display: flex;
  width: fit-content;
  justify-content: center;
  background-color: ${themeVal('color.base-50')};
  margin: 0 ${glsp(0.5)} 0 0;
  height: fit-content;
  padding: 6px 0 6px 6px;
  outline-width: 1px;
  outline-color: ${themeVal('color.base-200')};
  outline-style: solid;
  border-radius: 2px;
  font-size: ${variableBaseType('0.6rem')};

  button {
    background: none;
    border: none;
    outline: none;
    box-shadow: none;
    display: flex;
    align-items: center;
  }
`;

export default function FilterTag(props: FilterTagProps) {
  const {item, onClick} = props;

  const handleClick = () => {
    onClick(item);
  };

  return (
    <Tag>
      {item.name}
      <button type='button' onClick={handleClick}>
        <CollecticonXmarkSmall />
      </button>
    </Tag>
  );
}