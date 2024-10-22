import React, { lazy, MouseEventHandler } from 'react';
import styled, { css } from 'styled-components';
import { format } from 'date-fns';
import { CollecticonExpandTopRight } from '@devseed-ui/collecticons';
import {
  glsp,
  media,
  multiply,
  themeVal,
  listReset,
} from '@devseed-ui/theme-provider';
const SmartLink = lazy(() => import('../smart-link'));

import { CardBody, CardBlank, CardHeader, CardHeadline, CardTitle, CardOverline } from './styles';
import HorizontalInfoCard, { HorizontalCardStyles } from './horizontal-info-card';
import { variableBaseType, variableGlsp } from '$styles/variable-utils';
import { ElementInteractive } from '$components/common/element-interactive';
import { Figure } from '$components/common/figure';
import { LinkProperties } from '$types/veda';

type CardType = 'classic' | 'cover' | 'featured' | 'horizontal-info';

interface CardItemProps {
  isStateFocus?: boolean;
  isStateOver?: boolean;
  isStateActive?: boolean;
  cardType?: CardType;
}

/**
  @NOTE: CardList & CardFooter have been moved over to /common/card/styles and has modified styles
  These styles are used in GHG instance, so we leave these for now. We should move these styles to GHG instances
  since these styles are not used by UI instance anymore.
*/
export const CardList = styled.ol`
  ${listReset()}
  grid-column: 1 / -1;
  display: grid;
  gap: ${variableGlsp()};
  grid-template-columns: repeat(1, 1fr);

  ${media.mediumUp`
    grid-template-columns: repeat(2, 1fr);
  `}

  ${media.largeUp`
    grid-template-columns: repeat(3, 1fr);
  `}

  > li {
    min-width: 0;
  }
`;

export const CardFooter = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: ${variableGlsp(0.5)};
  padding: ${variableGlsp()};

  &:not(:first-child) {
    padding-top: 0;
    margin-top: ${variableGlsp(-0.5)};
  }

  button {
    pointer-events: all;
  }
`;

function renderCardType({ cardType }: CardItemProps) {
  switch (cardType) {
    case 'cover':
      return css`
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
    case 'featured':
      return css`
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
    case 'horizontal-info':
      return HorizontalCardStyles;
    default:
      return css`
        background: transparent;
      `;
  }
}

export const CardItem = styled(CardBlank)<CardItemProps>`
  ${renderCardType}

  ${({ isStateFocus }) =>
    isStateFocus &&
    css`
      box-shadow: ${themeVal('boxShadow.elevationC')};
      transform: translate(0, 0.125rem);
    `}
  ${({ isStateOver }) =>
    isStateOver &&
    css`
      box-shadow: ${themeVal('boxShadow.elevationC')};
      transform: translate(0, 0.125rem);
    `}
  ${({ isStateActive }) =>
    isStateActive &&
    css`
      box-shadow: ${themeVal('boxShadow.elevationB')};
      transform: translate(0, 0.125rem);
    `}
`;

const CardLabel = styled.span`
  position: absolute;
  z-index: 1;
  top: ${variableGlsp()};
  right: ${variableGlsp()};
  display: inline-block;
  vertical-align: top;
  color: ${themeVal('color.surface')};
  border-radius: ${themeVal('shape.ellipsoid')};
  padding: ${glsp(0.125, 0.5)};
  background: ${themeVal('color.base-400a')};
  pointer-events: auto;
  transition: all 0.24s ease 0s;

  &,
  &:visited {
    text-decoration: none;
  }

  &:hover {
    opacity: 0.64;
  }
`;


const CardFigure = styled(Figure)`
  order: -1;

  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    mix-blend-mode: multiply;
  }
`;

const ExternalLinkMark = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: ${variableGlsp(0.25)};
  right: ${variableGlsp(0.25)};
  padding: ${variableGlsp(0.125)} ${variableGlsp(0.25)};
  background-color: ${themeVal('color.primary')};
  color: ${themeVal('color.surface')};
  text-transform: none;
  border-radius: calc(
    ${multiply(themeVal('shape.rounded'), 2)} - ${variableGlsp(0.125)}
  );
  z-index: 1;
`;

const FlagText = styled.div`
  display: inline;
  font-weight: bold;
  font-size: 0.825rem;
  margin-right: ${variableGlsp(0.25)};
`;

export function ExternalLinkFlag() {
  return (
    <ExternalLinkMark>
      <FlagText>External Link</FlagText>
      <CollecticonExpandTopRight size='small' meaningful={false} />
    </ExternalLinkMark>
  );
}

export interface LinkWithPathProperties extends LinkProperties {
  linkTo: string;
  isLinkExternal?: boolean;
}

export interface CardComponentBaseProps {
  title: JSX.Element | string;
  linkLabel?: string;
  className?: string;
  cardType?: CardType;
  description?: JSX.Element | string;
  date?: Date;
  overline?: JSX.Element;
  imgSrc?: string;
  imgAlt?: string;
  parentTo?: string;
  tagLabels?: string[];
  footerContent?: JSX.Element;
  onCardClickCapture?: MouseEventHandler;
}

// @TODO: Consolidate these props when the instance adapts the new syntax
// Specifically: https://github.com/US-GHG-Center/veda-config-ghg/blob/develop/custom-pages/news-and-events/component.tsx#L108
export interface CardComponentPropsDeprecated extends CardComponentBaseProps {
  linkTo: string;
  onLinkClick?: MouseEventHandler;
  isLinkExternal?: boolean;
}
export interface CardComponentProps extends CardComponentBaseProps {
  linkProperties: LinkWithPathProperties;
}

type CardComponentPropsType = CardComponentProps | CardComponentPropsDeprecated;

// Type guard to check if props has linkProperties
function hasLinkProperties(props: CardComponentPropsType): props is CardComponentProps {
  return !!((props as CardComponentProps).linkProperties);
}

function CardComponent(props: CardComponentPropsType) {
  const {
    className,
    title,
    cardType,
    description,
    linkLabel,
    date,
    overline,
    imgSrc,
    imgAlt,
    tagLabels,
    parentTo,
    footerContent,
    onCardClickCapture
  } = props;
// @TODO: This process is not necessary once all the instances adapt the linkProperties syntax
// Consolidate them to use LinkProperties only
  let linkProperties: LinkWithPathProperties;

  if (hasLinkProperties(props)) {
    // Handle new props with linkProperties
    const { linkProperties: linkPropertiesProps } = props;
    linkProperties = linkPropertiesProps;
  } else {
    const { linkTo, onLinkClick, isLinkExternal } = props;
    linkProperties = {
      linkTo,
      onLinkClick,
      pathAttributeKeyName: 'to',
      LinkElement: SmartLink,
      isLinkExternal
    };
  }

  const isExternalLink = linkProperties.isLinkExternal ?? /^https?:\/\//.test(linkProperties.linkTo);

  return (
    <ElementInteractive
      linkProps={{
        as: linkProperties.LinkElement,
        [linkProperties.pathAttributeKeyName]: linkProperties.linkTo,
        onLinkClick: linkProperties.onLinkClick,
        isLinkExternal: isExternalLink
      }}
      as={CardItem}
      cardType={cardType}
      className={className}
      linkLabel={linkLabel ?? 'View more'}
      onClickCapture={onCardClickCapture}
    >
      {
        cardType !== 'horizontal-info' && (
          <>
            <CardHeader>
              <CardHeadline>
                <CardTitle>{title}</CardTitle>
                <CardOverline as='div'>
                  {isExternalLink && <ExternalLinkFlag />}
                  {!isExternalLink && tagLabels && parentTo && (
                    tagLabels.map((label) => (
                      <CardLabel as={linkProperties.LinkElement} to={parentTo} key={label}>
                        {label}
                      </CardLabel>
                    ))
                  )}
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
            {imgSrc && (
              <CardFigure>
                <img src={imgSrc} alt={imgAlt} loading='lazy' />
              </CardFigure>
            )}
          </>
        )
      }
      {
        cardType === 'horizontal-info' && (
          <HorizontalInfoCard
            title={title}
            description={description}
            imgSrc={imgSrc}
            imgAlt={imgAlt}
            tagLabels={tagLabels}
          />
        )
      }
    </ElementInteractive>
  );
}

export const Card = styled(CardComponent)`
  /* Convert to styled-component: https://styled-components.com/docs/advanced#caveat */
`;
