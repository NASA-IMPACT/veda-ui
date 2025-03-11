import React from 'react';
import { CardProps } from './types';
import { createCardLabel } from './utils';
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
  footer,
  gridLayout,
  cardLabel
}: CardProps) {
  const defaultHeaderClassNames = 'usa-card__heading card-header';
  const defaultBodyClassNames = 'font-body-xs';

  return (
    <USWDSCardComponent layout={layout} gridLayout={gridLayout}>
      <USWDSCardHeader>
        {isString(heading) ? (
          <h2 className={defaultHeaderClassNames}>{heading}</h2>
        ) : (
          heading
        )}
      </USWDSCardHeader>
      <USWDSCardMedia>
        {cardLabel && (
          <div style={{ position: 'absolute', padding: '15px' }}>
            {createCardLabel(cardLabel)}
          </div>
        )}
        <img src={imgSrc} alt={imgAlt} />
      </USWDSCardMedia>
      <USWDSCardBody>
        {isString(description) ? (
          <p className={defaultBodyClassNames}>{description}</p>
        ) : (
          description
        )}
      </USWDSCardBody>
      <USWDSCardFooter>{footer}</USWDSCardFooter>
    </USWDSCardComponent>
  );
}
