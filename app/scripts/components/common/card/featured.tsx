import React from 'react';
import format from 'date-fns/format';
import styled from 'styled-components';
import { media, themeVal } from '@devseed-ui/theme-provider';
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
import { variableBaseType, variableGlsp } from '$styles/variable-utils';

export const FeaturedCardItem = styled(CardItem)`
  padding-top: ${variableGlsp()};
  color: ${themeVal('color.surface')};
  justify-content: flex-end;
  min-height: 16rem;

  ${media.mediumUp`
          min-height: 28rem;
        `}

  ${CardFigure} {
    position: absolute;
    inset: 0;
    z-index: -1;
    background: ${themeVal('color.base-400')};
  }

  ${CardTitle} {
    font-size: ${variableBaseType('1.5rem')};
    max-width: 52rem;
  }

  ${CardOverline} {
    color: ${themeVal('color.surface-400a')};
  }

  ${CardBody} {
    font-size: ${variableBaseType('1rem')};
    max-width: 52rem;
  }
`;

export default function FeaturedCard(props: CardComponentProps) {
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
      <CardFigure src={imgSrc} isCoverOrFeatured={true}>
        <img src={imgSrc} alt={imgAlt} loading='lazy' />
      </CardFigure>
    </>
  );

  return CardContent;
}
