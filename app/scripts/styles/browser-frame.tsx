import React from 'react';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';

function BrowserFrameComponent(props: { children: React.ReactNode }) {
  const { children, ...rest } = props;
  return (
    <div {...rest}>
      <div className='controls'>
        <span />
        <span />
        <span />
      </div>
      <div>{children}</div>
    </div>
  );
}

const BrowserFrame = styled(BrowserFrameComponent)`
  position: relative;
  padding: 0 0 1rem 0;
  background: ${themeVal('color.base-200')};
  box-shadow: 0 0 1px 0 ${themeVal('color.base-400')};
  width: fit-content;
  border-radius: ${themeVal('shape.rounded')};

  .controls {
    display: flex;
    gap: 0.5rem;
    padding: 0.625rem 0.5rem;

    span {
      display: block;
      width: 0.75rem;
      height: 0.75rem;
      content: '';
      border-radius: ${themeVal('shape.ellipsoid')};
      background: ${themeVal('color.base-300')};
    }
  }
`;

export default BrowserFrame;
