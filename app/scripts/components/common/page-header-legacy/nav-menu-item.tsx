import React, { ComponentType } from 'react';
import styled from 'styled-components';
import { glsp, media, rgba, themeVal } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';
import { CollecticonChevronDownSmall } from '@devseed-ui/collecticons';
import { DropMenu, DropMenuItem } from '@devseed-ui/dropdown';

import DropdownScrollable from '../dropdown-scrollable';
import GoogleForm from '../google-form';
import {
  AlignmentEnum,
  NavLinkItem,
  DropdownNavLink,
  NavItem,
  NavItemType
} from '../page-header/types';
import { InternalNavLink, ExternalNavLink } from '../types';
import { useFeedbackModal } from '../layout-root';
import GlobalMenuLinkCSS from '$styles/menu-link';
import { useMediaQuery } from '$utils/use-media-query';
import { LinkProperties } from '$types/veda';

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

const GlobalMenuLink = styled.a`
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

const LOG = true;

function LinkDropMenuNavItem({
  child,
  onClick,
  linkProperties
}: {
  child: NavLinkItem;
  onClick?: () => void;
  linkProperties: LinkProperties;
}) {
  const { title, type, ...rest } = child;
  const linkProps = {
    as: linkProperties.LinkElement as ComponentType<any>,
    [linkProperties.pathAttributeKeyName]: (rest as InternalNavLink).to
  };

  if (type === NavItemType.INTERNAL_LINK) {
    return (
      <li>
        <DropMenuNavItem
          {...linkProps}
          onClick={onClick}
          data-dropdown='click.close'
        >
          {title}
        </DropMenuNavItem>
      </li>
    );
    // In case a user inputs a wrong type
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  } else if (type === NavItemType.EXTERNAL_LINK) {
    return (
      <li key={`${title}-dropdown-menu`}>
        <DropMenuNavItem
          as='a'
          target='blank'
          rel='noopener'
          href={(rest as ExternalNavLink).href}
          onClick={onClick}
          data-dropdown='click.close'
        >
          {title}
        </DropMenuNavItem>
      </li>
    );
  } else {
    LOG &&
      /* eslint-disable-next-line no-console */
      console.error(
        `Invalid child Nav Item type, type "${type}" is not of `,
        NavItemType
      );
    return null;
  }
}

interface BtnMediaProps {
  active?: boolean;
}

// Global menu link style
const ButtonAsNavLink = styled(Button)`
  ${media.mediumUp<BtnMediaProps>`
    background-color: ${themeVal('color.primary-700')};
    &:hover {
      background-color: ${themeVal('color.primary-800')};
    }
    /* Print & when prop is passed */
    ${({ active }) => active && '&,'}
    &:active,
    &.active {
      background-color: ${themeVal('color.primary-900')};
    }
    &:focus-visible {
      background-color: ${themeVal('color.primary-200a')};
    }
  `}
  ${media.mediumDown`
    ${GlobalMenuLinkCSS}
  `}
`;

export default function NavMenuItem({
  item,
  alignment,
  onClick,
  linkProperties
}: {
  item: NavItem;
  alignment?: AlignmentEnum;
  onClick?: () => void;
  linkProperties: LinkProperties;
}) {
  const { isMediumDown } = useMediaQuery();
  const { isRevealed, show, hide } = useFeedbackModal();
  const { title, type, ...rest } = item;

  if (type === NavItemType.INTERNAL_LINK) {
    const linkProps = {
      as: linkProperties.LinkElement as ComponentType<any>,
      [linkProperties.pathAttributeKeyName]: (rest as InternalNavLink).to
    };
    return (
      <li key={`${title}-nav-item`}>
        <GlobalMenuLink {...linkProps} onClick={onClick}>
          {title}
        </GlobalMenuLink>
      </li>
    );
  } else if (item.type === NavItemType.EXTERNAL_LINK) {
    return (
      <li key={`${title}-nav-item`}>
        <GlobalMenuLink
          as='a'
          target='_blank'
          rel='noopener'
          onClick={onClick}
          href={(rest as ExternalNavLink).href}
        >
          {title}
        </GlobalMenuLink>
      </li>
    );
  } else if (item.type === NavItemType.ACTION) {
    return (
      <li>
        <ButtonAsNavLink
          type='button'
          size='large'
          onClick={show}
          style={{ color: 'white' }}
        >
          {title}
        </ButtonAsNavLink>
        {process.env.GOOGLE_FORM && (
          <GoogleForm
            src={process.env.GOOGLE_FORM}
            isRevealed={isRevealed}
            hide={hide}
          />
        )}
      </li>
    );
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  } else if (type === NavItemType.DROPDOWN) {
    const { title } = item as DropdownNavLink;
    // Mobile view
    if (isMediumDown) {
      return (
        <>
          <li>
            <GlobalMenuItem>{title} </GlobalMenuItem>
          </li>
          {item.children.map((child) => {
            return (
              <LinkDropMenuNavItem
                key={`${title}-dropdown-menu`}
                child={child}
                onClick={onClick}
                linkProperties={linkProperties}
              />
            );
          })}
        </>
      );
    } else {
      return (
        <li>
          <DropdownScrollable
            alignment={alignment ?? 'left'}
            triggerElement={(props) => (
              <GlobalMenuButton
                {...props}
                // @ts-expect-error achromic text exists
                variation='achromic-text'
                fitting='skinny'
              >
                {title} <CollecticonChevronDownSmall size='small' />
              </GlobalMenuButton>
            )}
          >
            <DropMenu>
              {(item as DropdownNavLink).children.map((child) => {
                return (
                  <LinkDropMenuNavItem
                    key={`${title}-dropdown-menu`}
                    child={child}
                    linkProperties={linkProperties}
                  />
                );
              })}
            </DropMenu>
          </DropdownScrollable>
        </li>
      );
    }
  } else {
    LOG &&
      /* eslint-disable-next-line no-console */
      console.error(
        `Invalid type for Nav Items, type "${type}" is not of `,
        NavItemType
      );
    return null;
  }
}
