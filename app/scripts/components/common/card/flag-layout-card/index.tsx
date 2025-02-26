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
  footer: JSX.Element;
  imgSrc: string;
  imgAlt: string;
  description: string | JSX.Element;
  styleOverrides?: CardStyleOverrides;
}

function isString(value: string | JSX.Element): boolean {
  return typeof value === 'string';
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
  const headerClassNames =
    styleOverrides?.headerClassNames || 'usa-card__heading card-header';
  const bodyClassNames = styleOverrides?.bodyClassNames || 'font-body-xs';

  return (
    <USWDSCardComponent layout={layout} className='card-general'>
      <USWDSCardHeader>
        {isString(heading) ? (
          <h2 className={headerClassNames}>{heading}</h2>
        ) : (
          heading
        )}
      </USWDSCardHeader>
      <USWDSCardMedia>
        <img src={imgSrc} alt={imgAlt} />
      </USWDSCardMedia>
      <USWDSCardBody>
        {isString(description) ? (
          <p className={bodyClassNames}>{description}</p>
        ) : (
          description
        )}
      </USWDSCardBody>
      <USWDSCardFooter>{footer}</USWDSCardFooter>
    </USWDSCardComponent>
  );
}
