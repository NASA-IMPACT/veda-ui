import React from 'react';
import format from 'date-fns/format';
import styled from 'styled-components';
import {
  CardBody,
  CardHeader,
  CardHeadline,
  CardTitle,
  CardOverline,
  CardLabel,
  CardFooter,
  CardFigure,
  CardItem
} from './styles';
import { CardComponentProps, ExternalLinkFlag } from '.';
import { useVedaUI } from '$context/veda-ui-provider';

export const ClassicCardItem = styled(CardItem)`
  background: transparent;
`;

export default function ClassicCard(props: CardComponentProps) {
  const {
    title,
    description,
    date,
    overline,
    imgSrc,
    imgAlt,
    parentTo,
    tagLabels,
    footerContent,
    hideExternalLinkBadge
  } = props;

  let isExternalLink;

  if ('isExternalLink' in props) {
    ({ isExternalLink } = props);
  }

  const { Link } = useVedaUI();

  const CardContent = (
    <>
      <CardHeader>
        <CardHeadline>
          <CardTitle>{title}</CardTitle>
          <CardOverline as='div'>
            {hideExternalLinkBadge !== true && isExternalLink && (
              <ExternalLinkFlag />
            )}
            {!isExternalLink &&
              tagLabels &&
              parentTo &&
              tagLabels.map((label) => (
                <CardLabel as={Link} to={parentTo} key={label}>
                  {label}
                </CardLabel>
              ))}
            {date ? (
              <>
                published on{' '}
                <time dateTime={format(date, 'yyyy-MM-dd')}>
                  {format(date, 'MMM d, yyyy')}
                </time>
              </>
            ) : (
              overline
            )}
          </CardOverline>
        </CardHeadline>
      </CardHeader>
      {description && (
        <CardBody>
          <p>{description}</p>
        </CardBody>
      )}
      {footerContent && <CardFooter>{footerContent}</CardFooter>}
      <CardFigure src={imgSrc} isCoverOrFeatured={false}>
        <img src={imgSrc} alt={imgAlt} loading='lazy' />
      </CardFigure>
    </>
  );

  return CardContent;
}
