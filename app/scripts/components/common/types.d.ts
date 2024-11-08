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
