import React from 'react';
import format from 'date-fns/format';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';
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
import { variableGlsp } from '$styles/variable-utils';

// @DEPRECATED: This component is deprecated and will be removed in the future.

export const CoverCardItem = styled(CardItem)`
  padding-top: ${variableGlsp(2)};
  background: ${themeVal('color.base-400')};
  color: ${themeVal('color.surface')};
  justify-content: flex-end;

  ${CardFigure} {
    position: absolute;
    inset: 0;
    z-index: -1;
    background: ${themeVal('color.base-400')};
  }

  ${CardOverline} {
    color: ${themeVal('color.surface-400a')};
  }
`;

export default function CoverCard(props: CardComponentProps) {
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
