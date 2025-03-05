import React from 'react';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Icon } from '@trussworks/react-uswds';
import { USWDSTag } from '../uswds';
import { USWDSButton } from '../uswds';
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
  const { item, onClick } = props;

  const handleClick = () => {
    onClick(item);
  };

  return (
    <USWDSTag className='border-1px radius-md border-base-light padding-y-05 padding-x-1 margin-right-2 font-sans-2xs display-flex flex-align-center text-normal text-base-darkest'>
      {item.name}
      <USWDSButton
        type='button'
        onClick={handleClick}
        unstyled
        className='text-base margin-y-2px margin-left-2px'
      >
        <Icon.Close size={3} />
      </USWDSButton>
    </USWDSTag>
  );
}
