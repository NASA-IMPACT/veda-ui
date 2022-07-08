import React, { useEffect, useState } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Link, NavLink, useMatch } from 'react-router-dom';
import deltaThematics from 'delta/thematics';

import {
  glsp,
  themeVal,
  media,
  listReset,
  truncated
} from '@devseed-ui/theme-provider';
import {
  CollecticonChevronDownSmall,
  CollecticonChevronUpSmall
} from '@devseed-ui/collecticons';
import { reveal } from '@devseed-ui/animation';
import { Overline } from '@devseed-ui/typography';
import { Dropdown, DropMenu, DropMenuItem } from '@devseed-ui/dropdown';
import { ShadowScrollbar } from '@devseed-ui/shadow-scrollbar';

import useScrollDirection from '$utils/use-scroll-direction';
import { variableGlsp } from '$styles/variable-utils';
import {
  datasetExplorePath,
  datasetOverviewPath,
  datasetUsagePath
} from '$utils/routes';

// add scroll direction detection, and adjust top position of pageLocalSelf, also add animation
// ex/ scrolling up: top: 60px; scrolling down: top: 0
// do the similar thing to global nav
const PageLocalNavSelf = styled.nav`
  position: sticky;
  z-index: 100;
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
  justify-content: space-between;
  gap: ${variableGlsp()};
  padding: ${variableGlsp(0.5, 1)};
  background: ${themeVal('color.primary')};
  box-shadow: 0 -1px 0 0 ${themeVal('color.surface-200a')};
  color: ${themeVal('color.surface')};
  animation: ${reveal} 0.32s ease 0s 1;
`;

const LocalBreadcrumb = styled.ol`
  ${listReset()}
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: ${glsp(0.5)};
  min-width: 0;

  ${media.largeUp`
    gap: ${glsp()};
  `}

  > *:last-child {
    min-width: 0;
  }
`;

const NavBlock = styled(ShadowScrollbar)`
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  flex-basis: 12rem;

  ${media.smallUp`
    flex-grow: 1;
  `}

  .shadow-left {
    background: linear-gradient(
      to left,
      ${themeVal('color.primary')}00 0%,
      ${themeVal('color.primary')} 100%
    );
  }

  .shadow-right {
    background: linear-gradient(
      to right,
      ${themeVal('color.primary')}00 0%,
      ${themeVal('color.primary')} 100%
    );
  }

  .scroll-area > div {
    ${media.smallUp`
      display: flex;
      justify-content: flex-end;
    `}
  }
`;

const LocalMenu = styled.ul`
  ${listReset()}
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: ${glsp()};

  a,
  a:visited {
    color: inherit;
    text-decoration: none;
  }
`;

const LocalMenuLink = styled(NavLink)`
  appearance: none;
  position: relative;
  display: flex;
  gap: ${glsp(0.25)};
  align-items: center;
  padding: ${glsp(0.5, 0)};
  border: 0;
  background: none;
  cursor: pointer;
  color: currentColor;
  font-weight: bold;
  text-decoration: none;
  text-align: left;
  transition: all 0.32s ease 0s;

  &:hover {
    opacity: 0.64;
  }

  /* Menu link line decoration */

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 0.125rem;
    width: 0;
    background: currentColor;
  }

  &.active::after {
    width: 100%;
  }

  svg {
    flex-shrink: 0;
  }
`;

const SectionParentLink = styled(Overline).attrs({
  as: Link
})`
  color: currentColor;
  opacity: 0.64;

  &,
  &:visited {
    color: inherit;
    text-decoration: none;
  }
`;

const SectionLink = styled(LocalMenuLink)`
  max-width: 100%;

  > span {
    ${truncated}
  }
`;

// When there's only w thematic are, we don't use :thematicId.
const pagePath =
  deltaThematics.length > 1
    ? '/:thematicId/datasets/:dataId/:page'
    : '/datasets/:dataId/:page';

function PageLocalNav(props) {
  const { localMenuCmp, parentName, parentLabel, parentTo, items, currentId } =
    props;

  // Keep the url structure on dataset pages
  const datasetPageMatch = useMatch(pagePath);
  const currentPage = datasetPageMatch ? datasetPageMatch.params.page : '';

  const [scrollDir, setScrollDir] = useScrollDirection();
  const [navTopPosition, setNavTopPosition] = useState(0);

  useEffect(() => {
    if (scrollDir === 'up') setNavTopPosition('60px');
    else if (scrollDir === 'down') setNavTopPosition('0');
  }, [scrollDir]);

  const currentItem = items.find((o) => o.id === currentId);
  return (
    <PageLocalNavSelf style={{ top: navTopPosition }}>
      <LocalBreadcrumb>
        <li>
          <SectionParentLink to={parentTo} aria-label={parentLabel}>
            {parentName}
          </SectionParentLink>
        </li>
        <li>
          {items.length > 1 ? (
            <Dropdown
              alignment='left'
              // eslint-disable-next-line no-unused-vars
              triggerElement={({ active, className, ...rest }) => (
                <SectionLink {...rest} as='button'>
                  <span>{currentItem.name}</span>{' '}
                  {active ? (
                    <CollecticonChevronUpSmall />
                  ) : (
                    <CollecticonChevronDownSmall />
                  )}
                </SectionLink>
              )}
            >
              <DropMenu>
                {items.map((t) => (
                  <li key={t.id}>
                    <DropMenuItem
                      as={NavLink}
                      to={`${parentTo}/${t.id}/${currentPage}`.replace(
                        /\/$/,
                        ''
                      )}
                      aria-current={t.id === currentId ? 'page' : null}
                      active={t.id === currentItem.id}
                      data-dropdown='click.close'
                    >
                      {t.name}
                    </DropMenuItem>
                  </li>
                ))}
              </DropMenu>
            </Dropdown>
          ) : (
            <SectionLink as={Link} to={`${parentTo}/${currentId}`}>
              <span>{currentItem.name}</span>
            </SectionLink>
          )}
        </li>
      </LocalBreadcrumb>
      {localMenuCmp}
    </PageLocalNavSelf>
  );
}

export default PageLocalNav;

PageLocalNav.propTypes = {
  localMenuCmp: T.node,
  parentName: T.string,
  parentLabel: T.string,
  parentTo: T.string,
  items: T.array,
  currentId: T.string
};

export function DatasetsLocalMenu(props) {
  const { thematic, dataset } = props;

  return (
    <NavBlock>
      <LocalMenu>
        <li>
          <LocalMenuLink to={datasetOverviewPath(thematic, dataset)} end>
            Overview
          </LocalMenuLink>
        </li>
        <li>
          <LocalMenuLink to={datasetExplorePath(thematic, dataset)} end>
            Exploration
          </LocalMenuLink>
        </li>
        <li>
          <LocalMenuLink to={datasetUsagePath(thematic, dataset)} end>
            Usage
          </LocalMenuLink>
        </li>
      </LocalMenu>
    </NavBlock>
  );
}

DatasetsLocalMenu.propTypes = {
  thematic: T.object,
  dataset: T.object
};
