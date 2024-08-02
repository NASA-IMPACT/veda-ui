import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import {
  glsp,
  media,
  rgba,
  themeVal
} from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';
import { DropMenu, DropMenuItem } from '@devseed-ui/dropdown';

import DropdownScrollable from '../dropdown-scrollable';
import GoogleForm from '../google-form';
import { AlignmentEnum, InternalNavLink, ExternalNavLink, NavLinkItem, DropdownNavLink, NavItem } from './types';

import GlobalMenuLinkCSS from '$styles/menu-link';
import { useMediaQuery } from '$utils/use-media-query';

const rgbaFixed = rgba as any;

export const GlobalNavActions = styled.div`
  align-self: start;
  ${media.largeUp`
    display: none;
  `}
`;

const GlobalMenuItem = styled.span`
  ${GlobalMenuLinkCSS}
  cursor: default;
  &:hover {
    opacity: 1;
  }
`;

export const GlobalNavToggle = styled(Button)`
  z-index: 2000;
`;

const GlobalMenuLink = styled(NavLink)`
  ${GlobalMenuLinkCSS}
`;
const GlobalMenuButton = styled(Button)`
  ${GlobalMenuLinkCSS}
`;

const DropMenuNavItem = styled(DropMenuItem)`
  &.active {
    background-color: ${rgbaFixed(themeVal('color.link'), 0.08)};
  }
  ${media.largeDown`
    padding-left ${glsp(2)};
  `}
`;

export const MODAL_TYPE = 'modal';
export const INTERNAL_LINK_TYPE = 'internalLink';
export const EXTERNAL_LINK_TYPE = 'externalLink';
export const DROPDOWN_TYPE = 'dropdown';


function ChildItem({ child }: { child: NavLinkItem}) {
  const { title, type, ...rest } = child;
  if (type === INTERNAL_LINK_TYPE) {
    return (
    <li> 
      <DropMenuNavItem as={NavLink} {...rest as InternalNavLink} data-dropdown='click.close'>
        {title}
      </DropMenuNavItem>
    </li>
    );
    // In case a user inputs a wrong type
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  } else if (type === EXTERNAL_LINK_TYPE) {
    return (
      <li key={`${title}-dropdown-menu`}>
        <DropMenuNavItem as='a' target='blank' rel='noopener' {...rest as ExternalNavLink} data-dropdown='click.close'>
          {title}
        </DropMenuNavItem>
      </li>
    );
  } else throw Error('Invalid child Nav item type');
}


export default function NavMenuItem({ item, alignment, onClick }: {item: NavItem, alignment?: AlignmentEnum, onClick?: () => void }) {
  const { isMediumDown } = useMediaQuery();
  if (item.type === INTERNAL_LINK_TYPE) {
    const { title, ...rest } = item as InternalNavLink;
      return (
        <li key={`${title}-nav-item`}>
        <GlobalMenuLink {...rest} onClick={onClick}>
          {title}
        </GlobalMenuLink>
        </li>
        
      );
  } else if (item.type === EXTERNAL_LINK_TYPE) {
    const { title, ...rest } = item as ExternalNavLink;
    return (
      <li key={`${title}-nav-item`}>
      <GlobalMenuLink 
        as='a'
        target='blank'
        rel='noopener'
        onClick={onClick}
        {...rest} 
      >
        {title}
      </GlobalMenuLink>
      </li>
      
    );
  } else if (item.type === MODAL_TYPE) {
    return (<li><GoogleForm title={item.title} src={item.src} /></li>);
  } else {// if (item.type === DROPDOWN_TYPE
    const { title } = item as DropdownNavLink;
    // Mobile view
    if (isMediumDown) {
      return (
        <>
        <li><GlobalMenuItem>{title} </GlobalMenuItem></li>
          {item.children.map((child) => {
            return <ChildItem key={`${title}-dropdown-menu`} child={child} />;
          })}
        </>
      );
    // In case a user inputs a wrong type
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    } else if (item.type === DROPDOWN_TYPE) {
    return (<li>
      <DropdownScrollable
        alignment={alignment?? 'left'}
        triggerElement={(props) => (
          // @ts-expect-error achromic text exists
          <GlobalMenuButton {...props} variation='achromic-text' fitting='skinny'>
            {title}
          </GlobalMenuButton>
        )}
      >
        <DropMenu>
          {item.children.map((child) => {
            return <ChildItem key={`${title}-dropdown-menu`} child={child} />;
          })}
        </DropMenu>
      </DropdownScrollable>
            </li>);
    } else throw Error('Invalid type for Nav Items');
  }
}