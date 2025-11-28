import { LinkContentData, Media, RelatedContentData } from '$types/veda';

export interface FormatBlock {
  id: string;
  name: string;
  description: string;
  cardDescription?: string;
  date: string;
  link: string;
  asLink?: LinkContentData;
  parentLink: string;
  media: Media;
  cardMedia?: Media;
  parent: RelatedContentData['type'];
}
export interface InternalNavLink {
  id: string;
  title: string;
  to: string;
  customClassNames?: string;
  type: 'internalLink';
}
export interface ExternalNavLink {
  id: string;
  title: string;
  href: string;
  customClassNames?: string;
  type: 'externalLink';
}
export type NavLinkItem = ExternalNavLink | InternalNavLink;

export interface DropdownNavLink {
  id: string;
  title: string;
  type: 'dropdown';
  children: NavLinkItem[];
}
