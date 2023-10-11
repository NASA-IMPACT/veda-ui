import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import {
  Dropdown,
  DropdownProps,
  DropdownRef,
  DropMenu,
  DropTitle
} from '@devseed-ui/dropdown';

/**
 * Override Dropdown styles to play well with the shadow scrollbar.
 */
const DropdownWithScroll = styled(Dropdown)`
  padding: 0;
  overflow: hidden;
  max-height: 320px;
  overscroll-behavior: none;
  overflow-y: scroll;

  /* Scroll style firefox */
  scrollbar-color: ${themeVal('color.base-100')} transparent;
  
  /* Scroll style for webkit - chrome, safari */
  &::-webkit-scrollbar {
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${themeVal('color.base-100')};
    border-radius: ${themeVal('shape.rounded')}
  }

  ${DropTitle} {
    margin: 0;
    padding: ${glsp(1, 1, 0, 1)};
  }

  ${DropMenu} {
    margin: 0;
  }
`;

export default forwardRef<DropdownRef, DropdownProps>(
  function DropdownScrollable(props, ref) {
    const { children, ...rest } = props;
    return (
      <DropdownWithScroll ref={ref} {...rest}>
        {children}  
      </DropdownWithScroll>
    );
  }
);
