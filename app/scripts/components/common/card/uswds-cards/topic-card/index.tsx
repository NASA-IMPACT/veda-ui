import React from 'react';
import { FacadeCardProps } from '../types';
import BaseCard from '..';
import { USWDSIcon } from '$uswds';

// export type TopicCardProps = {
//   id?: string;
//   className?: string;
//   gridLayout?: unknown;
//   mediaUrl?: string;
//   mediaAlt?: string;
//   fullBg?: boolean;
//   description?: string | React.ReactElement;
//   footerTitle?: string;
//   onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
// };

export interface TopicCardProps extends FacadeCardProps {
  fullBg?: boolean;
  // footerTitle?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export default function TopicCard(props: TopicCardProps) {
  const {
    id,
    className = '',
    gridLayout,
    // mediaUrl,
    // mediaAlt = '',
    cardLabel,
    imgSrc,
    imgAlt = '',
    fullBg = true,
    description,
    // footerTitle = 'Explore Topic',
    footerTitle = 'Explore Topic',
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
    fullBg && imgSrc ? { backgroundImage: `url(${imgSrc})` } : undefined;

  const callToAction = fullBg ? (
    <h2
      className='font-heading-xl font-body font-weight-bold line-height-1 text-white padding-y-2 padding-x-05 width-full maxw-mobile-lg no-underline display-flex flex-align-center flex-justify-between border-0'
      style={{
        textDecoration: 'none'
      }}
    >
      {footerTitle}
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
      {footerTitle}
      <span className='display-flex flex-align-center flex-justify-center radius-pill text-white bg-primary width-3 height-3 padding-05 margin-left-1'>
        <USWDSIcon.ArrowForward />
      </span>
    </h4>
  );

  const cardMedia = {
    element: (
      <img
        src={imgSrc}
        alt={imgAlt}
        className='width-full height-full object-fit-cover'
      />
    ),
    className: 'height-card-md width-full overflow-hidden'
  };

  const cardBody = {
    element: <h3 className='font-body-lg margin-y-0'>{description}</h3>,
    className: 'topic-card__body padding-x-2 padding-y-2'
  };

  const cardFooter = {
    element: callToAction,
    className: 'padding-x-2 padding-bottom-2 padding-top-0 margin-top-auto'
  };

  const cardProps = {
    id: id,
    layout: fullBg ? 'default' : 'mediaTop',
    gridLayout: gridLayout,
    className: cardClasses,
    cardLabel: cardLabel,
    style: cardStyle,
    ...(!fullBg && imgSrc && { media: cardMedia }),
    ...(!fullBg && { body: cardBody }),
    footer: cardFooter
  };

  return <BaseCard {...cardProps} />;
}
