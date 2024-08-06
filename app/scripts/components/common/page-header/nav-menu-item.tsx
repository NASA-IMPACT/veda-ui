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
import { CollecticonChevronDownSmall } from '@devseed-ui/collecticons';
import { DropMenu, DropMenuItem } from '@devseed-ui/dropdown';

import DropdownScrollable from '../dropdown-scrollable';
import GoogleForm from '../google-form';
import { AlignmentEnum, InternalNavLink, ExternalNavLink, NavLinkItem, DropdownNavLink, ModalNavLink, NavItem } from './types';

import { MODAL_TYPE, INTERNAL_LINK_TYPE, EXTERNAL_LINK_TYPE,  DROPDOWN_TYPE } from './';
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
    &:hover {
      color: inherit;
      opacity: 0.64;
    }
  `}
`;


function LinkDropMenuNavItem({ child, onClick }: { child: NavLinkItem, onClick?:() => void}) {
  const { title, type, ...rest } = child;
  if (type === INTERNAL_LINK_TYPE) {
    return (
    <li> 
      <DropMenuNavItem as={NavLink} to={(rest as InternalNavLink).to} onClick={onClick} data-dropdown='click.close'>
        {title}
      </DropMenuNavItem>
    </li>
    );
    // In case a user inputs a wrong type
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  } else if (type === EXTERNAL_LINK_TYPE) {
    return (
      <li key={`${title}-dropdown-menu`}>
        <DropMenuNavItem as='a' target='blank' rel='noopener' href={(rest as ExternalNavLink).href} onClick={onClick} data-dropdown='click.close'>
          {title}
        </DropMenuNavItem>
      </li>
    );
  } else throw Error('Invalid child Nav item type');
}


export default function NavMenuItem({ item, alignment, onClick }: {item: NavItem, alignment?: AlignmentEnum, onClick?: () => void }) {
  const { isMediumDown } = useMediaQuery();
  const { title, type, ...rest } = item;
  if (type === INTERNAL_LINK_TYPE) {
      return (
        <li key={`${title}-nav-item`}>
        <GlobalMenuLink to={(rest as InternalNavLink).to} onClick={onClick}>
          {title}
        </GlobalMenuLink>
        </li>
        
      );
  } else if (item.type === EXTERNAL_LINK_TYPE) {
    return (
      <li key={`${title}-nav-item`}>
      <GlobalMenuLink 
        as='a'
        target='blank'
        rel='noopener'
        onClick={onClick}
        href={(rest as ExternalNavLink).href}
      >
        {title}
      </GlobalMenuLink>
      </li>

    );
  } else if (type === MODAL_TYPE) {
    return (<li><GoogleForm title={title} src={(item as ModalNavLink).src} /></li>);

  } else if (type === DROPDOWN_TYPE) {
    const { title } = item as DropdownNavLink;
    // Mobile view
    if (isMediumDown) {
      return (
        <>
        <li><GlobalMenuItem>{title} </GlobalMenuItem></li>
          {item.children.map((child) => {
            return <LinkDropMenuNavItem key={`${title}-dropdown-menu`} child={child} onClick={onClick} />;
          })}
        </>
      );
    } else {
     return (<li>
      <DropdownScrollable
        alignment={alignment?? 'left'}
        triggerElement={(props) => (
          // @ts-expect-error achromic text exists
          <GlobalMenuButton {...props} variation='achromic-text' fitting='skinny'>
            {title} <CollecticonChevronDownSmall size='small' />
          </GlobalMenuButton>
        )}
      >
        <DropMenu>
          {(item as DropdownNavLink).children.map((child) => {
            return <LinkDropMenuNavItem key={`${title}-dropdown-menu`} child={child} />;
          })}
        </DropMenu>
      </DropdownScrollable>
             </li>);
    } 
  } else throw Error('Invalid type for Nav Items');
}