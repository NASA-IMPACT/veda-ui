export type LabelType = 'data_collection' | 'story' | 'topic' | 'widget';

export interface CardElement {
  element: JSX.Element;
  className?: string;
}

interface CommonCardProps {
  id?: string;
  layout?: string;
  className?: string;
  gridLayout?: unknown;
  cardLabel?: LabelType;
}

export interface FacadeCardProps extends CommonCardProps {
  imgSrc: string;
  imgAlt: string;
  heading?: string;
  description?: string;
  footer: JSX.Element;
}

export interface BaseCardProps extends CommonCardProps {
  style?: any;
  header?: CardElement;
  media?: CardElement;
  body?: CardElement;
  footer: CardElement;
  isCardFocusable?: boolean;
}
