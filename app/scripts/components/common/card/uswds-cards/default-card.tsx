import React from 'react';
import { FacadeCardProps, CardElement } from './types';
import BaseCard from './base-card';

export default function DefaultCard(props: FacadeCardProps) {
  const {
    heading,
    gridLayout,
    imgSrc,
    imgAlt,
    description,
    footer,
    cardLabel
  } = props;
  const defaultGridLayout = gridLayout ? gridLayout : { desktop: { col: 3 } };

  if (!(heading || description || imgSrc || imgAlt)) <></>;

  const cardHeader: CardElement = {
    element: <h2 className='usa-card__heading card-header'>{heading}</h2>
  };

  const cardMedia: CardElement = {
    element: <img src={imgSrc} alt={imgAlt} />
  };

  const cardBody: CardElement = {
    element: <p className='font-body-xs'>{description}</p>
  };

  const cardFooter: CardElement = {
    element: footer
  };

  const cardProps = {
    gridLayout: defaultGridLayout,
    media: cardMedia,
    header: cardHeader,
    body: cardBody,
    footer: cardFooter,
    cardLabel: cardLabel
  };

  return <BaseCard {...cardProps} />;
}
