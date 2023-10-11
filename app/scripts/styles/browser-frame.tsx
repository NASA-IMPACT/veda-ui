import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';
import { CollecticonExpandTopRight } from '@devseed-ui/collecticons';

function BrowserFrameComponent(props: { children: ReactNode; link?: string }) {
  const { children, link, ...rest } = props;
  return (
    <div {...rest}>
      <div className='controls'>
        <div className='buttons'>
          <span />
          <span />
          <span />
        </div>
        {link && (
          <div className='link'>
            <a target='_blank' rel='noreferrer' href={link}>
              Open in a new browser tab {' '}
              <CollecticonExpandTopRight size='small' />
            </a>
          </div>
        )}
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
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .buttons {
      gap: 0.5rem;
      padding: 0.625rem 0.5rem;
      display: flex;
      span {
        display: block;
        width: 0.75rem;
        height: 0.75rem;
        content: '';
        border-radius: ${themeVal('shape.ellipsoid')};
        background: ${themeVal('color.base-300')};
      }
    }

    .link {
      padding-right: .625rem;
      font-size: 0.875rem;
    }
  }
`;

export default BrowserFrame;
