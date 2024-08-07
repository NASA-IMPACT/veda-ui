export type AlignmentEnum = 'left' | 'right';

export enum NAVITEM_TYPE {
  internalLink= 'internalLink',
  externalLink= 'externalLink',
  dropdown= 'dropdown',
  modal= 'modal'
}

export interface InternalNavLink {
  title: string;
  to: string;
  type: NAVITEM_TYPE.internalLink;
}
export interface ExternalNavLink {
  title: string;
  href: string;
  type: NAVITEM_TYPE.externalLink;
}
export type NavLinkItem = (ExternalNavLink | InternalNavLink);
export interface ModalNavLink {
  title: string;
  type: NAVITEM_TYPE.modal;
  src: string;
}

export interface DropdownNavLink { 
  title: string;
  type: NAVITEM_TYPE.dropdown;
  children: NavLinkItem[];
}

export type NavItem = (NavLinkItem | ModalNavLink | DropdownNavLink);