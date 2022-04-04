import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Link, NavLink, useMatch } from 'react-router-dom';
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

import { variableGlsp } from '$styles/variable-utils';
import {
  datasetExplorePath,
  datasetOverviewPath,
  datasetUsagePath
} from '$utils/routes';

const PageLocalNavSelf = styled.nav`
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  flex-flow: row nowrap;
  align-items: end;
  justify-content: space-between;
  gap: ${variableGlsp()};
  padding: ${variableGlsp(0.5, 1)};
  background: ${themeVal('color.primary')};
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

const LocalMenu = styled.ul`
  ${listReset()}
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: ${glsp()};
  max-width: 1/3vw;
  overflow: auto;

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
  padding: ${glsp(0.25, 0)};
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

function PageLocalNav(props) {
  const { localMenuCmp, parentName, parentLabel, parentTo, items, currentId } =
    props;

  // Keep the url structure on dataset pages
  const datasetPageMatch = useMatch('/:thematicId/datasets/:dataId/:page');
  const currentPage = datasetPageMatch ? datasetPageMatch.params.page : '';

  const currentItem = items.find((o) => o.id === currentId);
  return (
    <PageLocalNavSelf>
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
                      to={`${parentTo}/${t.id}/${currentPage}`}
                      aria-current={t.id === currentId ? 'page' : 'null'}
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
  );
}

DatasetsLocalMenu.propTypes = {
  thematic: T.object,
  dataset: T.object
};
