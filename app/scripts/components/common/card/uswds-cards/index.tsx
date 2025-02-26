import React from 'react';
import { CardProps } from './types';
import {
  USWDSCardComponent,
  USWDSCardBody,
  USWDSCardFooter,
  USWDSCardHeader,
  USWDSCardMedia
} from '$uswds';
import './styles.scss';

// @TODO: Implement overrideable Card Acessibility States

function isString(value: string | JSX.Element): boolean {
  return typeof value === 'string';
}

export default function BaseCard({
  layout,
  imgSrc,
  imgAlt,
  heading,
  description,
  styleOverrides,
  footer,
  gridLayout
}: CardProps) {
  const headerClassNames =
    styleOverrides?.headerClassNames || 'usa-card__heading card-header';
  const bodyClassNames = styleOverrides?.bodyClassNames || 'font-body-xs';

  return (
    <USWDSCardComponent layout={layout} gridLayout={gridLayout}>
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
