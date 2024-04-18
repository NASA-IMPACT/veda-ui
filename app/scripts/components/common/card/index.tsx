import React, { MouseEventHandler } from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { CollecticonExpandTopRight } from '@devseed-ui/collecticons';

import {
  glsp,
  media,
  multiply,
  themeVal,
} from '@devseed-ui/theme-provider';
import { CardBody, CardBlank, CardFooter, CardHeader, CardHeadline, CardTitle, CardOverline } from './styles';
import { variableBaseType, variableGlsp } from '$styles/variable-utils';

import { ElementInteractive } from '$components/common/element-interactive';
import { Figure } from '$components/common/figure';
import { getLinkProps } from '$utils/url';

type CardType = 'classic' | 'cover' | 'featured' | 'horizontal-info';

interface CardItemProps {
  isStateFocus?: boolean;
  isStateOver?: boolean;
  isStateActive?: boolean;
  cardType?: CardType;
}

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
      return css`
        height: 10rem;
        color: ${themeVal('color.base-800')};

        ${CardTitle} {
          font-size: ${variableBaseType('0.7rem')};
        }
        
        #body {
          font-size: ${variableBaseType('0.6rem')};
          height: 4rem;
          padding: 1rem 0;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box; /* @TODO-SANDRA: Fix this, this is causing an issue */
          -webkit-line-clamp: 2; /* number of lines to show */
                  line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        #tags {
          display: flex;
          gap: ${glsp(0.5)};
        }

        ${CardLabel} {
          position: static;
          width: fit-content;
        }

      `;
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

const HorizontalCard = styled.div`
  display: flex;
  height: inherit;
`;

const CardImage = styled.div`
  min-width: 10rem;
  width: 10rem;
  height: 100%;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem;
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

interface CardComponentProps {
  title: JSX.Element | string;
  linkLabel: string;
  linkTo: string;
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
  onLinkClick?: MouseEventHandler;
}

function CardComponent(props: CardComponentProps) {
  const {
    className,
    title,
    cardType,
    description,
    linkLabel,
    linkTo,
    date,
    overline,
    imgSrc,
    imgAlt,
    tagLabels,
    parentTo,
    footerContent,
    onCardClickCapture,
    onLinkClick
  } = props;

  const isExternalLink = /^https?:\/\//.test(linkTo);
  const linkProps = getLinkProps(linkTo, Link, onLinkClick);


  return (
    <ElementInteractive
      as={CardItem}
      cardType={cardType}
      className={className}
      linkLabel={linkLabel || 'View more'}
      linkProps={linkProps}
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
                      <CardLabel as={Link} to={parentTo} key={label}>
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
          <HorizontalCard>
            <CardImage>
              <img src={imgSrc} alt={imgAlt} loading='lazy' />
            </CardImage>
            <CardContent>
              <CardTitle>{title}</CardTitle>
              <div id='body'>
                <p>{description}</p>
              </div>
              <div id='tags'>
                {
                  tagLabels && (
                    tagLabels.map((label) => (
                      <CardLabel key={label}>
                        {label}
                      </CardLabel>
                    ))
                  )
                }
              </div>
            </CardContent>
          </HorizontalCard>
        )
      }
    </ElementInteractive>
  );
}

export const Card = styled(CardComponent)`
  /* Convert to styled-component: https://styled-components.com/docs/advanced#caveat */
`;
