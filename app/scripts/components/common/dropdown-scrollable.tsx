import React from 'react';
import styled from 'styled-components';
import { glsp } from '@devseed-ui/theme-provider';
import {
  Dropdown,
  DropdownProps,
  DropdownRef,
  DropMenu,
  DropTitle
} from '@devseed-ui/dropdown';
import { ShadowScrollbar } from '@devseed-ui/shadow-scrollbar';

/**
 * Override Dropdown styles to play well with the shadow scrollbar.
 */
const DropdownWithScroll = styled(Dropdown)`
  padding: 0;
  overflow: hidden;

  ${DropTitle} {
    margin: 0;
    padding: ${glsp(1, 1, 0, 1)};
  }

  ${DropMenu} {
    margin: 0;
  }
`;

const shadowScrollbarProps = {
  autoHeight: true,
  autoHeightMax: 320
};

interface DropdownScrollableProps extends DropdownProps {
  children?: React.ReactNode;
}

export default React.forwardRef<DropdownRef, DropdownScrollableProps>(
  function DropdownScrollable(props, ref) {
    const { children, ...rest } = props;
    return (
      <DropdownWithScroll ref={ref} {...rest}>
        <ShadowScrollbar scrollbarsProps={shadowScrollbarProps}>
          {children}
        </ShadowScrollbar>
      </DropdownWithScroll>
    );
  }
);
