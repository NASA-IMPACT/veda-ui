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
interface InternalNavLink {
  id: string;
  title: string;
  to: string;
  type: 'internalLink';
}
interface ExternalNavLink {
  id: string;
  title: string;
  href: string;
  type: 'externalLink';
}
type NavLinkItem = ExternalNavLink | InternalNavLink;

export interface DropdownNavLink {
  id: string;
  title: string;
  type: 'dropdown';
  children: NavLinkItem[];
}
