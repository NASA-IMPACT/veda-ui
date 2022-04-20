import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { Link, NavLink } from 'react-router-dom';

import {
  glsp,
  listReset,
  media,
  themeVal,
  truncated
} from '@devseed-ui/theme-provider';
import { reveal } from '@devseed-ui/animation';
import { Heading, Overline } from '@devseed-ui/typography';
import { Dropdown, DropMenu, DropMenuItem } from '@devseed-ui/dropdown';
import { ShadowScrollbar } from '@devseed-ui/shadow-scrollbar';
import { Button } from '@devseed-ui/button';
import {
  CollecticonChevronDownSmall,
  CollecticonChevronUpSmall,
  CollecticonHamburgerMenu
} from '@devseed-ui/collecticons';

import deltaThematics from 'delta/thematics';
import NasaLogo from './nasa-logo';
import { variableGlsp } from '../../styles/variable-utils';
import { useThematicArea } from '../../utils/thematics';
import {
  thematicAboutPath,
  thematicDatasetsPath,
  thematicDiscoveriesPath,
  thematicRootPath
} from '../../utils/routes';

import { useMediaQuery } from '../../utils/use-media-query';
import UnscrollableBody from './unscrollable-body';

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

      ${media.mediumUp`
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

const GlobalNav = styled.nav`
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
  padding: ${variableGlsp()};
  box-shadow: inset 0 -1px 0 0 ${themeVal('color.surface-200a')};
`;

const GlobalNavTitle = styled(Heading).attrs({
  as: 'span',
  size: 'small'
})`
  /* styled-component */
`;

export const GlobalNavActions = styled.div`
  /* styled-component */
`;

export const GlobalNavToggle = styled(Button)`
  position: absolute;
  top: ${variableGlsp()};
  right: calc(100% + ${variableGlsp()});
`;

const GlobalNavBody = styled(ShadowScrollbar).attrs({
  topShadowVariation: 'dark',
  bottomShadowVariation: 'dark'
})`
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

  ${media.largeUp`
    flex-direction: row;
    gap: ${variableGlsp()};
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
  ${media.largeUp`
    margin-left: auto;
  `}
`;

const ThemesNavBlock = styled(NavBlock)`
  ${media.mediumDown`
    order: 2;
  `}

  ${media.largeUp`
    padding-left: ${variableGlsp()};
    box-shadow: -1px 0 0 0 ${themeVal('color.surface-200a')};
  `}
`;

const GlobalNavBlockTitle = styled(Overline).attrs({
  as: 'span'
})`
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
  appearance: none;
  position: relative;
  display: flex;
  gap: ${glsp(0.25)};
  align-items: center;
  border: 0;
  background: none;
  cursor: pointer;
  color: currentColor;
  font-weight: bold;
  text-decoration: none;
  text-align: left;
  padding: ${variableGlsp(0, 1)};
  transition: all 0.32s ease 0s;

  ${media.largeUp`
    padding: ${glsp(0.5, 0)};
  `}

  &:hover {
    opacity: 0.64;
  }

  > * {
    flex-shrink: 0;
  }

  /* Menu link line decoration */

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0.125rem;
    height: 0;
    background: currentColor;

    ${media.largeUp`
      width: 0;
      height: 0.125rem;
    `}
  }

  &.active::after {
    ${media.mediumDown`
      height: 100%;
    `}

    ${media.largeUp`
      width: 100%;
    `}
  }
`;

const ThemeToggle = styled(GlobalMenuLink)`
  > span {
    ${truncated()}
    max-width: 8rem;
  }
`;

function PageHeader() {
  const thematic = useThematicArea();

  const { isMediumDown } = useMediaQuery();

  const [globalNavRevealed, setGlobalNavRevealed] = useState(false);

  const globalNavBodyRef = useRef(null);
  // Click listener for the whole global nav body so we can close it when clicking
  // the overlay on medium down media query.
  const onGlobalNavClick = useCallback((e) => {
    if (!globalNavBodyRef.current?.contains(e.target)) {
      setGlobalNavRevealed(false);
    }
  }, []);

  // Close global nav when media query changes.
  useEffect(() => {
    if (!isMediumDown) setGlobalNavRevealed(false);
  }, [isMediumDown]);

  const closeNavOnClick = useCallback(() => setGlobalNavRevealed(false), []);

  return (
    <PageHeaderSelf>
      {globalNavRevealed && isMediumDown && <UnscrollableBody />}
      <Brand>
        <Link
          to={
            deltaThematics.length > 1 && thematic ? `/${thematic.data.id}` : '/'
          }
        >
          <NasaLogo />
          <span>Earthdata</span> <span>{appTitle}</span>
        </Link>
      </Brand>
      <GlobalNav
        aria-label='Global'
        revealed={globalNavRevealed}
        onClick={onGlobalNavClick}
      >
        <GlobalNavInner ref={globalNavBodyRef}>
          {isMediumDown && (
            <GlobalNavHeader>
              <GlobalNavTitle aria-hidden='true'>Browse</GlobalNavTitle>
              <GlobalNavActions>
                <GlobalNavToggle
                  variation='achromic-text'
                  fitting='skinny'
                  onClick={() => setGlobalNavRevealed((v) => !v)}
                  active={globalNavRevealed}
                >
                  <CollecticonHamburgerMenu
                    title='Toggle global nav visibility'
                    meaningful
                  />
                </GlobalNavToggle>
              </GlobalNavActions>
            </GlobalNavHeader>
          )}
          <GlobalNavBody as={isMediumDown ? undefined : 'div'}>
            <GlobalNavBodyInner>
              {thematic && deltaThematics.length > 1 && (
                <ThemesNavBlock>
                  <GlobalNavBlockTitle>Area</GlobalNavBlockTitle>
                  {isMediumDown ? (
                    <GlobalMenu id='themes-nav-block'>
                      {deltaThematics.map((t) => (
                        <li key={t.id}>
                          <GlobalMenuLink
                            to={`/${t.id}`}
                            aria-current={null}
                            onClick={closeNavOnClick}
                          >
                            {t.name}
                          </GlobalMenuLink>
                        </li>
                      ))}
                    </GlobalMenu>
                  ) : (
                    <Dropdown
                      alignment='left'
                      // eslint-disable-next-line no-unused-vars
                      triggerElement={({ active, className, ...rest }) => (
                        <ThemeToggle {...rest} as='button'>
                          <span>{thematic.data.name}</span>{' '}
                          {active ? (
                            <CollecticonChevronUpSmall />
                          ) : (
                            <CollecticonChevronDownSmall />
                          )}
                        </ThemeToggle>
                      )}
                    >
                      <DropMenu id='themes-nav-block'>
                        {deltaThematics.map((t) => (
                          <li key={t.id}>
                            <DropMenuItem
                              as={NavLink}
                              to={`/${t.id}`}
                              aria-current={null}
                              active={t.id === thematic.data.id}
                              data-dropdown='click.close'
                            >
                              {t.name}
                            </DropMenuItem>
                          </li>
                        ))}
                      </DropMenu>
                    </Dropdown>
                  )}
                </ThemesNavBlock>
              )}
              <SectionsNavBlock>
                <GlobalNavBlockTitle>Section</GlobalNavBlockTitle>
                {thematic ? (
                  <GlobalMenu>
                    <li>
                      <GlobalMenuLink
                        to={thematicRootPath(thematic)}
                        end
                        onClick={closeNavOnClick}
                      >
                        Welcome
                      </GlobalMenuLink>
                    </li>
                    <li>
                      <GlobalMenuLink
                        to={thematicDiscoveriesPath(thematic)}
                        onClick={closeNavOnClick}
                      >
                        Discoveries
                      </GlobalMenuLink>
                    </li>
                    <li>
                      <GlobalMenuLink
                        to={thematicDatasetsPath(thematic)}
                        onClick={closeNavOnClick}
                      >
                        Datasets
                      </GlobalMenuLink>
                    </li>
                    <li>
                      <GlobalMenuLink
                        to={thematicAboutPath(thematic)}
                        end
                        onClick={closeNavOnClick}
                      >
                        About
                      </GlobalMenuLink>
                    </li>
                  </GlobalMenu>
                ) : (
                  <GlobalMenu>
                    <li>
                      <GlobalMenuLink to='/' onClick={closeNavOnClick}>
                        Welcome
                      </GlobalMenuLink>
                    </li>
                    <li>
                      <GlobalMenuLink to='/about' onClick={closeNavOnClick}>
                        About
                      </GlobalMenuLink>
                    </li>
                  </GlobalMenu>
                )}
              </SectionsNavBlock>
            </GlobalNavBodyInner>
          </GlobalNavBody>
        </GlobalNavInner>
      </GlobalNav>
    </PageHeaderSelf>
  );
}

export default PageHeader;
