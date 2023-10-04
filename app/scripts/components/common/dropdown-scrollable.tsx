import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { glsp } from '@devseed-ui/theme-provider';
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
  overflow-y: auto;

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
