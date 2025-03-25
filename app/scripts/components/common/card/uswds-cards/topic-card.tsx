import React from 'react';
import { LabelDisplay, LabelIcon } from './utils';
import {
  USWDSCardComponent,
  USWDSCardBody,
  USWDSCardFooter,
  USWDSCardMedia,
  USWDSIcon,
  USWDSTag
} from '$uswds';

export type TopicCardProps = {
  id?: string;
  className?: string;
  gridLayout?: unknown;
  mediaUrl?: string;
  mediaAlt?: string;
  fullBg?: boolean;
  description?: string | React.ReactElement;
  actionLabel?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
};

export default function TopicCard(props: TopicCardProps) {
  const {
    id,
    className = '',
    gridLayout,
    mediaUrl,
    mediaAlt = '',
    fullBg = true,
    description,
    actionLabel = 'Explore Topic',
    onClick
  } = props;

  const cardClasses = [
    'cursor-pointer',
    'position-relative',
    'topic-card',
    'radius-md',
    'overflow-hidden',
    fullBg ? 'topic-card--fullbg' : 'topic-card--bordered',
    fullBg ? '' : 'border border-base-lighter border-width-1px',
    className
  ]
    .filter(Boolean)
    .join(' ');

  const cardStyle =
    fullBg && mediaUrl ? { backgroundImage: `url(${mediaUrl})` } : undefined;

  const callToAction = fullBg ? (
    <h2
      className='font-heading-xl font-body font-weight-bold line-height-1 text-white padding-y-2 padding-x-05 width-full maxw-mobile-lg no-underline display-flex flex-align-center flex-justify-between border-0'
      style={{
        textDecoration: 'none'
      }}
    >
      {actionLabel}
      <span className='display-flex flex-align-center flex-justify-center radius-pill bg-primary width-4 height-4 padding-05 margin-left-2'>
        <USWDSIcon.ArrowForward />
      </span>
    </h2>
  ) : (
    <h4
      className='font-body-sm bg-primary-darkest font-body font-weight-bold font-size-sm line-height-1 padding-x-05 width-full maxw-mobile-lg no-underline display-flex flex-align-center flex-justify-between border-0'
      style={{
        textDecoration: 'none'
      }}
    >
      {actionLabel}
      <span className='display-flex flex-align-center flex-justify-center radius-pill text-white bg-primary width-3 height-3 padding-05 margin-left-1'>
        <USWDSIcon.ArrowForward />
      </span>
    </h4>
  );

  return (
    <USWDSCardComponent
      id={id}
      layout={fullBg ? 'default' : 'mediaTop'}
      gridLayout={gridLayout}
      className={cardClasses}
      style={cardStyle}
      tabindex='0'
      onClick={onClick}
    >
      {!fullBg && mediaUrl && (
        <USWDSCardMedia className='height-card-md width-full overflow-hidden'>
          <img
            src={mediaUrl}
            alt={mediaAlt}
            className='width-full height-full object-fit-cover'
          />
        </USWDSCardMedia>
      )}

      <USWDSTag className='position-absolute top-2 left-2 bg-white line-height-sans-2 padding-x-05'>
        {LabelIcon['topic']}

        <span className='text-no-uppercase font-ui-3xs font-normal font-sans-3xs text-center text-base-dark margin-left-05 line-height-sans-2'>
          {LabelDisplay['topic']}
        </span>
      </USWDSTag>

      {!fullBg && (
        <USWDSCardBody className='topic-card__body padding-x-2 padding-y-2'>
          <h3 className='font-body-lg margin-y-0'>{description}</h3>
        </USWDSCardBody>
      )}

      <USWDSCardFooter className='padding-x-2 padding-bottom-2 padding-top-0 margin-top-auto'>
        {callToAction}
      </USWDSCardFooter>
    </USWDSCardComponent>
  );
}
