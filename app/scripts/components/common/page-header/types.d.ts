import { MODAL_TYPE, INTERNAL_LINK_TYPE, EXTERNAL_LINK_TYPE, DROPDOWN_TYPE } from './';

export type AlignmentEnum = 'left' | 'right';

export interface InternalNavLink {
  title: string;
  to: string;
  type: typeof INTERNAL_LINK_TYPE;
}
export interface ExternalNavLink {
  title: string;
  href: string;
  type: typeof EXTERNAL_LINK_TYPE;
}
export type NavLinkItem = (ExternalNavLink | InternalNavLink);
export interface ModalNavLink {
  title: string;
  type: typeof MODAL_TYPE;
  src: string;
}

export interface DropdownNavLink { 
  title: string;
  type: typeof DROPDOWN_TYPE;
  children: NavLinkItem[];
}

export type NavItem = (NavLinkItem | ModalNavLink | DropdownNavLink);