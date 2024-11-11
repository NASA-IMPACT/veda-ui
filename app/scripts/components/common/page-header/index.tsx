import React, { useCallback, useEffect, useRef, useState, ReactElement } from 'react';
import styled, { css } from 'styled-components';
import {
  glsp,
  listReset,
  media,
  themeVal,
  visuallyHidden
} from '@devseed-ui/theme-provider';
import { reveal } from '@devseed-ui/animation';
import { Heading, Overline } from '@devseed-ui/typography';
import { Button } from '@devseed-ui/button';
import {
  CollecticonHamburgerMenu
} from '@devseed-ui/collecticons';

import UnscrollableBody from '../unscrollable-body';
import NavMenuItem from './nav-menu-item';
import { NavItem } from './types';

import { variableGlsp } from '$styles/variable-utils';
import { PAGE_BODY_ID } from '$components/common/layout-root';
import { useMediaQuery } from '$utils/use-media-query';
import { HEADER_ID } from '$utils/use-sliding-sticky-header';
import { LinkProperties } from '$types/veda';


const PageHeaderSelf = styled.header`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  gap: ${variableGlsp()};
  padding: ${variableGlsp(0.75, 1)};
  background: ${themeVal('color.primary')};
  animation: ${reveal} 0.32s ease 0s 1;

  &,
  &:visited {
    color: ${themeVal('color.surface')};
  }
`;


const GlobalNav = styled.nav<{ revealed: boolean }>`
  position: fixed;
  inset: 0 0 0 auto;
  z-index: 900;
  display: flex;
  flex-flow: column nowrap;
  width: 20rem;
  margin-right: -20rem;
  transition: margin 0.24s ease 0s;

  ${({ revealed }) =>
    revealed &&
    css`
      & {
        margin-right: 0;
      }
    `}

  ${media.largeUp`
    position: static;
    flex: 1;
    margin: 0;
  }

    &:before {
      content: '';
    }
  `}

  /* Show page nav backdrop on small screens */

  &::after {
    content: '';
    position: absolute;
    inset: 0 0 0 auto;
    z-index: -1;
    background: transparent;
    width: 0;
    transition: background 0.64s ease 0s;

    ${({ revealed }) =>
      revealed &&
      css`
        ${media.mediumDown`
          background: ${themeVal('color.base-400a')};
          width: 200vw;
        `}
      `}
  }
`;

const GlobalNavInner = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: ${themeVal('color.primary')};

  ${media.mediumDown`
    box-shadow: ${themeVal('boxShadow.elevationD')};
  `}
`;

const GlobalNavHeader = styled.div`
  padding: ${variableGlsp(1)};
  box-shadow: inset 0 -1px 0 0 ${themeVal('color.surface-200a')};
  ${media.largeUp`
    display: none;
  `}
`;

const GlobalNavTitle = styled(Heading).attrs({
  as: 'span',
  size: 'small'
})`
  /* styled-component */
`;

export const GlobalNavActions = styled.div`
  align-self: start;
  ${media.largeUp`
    display: none;
  `}
`;

export const GlobalNavToggle = styled(Button)`
  z-index: 2000;
`;

const GlobalNavBody = styled.div`
  display: flex;
  flex: 1;

  .shadow-top {
    background: linear-gradient(
      to top,
      ${themeVal('color.primary-600')}00 0%,
      ${themeVal('color.primary-600')} 100%
    );
  }

  .shadow-bottom {
    background: linear-gradient(
      to bottom,
      ${themeVal('color.primary-600')}00 0%,
      ${themeVal('color.primary-600')} 100%
    );
  }
`;

const GlobalNavBodyInner = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: ${variableGlsp()};
  padding: ${variableGlsp(1, 0)};

  ${media.largeUp`
    flex-direction: row;
    justify-content: space-between;
    padding: 0;
  `}
`;

const NavBlock = styled.div`
  display: flex;
  flex-flow: column nowrap;
  gap: ${glsp(0.25)};

  ${media.largeUp`
    flex-direction: row;
    align-items: center;
    gap: ${glsp(1.5)};
  `}
`;

const SROnly = styled.a`
  height: 1px;
  left: -10000px;
  overflow: hidden;
  position: absolute;
  top: auto;
  width: 1px;
  color: ${themeVal('color.link')};
  &:focus {
    top: 0;
    left: 0;
    background-color: ${themeVal('color.surface')};
    padding: ${glsp(0.25)};
    height: auto;
    width: auto;
  }
`;

const SectionsNavBlock = styled(NavBlock)`
  /* styled-component */
`;

const GlobalNavBlockTitle = styled(Overline).attrs({
  as: 'span'
})`
  ${visuallyHidden}
  display: block;
  padding: ${variableGlsp(1, 1, 0.25, 1)};
  color: currentColor;
  opacity: 0.64;

  ${media.largeUp`
    padding: 0;
  `}
`;

const GlobalMenu = styled.ul`
  ${listReset()}
  display: flex;
  flex-flow: column nowrap;
  gap: ${glsp(0.5)};

  ${media.largeUp`
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: ${glsp(1.5)};
  `}
`;

interface PageHeaderProps {
  mainNavItems: NavItem[];
  subNavItems: NavItem[];
  logo: ReactElement;
  linkProperties: LinkProperties;
}

function PageHeader(props: PageHeaderProps) {
  const { mainNavItems, subNavItems, logo, linkProperties } = props;
  const { isMediumDown } = useMediaQuery();
  const [globalNavRevealed, setGlobalNavRevealed] = useState(false);

  const globalNavBodyRef = useRef<HTMLDivElement>(null);
  // Click listener for the whole global nav body so we can close it when clicking
  // the overlay on medium down media query.
  const onGlobalNavClick = useCallback((e) => {
    if (!globalNavBodyRef.current?.contains(e.target)) {
      setGlobalNavRevealed(false);
    }
  }, []);

  useEffect(() => {
    // Close global nav when media query changes.
    // NOTE: isMediumDown is returning document.body's width, not the whole window width
    // which conflicts with how mediaquery decides the width.
    // JSX element susing isMediumDown is also protected with css logic because of this.
    // ex. Look at GlobalNavActions
    if (!isMediumDown) setGlobalNavRevealed(false);
  }, [isMediumDown]);

  const closeNavOnClick = useCallback(() => {
    setGlobalNavRevealed(false);
  }, []);

  function skipNav(e) {
    // a tag won't appear for keyboard focus without href
    // so we are preventing the default behaviour of a link here
    e.preventDefault();
    // Then find a next focusable element in pagebody,focus it.
    const pageBody = document.getElementById(PAGE_BODY_ID);
    if (pageBody) {
        pageBody.focus();
    }
  }

  return (
    <>
    <SROnly href='#' onClick={skipNav}>Skip to main content</SROnly>
    <PageHeaderSelf id={HEADER_ID}>
      {globalNavRevealed && isMediumDown && <UnscrollableBody />}
      {logo}
      {isMediumDown && (
        <GlobalNavActions>
          <GlobalNavToggle
            aria-label={
              globalNavRevealed
                ? 'Close Global Navigation'
                : 'Open Global Navigation'
            }
            // @ts-expect-error UI lib error. achromic-text does exit
            variation='achromic-text'
            fitting='skinny'
            onClick={() => setGlobalNavRevealed((v) => !v)}
            active={globalNavRevealed}
          >
            <CollecticonHamburgerMenu />
          </GlobalNavToggle>
        </GlobalNavActions>
      )}
      <GlobalNav
        aria-label='Global Navigation'
        role='navigation'
        revealed={globalNavRevealed}
        onClick={onGlobalNavClick}
      >
        <GlobalNavInner ref={globalNavBodyRef}>
          {isMediumDown && (
            <>
              <GlobalNavHeader>
                <GlobalNavTitle aria-hidden='true'>Browse</GlobalNavTitle>
              </GlobalNavHeader>
            </>
          )}
          <GlobalNavBody as={isMediumDown ? undefined : 'div'}>
            <GlobalNavBodyInner>
              <SectionsNavBlock>
                <GlobalNavBlockTitle>Global</GlobalNavBlockTitle>
                <GlobalMenu>
                  {mainNavItems.map((item) => {
                    return <NavMenuItem linkProperties={linkProperties} key={`${item.title}-nav-item`} item={item} alignment='left' onClick={closeNavOnClick} />;
                  })}
                </GlobalMenu>
              </SectionsNavBlock>
              <SectionsNavBlock>
                <GlobalNavBlockTitle>Meta</GlobalNavBlockTitle>
                <GlobalMenu>
                  {subNavItems.map((item) => {
                    return <NavMenuItem linkProperties={linkProperties} key={`${item.title}-nav-item`} item={item} alignment='right' onClick={closeNavOnClick} />;
                  })}
                </GlobalMenu>
              </SectionsNavBlock>
            </GlobalNavBodyInner>
          </GlobalNavBody>
        </GlobalNavInner>
      </GlobalNav>
    </PageHeaderSelf>
    </>
  );
}

export default PageHeader;
