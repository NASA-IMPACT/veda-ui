import React from 'react';
import { BaseCardProps } from './types';
import { createCardLabel } from './utils';
import {
  USWDSCardComponent,
  USWDSCardBody,
  USWDSCardFooter,
  USWDSCardHeader,
  USWDSCardMedia
} from '$uswds';
import './styles.scss';

export default function BaseCard({
  id,
  layout,
  media,
  header,
  footer,
  gridLayout,
  cardLabel,
  style,
  body,
  className,
  isCardFocusable
}: BaseCardProps) {
  return (
    <USWDSCardComponent
      id={id}
      layout={layout}
      gridLayout={gridLayout}
      style={style}
      className={className}
      tabIndex={isCardFocusable ? 0 : undefined}
    >
      {header && (
        <USWDSCardHeader className={header.className}>
          {header.element}
        </USWDSCardHeader>
      )}

      {media && (
        <USWDSCardMedia className={media.className}>
          {media.element}
        </USWDSCardMedia>
      )}

      {cardLabel && (
        <div className='position-absolute padding-2'>
          {createCardLabel(cardLabel)}
        </div>
      )}

      {body && (
        <USWDSCardBody className={body.className}>{body.element}</USWDSCardBody>
      )}
      <USWDSCardFooter className={footer.className}>
        {footer.element}
      </USWDSCardFooter>
    </USWDSCardComponent>
  );
}
