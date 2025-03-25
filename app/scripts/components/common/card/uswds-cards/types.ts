export type LabelType = 'data_collection' | 'story' | 'topic' | 'widget';

interface CardElement {
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
  // id?: string;
  imgSrc: string;
  imgAlt: string;
  heading?: string;
  description?: string;
  // cardLabel?: LabelType;
  footerTitle?: string;
}

export interface BaseCardProps extends CommonCardProps {
  // id?: string;
  // layout?: string;
  // heading?: string | JSX.Element;
  // footer: JSX.Element;
  // imgSrc: string;
  // imgAlt: string;
  // description: string | JSX.Element;
  // gridLayout?: unknown;
  // cardLabel?: LabelType;
  className?: string;
  style?: any;
  heading?: CardElement;
  media?: CardElement;
  body?: CardElement;
  footer: CardElement;
}
