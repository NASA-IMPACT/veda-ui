import React from 'react';
import { BaseCardProps } from './types';
import { createCardLabel } from './utils';
import {
  USWDSCardComponent,
  USWDSCardBody,
  USWDSCardFooter,
  USWDSCardHeader,
  USWDSCardMedia
  // USWDSTag
} from '$uswds';
import './styles.scss';

// @TODO: Implement overrideable Card Acessibility States

// function isString(value: string | JSX.Element): boolean {
//   return typeof value === 'string';
// }

export default function BaseCard({
  id,
  layout,
  // imgSrc,
  // imgAlt,
  media,
  heading,
  // description,
  footer,
  gridLayout,
  cardLabel,
  style,
  body,
  className
}: BaseCardProps) {
  const defaultHeaderClassNames = 'usa-card__heading card-header';
  const defaultBodyClassNames = 'font-body-xs';

  return (
    <USWDSCardComponent
      id={id}
      layout={layout}
      gridLayout={gridLayout}
      style={style}
      className={className}
    >
      {/* {heading && (
        <USWDSCardHeader>
          {isString(heading) ? (
            <h2 className={defaultHeaderClassNames}>{heading}</h2>
          ) : (
            heading
          )}
        </USWDSCardHeader>
      )} */}

      {heading && (
        <USWDSCardHeader className={heading.className}>
          {heading.element}
        </USWDSCardHeader>
      )}

      {/* <USWDSCardMedia>
        {cardLabel && (
          <div style={{ position: 'absolute', padding: '15px' }}>
            {createCardLabel(cardLabel)}
          </div>
        )}
        <img src={imgSrc} alt={imgAlt} />
      </USWDSCardMedia> */}
      {media && (
        <USWDSCardMedia className={media.className}>
          {media.element}
        </USWDSCardMedia>
      )}

      {cardLabel && (
        <div style={{ position: 'absolute', padding: '15px' }}>
          {createCardLabel(cardLabel)}
        </div>
      )}

      {body && (
        <USWDSCardBody className={body.className}>{body.element}</USWDSCardBody>
      )}

      {/* <USWDSCardBody>
        {isString(description) ? (
          <p className={defaultBodyClassNames}>{description}</p>
        ) : (
          description
        )}
      </USWDSCardBody> */}
      <USWDSCardFooter className={footer.className}>
        {footer.element}
      </USWDSCardFooter>
    </USWDSCardComponent>
  );
}
