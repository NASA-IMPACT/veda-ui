import React from 'react';
import { Icon } from '@trussworks/react-uswds';

import { USWDSButton, USWDSTag } from '$uswds';
import { OptionItem } from '$components/common/form/checkable-filter';

interface FilterTagProps {
  item: OptionItem;
  onClick: (item: OptionItem) => void;
}

export default function FilterTag(props: FilterTagProps) {
  const { item, onClick } = props;

  const handleClick = () => {
    onClick(item);
  };

  return (
    <USWDSTag className='border-1px border-base-light tablet:padding-y-05 tablet:padding-x-1 padding-y-0 padding-x-05 tablet:font-sans-2xs font-sans-3xs display-flex flex-align-center text-normal text-base-darkest bg-white text-no-uppercase'>
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
