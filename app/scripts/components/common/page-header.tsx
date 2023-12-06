import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { Link, NavLink } from 'react-router-dom';
import { userPages, getOverride, getString } from 'veda';
import {
  glsp,
  listReset,
  media,
  rgba,
  themeVal,
  visuallyHidden
} from '@devseed-ui/theme-provider';
import { reveal } from '@devseed-ui/animation';
import { Heading, Overline } from '@devseed-ui/typography';
import { Button } from '@devseed-ui/button';
import {
  CollecticonEllipsisVertical,
  CollecticonHamburgerMenu
} from '@devseed-ui/collecticons';
import { DropMenu, DropMenuItem } from '@devseed-ui/dropdown';

import DropdownScrollable from './dropdown-scrollable';

import NasaLogo from './nasa-logo';
import GoogleForm from './google-form';
import { Tip } from './tip';

import UnscrollableBody from './unscrollable-body';
import { variableGlsp } from '$styles/variable-utils';
import {
  STORIES_PATH,
  DATASETS_PATH,
  ANALYSIS_PATH,
  ABOUT_PATH,
  EXPLORATION_PATH
} from '$utils/routes';
import GlobalMenuLinkCSS from '$styles/menu-link';
import { useMediaQuery } from '$utils/use-media-query';
import { HEADER_ID } from '$utils/use-sliding-sticky-header';
import { ComponentOverride } from '$components/common/page-overrides';

const rgbaFixed = rgba as any;

const appTitle = process.env.APP_TITLE;
const appVersion = process.env.APP_VERSION;

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

const Brand = styled.div`
  display: flex;
  flex-shrink: 0;

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

      ${media.largeUp`
        transform: scale(1.125);
      `}
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
      font-weight: ${themeVal('type.base.regular')};
      letter-spacing: -0.025em;
    }
  }
`;

const PageTitleSecLink = styled(Link)`
  align-self: end;
  font-size: 0.75rem;
  font-weight: ${themeVal('type.base.bold')};
  line-height: 1rem;
  text-transform: uppercase;
  background: ${themeVal('color.surface')};
  padding: ${glsp(0, 0.25)};
  border-radius: ${themeVal('shape.rounded')};
  margin: ${glsp(0.125, 0.5)};

  &&,
  &&:visited {
    color: ${themeVal('color.primary')};
  }

  ${media.largeUp`
    margin: ${glsp(0, 0.5)};
    font-size: 0.875rem;
    line-height: 1.25rem;
    padding: 0 ${glsp(0.5)};
  `}
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

const GlobalMenuLink = styled(NavLink)`
  ${GlobalMenuLinkCSS}
`;

const DropMenuNavItem = styled(DropMenuItem)`
  &.active {
    background-color: ${rgbaFixed(themeVal('color.link'), 0.08)};
  }
`;

function PageHeader() {
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

  const userPagesMainNavItem = userPages.map((id) => {
    const page = getOverride(id as any);
    if (!(page?.data.mainNavItem && page.data.mainNavItem.navTitle)) return false;

    return (
      <li key={id}>
        <GlobalMenuLink to={id} onClick={closeNavOnClick}>
          {page.data.mainNavItem.navTitle }
        </GlobalMenuLink>
      </li>
    );
  });

  return (
    <PageHeaderSelf id={HEADER_ID}>
      {globalNavRevealed && isMediumDown && <UnscrollableBody />}
      <ComponentOverride with='headerBrand'>
        <Brand>
          <Link to='/'>
            <NasaLogo />
            <span>Earthdata</span> <span>{appTitle}</span>
          </Link>
          <Tip content={`v${appVersion}`}>
            <PageTitleSecLink to='/development'>Beta</PageTitleSecLink>
          </Tip>
        </Brand>
      </ComponentOverride>
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
                  <li>
                    <GlobalMenuLink
                      to={DATASETS_PATH}
                      onClick={closeNavOnClick}
                    >
                      Data Catalog
                    </GlobalMenuLink>
                  </li>
                  <li>
                    {process.env.FEATURE_NEW_EXPLORATION ? (
                      <GlobalMenuLink
                        to={EXPLORATION_PATH}
                        onClick={closeNavOnClick}
                      >
                        Exploration
                      </GlobalMenuLink>
                    ) : (
                      <GlobalMenuLink
                        to={ANALYSIS_PATH}
                        onClick={closeNavOnClick}
                      >
                        Data Analysis
                      </GlobalMenuLink>
                    )}
                  </li>
                  <li>
                    <GlobalMenuLink to={STORIES_PATH} onClick={closeNavOnClick}>
                      {getString('stories').other}
                    </GlobalMenuLink>
                  </li>

                  {/*
                    Temporarily add hub link through env variables.
                    This does not scale for the different instances, but it's a
                    quick fix for the GHG app.
                  */}
                  {!!process.env.HUB_URL && !!process.env.HUB_NAME && (
                    <li>
                      <GlobalMenuLink
                        as='a'
                        target='_blank'
                        rel='noopener'
                        href={process.env.HUB_URL}
                        onClick={closeNavOnClick}
                      >
                        {process.env.HUB_NAME}
                      </GlobalMenuLink>
                    </li>
                  )}
                </GlobalMenu>
              </SectionsNavBlock>
              <SectionsNavBlock>
                <GlobalNavBlockTitle>Meta</GlobalNavBlockTitle>
                <GlobalMenu>
                  {userPagesMainNavItem}
                  <li>
                    <GlobalMenuLink to={ABOUT_PATH} onClick={closeNavOnClick}>
                      About
                    </GlobalMenuLink>
                  </li>
                  {!!process.env.GOOGLE_FORM && (
                    <li>
                      <GoogleForm />
                    </li>
                  )}

                  <UserPagesDotMenu
                    onItemClick={closeNavOnClick}
                    isMediumDown={isMediumDown}
                  />
                </GlobalMenu>
              </SectionsNavBlock>
            </GlobalNavBodyInner>
          </GlobalNavBody>
        </GlobalNavInner>
      </GlobalNav>
    </PageHeaderSelf>
  );
}

export default PageHeader;

interface DotMenuItem {
  id: any;
  menu: string;
}

function UserPagesDotMenu(props: {
  isMediumDown: boolean;
  onItemClick: () => void;
}) {
  const { isMediumDown, onItemClick } = props;

  const dotMenuItems = userPages.reduce((menuItems: DotMenuItem[], id: any) => {
    const page = getOverride(id as any);
    if (page?.data.menu)
      // eslint-disable-next-line fp/no-mutating-methods
      return menuItems.concat({
        id,
        menu: page.data.menu
      });
    return menuItems;
  }, []);

  if (!dotMenuItems.length) return <>{false}</>;

  if (isMediumDown) {
    return (
      <>
        {dotMenuItems.map((menuItem) => {
          const page = getOverride(menuItem.id as any);
          if (!page?.data.menu) return false;

          return (
            <li key={menuItem.id}>
              <GlobalMenuLink to={menuItem.id} onClick={onItemClick}>
                {menuItem.menu}
              </GlobalMenuLink>
            </li>
          );
        })}
      </>
    );
  }

  return (
    <DropdownScrollable
      alignment='right'
      triggerElement={(props) => (
        // @ts-expect-error UI lib error. achromic-text does exit
        <Button {...props} variation='achromic-text' fitting='skinny'>
          <CollecticonEllipsisVertical meaningful title='View pages menu' />
        </Button>
      )}
    >
      <DropMenu>
        {userPages.map((id) => {
          const page = getOverride(id as any);
          if (!page?.data.menu) return false;

          return (
            <li key={id}>
              <DropMenuNavItem as={NavLink} to={id} data-dropdown='click.close'>
                {page.data.menu}
              </DropMenuNavItem>
            </li>
          );
        })}
      </DropMenu>
    </DropdownScrollable>
  );
}
