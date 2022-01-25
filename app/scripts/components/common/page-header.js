import React from 'react';
import styled from 'styled-components';
import { Link, NavLink } from 'react-router-dom';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';
import { reveal } from '@devseed-ui/animation';

import { filterComponentProps } from '../../styles/utils/general';
import NasaLogo from './nasa-logo';
import { variableGlsp } from '../../styles/variable-utils';

const appTitle = process.env.APP_TITLE;

const PageHeaderSelf = styled.header`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: ${variableGlsp()};
  padding: ${variableGlsp(0.75, 1)};
  background: ${themeVal('color.primary')};
  animation: ${reveal} 0.32s ease 0s 1;

  &,
  &:visited {
    color: ${themeVal('color.surface')};
  }
`;

const Brand = styled.div`
  a {
    display: grid;
    align-items: center;
    gap: ${glsp(0, 0.5)};

    &,
    &:visited {
      color: inherit;
      text-decoration: none;
    }

    #nasa-logo-neg-mono {
      opacity: 1;
      transition: all 0.32s ease 0s;
    }

    #nasa-logo-pos {
      opacity: 0;
      transform: translate(0, -100%);
      transition: all 0.32s ease 0s;
    }

    &:hover {
      opacity: 1;

      #nasa-logo-neg-mono {
        opacity: 0;
      }

      #nasa-logo-pos {
        opacity: 1;
      }
    }

    svg {
      grid-row: 1 / span 2;
      height: 2.5rem;
      width: auto;
      transform: scale(1.125);
    }

    span:first-of-type {
      font-size: 0.875rem;
      line-height: 1rem;
      font-weight: ${themeVal('type.base.extrabold')};
      text-transform: uppercase;
    }

    span:last-of-type {
      grid-row: 2;
      font-size: 1.25rem;
      line-height: 1.5rem;
      font-weight: ${themeVal('type.base.light')};
      letter-spacing: -0.025em;
    }
  }
`;

const GlobalNav = styled.nav`
  margin-left: auto;
`;

const GlobalMenu = styled.ul`
  display: flex;
  flex: 1;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  gap: ${glsp(0.5)};
  margin: 0;
  list-style: none;
`;

const GlobalMenuLink = styled(Button)`
  /* styled-component */
`;

// See documentation of filterComponentProp as to why this is
const propsToFilter = [
  'variation',
  'size',
  'hideText',
  'active',
  'visuallyDisabled'
];
const StyledNavLink = filterComponentProps(NavLink, propsToFilter);

function PageHeader() {
  return (
    <PageHeaderSelf>
      <Brand>
        <Link to='/'>
          <NasaLogo />
          <span>Earthdata</span>
          <span>{appTitle}</span>
        </Link>
      </Brand>
      <GlobalNav>
        <GlobalMenu>
          <li>
            <GlobalMenuLink
              forwardedAs={StyledNavLink}
              to='/'
              end
              variation='achromic-text'
            >
              Welcome
            </GlobalMenuLink>
          </li>
        </GlobalMenu>
      </GlobalNav>
    </PageHeaderSelf>
  );
}

export default PageHeader;
