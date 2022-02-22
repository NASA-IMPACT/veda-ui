import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

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

import { variableGlsp } from '../../styles/variable-utils';

import {
  datasetExplorePath,
  datasetOverviewPath,
  datasetUsagePath
} from '../../utils/routes';
import { Dropdown, DropMenu, DropMenuItem } from '@devseed-ui/dropdown';

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
  background: ${themeVal('color.base-50')};
  box-shadow: 0 1px 0 0 ${themeVal('color.base-100a')};
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
  as: 'a'
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
  const { thematic, dataset, title } = props;

  return (
    <PageLocalNavSelf>
      <LocalBreadcrumb>
        <li>
          <SectionParentLink href='/' aria-label='Datasets'>
            Dataset
          </SectionParentLink>
        </li>
        <li>
          <Dropdown
            alignment='left'
            // eslint-disable-next-line no-unused-vars
            triggerElement={({ active, className, ...rest }) => (
              <SectionLink {...rest} as='button'>
                <span>{title}</span>{' '}
                {active ? (
                  <CollecticonChevronUpSmall />
                ) : (
                  <CollecticonChevronDownSmall />
                )}
              </SectionLink>
            )}
          >
            <DropMenu>
              {[{ id: 't', name: 'Test dataset' }].map((t) => (
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
        </li>
      </LocalBreadcrumb>
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
    </PageLocalNavSelf>
  );
}

export default PageLocalNav;

PageLocalNav.propTypes = {
  title: T.string,
  thematic: T.object,
  dataset: T.object
};
