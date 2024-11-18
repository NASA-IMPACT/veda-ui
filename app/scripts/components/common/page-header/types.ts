export type AlignmentEnum = 'left' | 'right';

export enum NavItemType {
  INTERNAL_LINK = 'internalLink',
  EXTERNAL_LINK = 'externalLink',
  DROPDOWN = 'dropdown',
  ACTION = 'action', // styled as the link but performs some type of action instead of re-routing
  BUTTON = 'button' // @NOTE: Change this to a button type and button should provide callback on action => aka whether it should open a modal or not or do another action
}

export type ActionId = 'open-google-form' | undefined; // @NOTE: ActionIds are nav items that perform some type of action but without it being a button

export interface InternalNavLink {
  title: string;
  to: string;
  type: NavItemType.INTERNAL_LINK;
}

export interface ExternalNavLink {
  title: string;
  href: string;
  type: NavItemType.EXTERNAL_LINK;
}

export type NavLinkItem = ExternalNavLink | InternalNavLink;

export interface ActionNavItem {
  title: string;
  actionId: ActionId;
  src?: string;
  type: NavItemType.ACTION;
}

export interface DropdownNavLink {
  title: string;
  type: NavItemType.DROPDOWN;
  children: NavLinkItem[];
}

export type NavItem = NavLinkItem | DropdownNavLink | ActionNavItem;
