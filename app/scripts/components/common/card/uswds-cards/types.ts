export type LabelType = 'data_collection' | 'story' | 'topic' | 'widget';

export interface CardProps {
  layout?: string;
  heading: string | JSX.Element;
  footer: JSX.Element;
  imgSrc: string;
  imgAlt: string;
  description: string | JSX.Element;
  gridLayout?: any;
  cardLabel?: LabelType;
  className?: string;
}
