export type AlignmentEnum = 'left' | 'right';

export enum NavItemType {
  INTERNAL_LINK= 'internalLink',
  EXTERNAL_LINK= 'externalLink',
  DROPDOWN= 'dropdown',
  BUTTON= 'button' // @NOTE: Change this to a button type and button should provide callback on action => aka whether it should open a modal or not or do another action
}

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

export type NavLinkItem = (ExternalNavLink | InternalNavLink);

export interface ButtonNavLink {
  title: string;
  type: NavItemType.BUTTON;
  src: string;
}

export interface DropdownNavLink {
  title: string;
  type: NavItemType.DROPDOWN;
  children: NavLinkItem[];
}

export type NavItem = (NavLinkItem | ButtonNavLink | DropdownNavLink);