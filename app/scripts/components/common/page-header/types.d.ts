export type AlignmentEnum = 'left' | 'right';

export enum NavItemType {
  INTERNAL_LINK= 'internalLink',
  EXTERNAL_LINK= 'externalLink',
  DROPDOWN= 'dropdown',
  MODAL= 'modal'
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

export interface ModalNavLink {
  title: string;
  type: NavItemType.MODAL;
  src: string;
}

export interface DropdownNavLink {
  title: string;
  type: NavItemType.DROPDOWN;
  children: NavLinkItem[];
}

export type NavItem = (NavLinkItem | ModalNavLink | DropdownNavLink);