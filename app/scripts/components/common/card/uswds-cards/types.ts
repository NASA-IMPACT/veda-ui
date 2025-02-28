export interface CardProps {
  layout?: string;
  heading: string | JSX.Element;
  footer: JSX.Element;
  imgSrc: string;
  imgAlt: string;
  description: string | JSX.Element;
  gridLayout?: any;
}
