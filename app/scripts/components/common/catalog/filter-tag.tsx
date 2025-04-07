import React from 'react';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Icon } from '@trussworks/react-uswds';
import { USWDSButton, USWDSTag } from '$uswds';
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
    <USWDSTag className='border-1px radius-md border-base-light tablet:padding-y-05 tablet:padding-x-1 padding-y-0 padding-x-05 tablet:font-sans-2xs font-sans-3xs display-flex flex-align-center text-normal text-base-darkest bg-white text-no-uppercase'>
      {item.name}
      <USWDSButton
        type='button'
        onClick={handleClick}
        unstyled
        className='text-base tablet:margin-y-2px margin-left-2px margin-y-0'
      >
        <Icon.Close />
      </USWDSButton>
    </USWDSTag>
  );
}
