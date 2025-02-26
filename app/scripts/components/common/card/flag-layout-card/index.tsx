import React from 'react';
import {
  USWDSCardComponent,
  USWDSCardBody,
  USWDSCardFooter,
  USWDSCardHeader,
  USWDSCardMedia
} from '$uswds';
import './styles.scss';

interface CardStyleOverrides {
  headerClassNames?: string;
  bodyClassNames?: string;
}

interface FlayLayoutCardProps {
  layout?: 'flagDefault' | 'flagMediaRight';
  heading: string | JSX.Element;
  footer: string | JSX.Element;
  imgSrc: string;
  imgAlt: string;
  description: string | JSX.Element;
  styleOverrides?: CardStyleOverrides;
}

export default function FlagLayoutCard({
  layout = 'flagDefault',
  imgSrc,
  imgAlt,
  heading,
  description,
  styleOverrides,
  footer
}: FlayLayoutCardProps) {
  return (
    <USWDSCardComponent layout={layout} className='card-general'>
      <USWDSCardHeader>
        <h2
          className={
            styleOverrides?.headerClassNames || 'usa-card__heading card-header'
          }
        >
          {heading}
        </h2>
      </USWDSCardHeader>
      <USWDSCardMedia>
        <img src={imgSrc} alt={imgAlt} />
      </USWDSCardMedia>
      <USWDSCardBody>
        <p className={styleOverrides?.bodyClassNames || 'font-body-xs'}>
          {description}
        </p>
      </USWDSCardBody>
      <USWDSCardFooter>{footer}</USWDSCardFooter>
    </USWDSCardComponent>
  );
}
