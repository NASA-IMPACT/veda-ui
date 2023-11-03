import React, { MouseEventHandler, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { VerticalDivider } from '@devseed-ui/toolbar';

import {
  glsp,
  listReset,
  media,
  multiply,
  themeVal,
  visuallyHidden
} from '@devseed-ui/theme-provider';
import { Overline } from '@devseed-ui/typography';

import { variableBaseType, variableGlsp } from '$styles/variable-utils';

import { ElementInteractive } from '$components/common/element-interactive';
import { VarHeading } from '$styles/variable-components';
import { Figure } from '$components/common/figure';

type CardType = 'classic' | 'cover' | 'featured';

interface CardSelfProps {
  isStateFocus?: boolean;
  isStateOver?: boolean;
  isStateActive?: boolean;
  cardType?: CardType;
}

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

function renderCardType({ cardType }: CardSelfProps) {
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
    default:
      return css`
        background: transparent;
      `;
  }
}

export const CardSelf = styled.article<CardSelfProps>`
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  border-radius: ${multiply(themeVal('shape.rounded'), 2)};
  box-shadow: ${themeVal('boxShadow.elevationD')};
  height: 100%;
  overflow: hidden;
  transition: all 0.24s ease-in-out 0s;

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

export const CardHeader = styled.header`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: flex-end;
  padding: ${variableGlsp()};
  gap: ${variableGlsp()};
`;

export const CardHeadline = styled.div`
  display: flex;
  flex-flow: column nowrap;
  gap: ${glsp(0.25)};
`;

export const CardActions = styled.div`
  /* styled-component */
`;

export const CardTitle = styled(VarHeading).attrs({
  as: 'h3',
  size: 'small'
})`
  /* styled-component */
`;

export const CardOverline = styled(Overline)`
  order: -1;
  color: ${themeVal('color.base-400a')};

  > * {
    line-height: inherit;
  }

  i {
    ${visuallyHidden()}
  }
`;

export const CardMeta = styled.div`
  display: flex;
  gap: ${glsp(0.25)};

  a {
    color: inherit;
    pointer-events: all;

    &,
    &:visited {
      text-decoration: none;
      color: inherit;
    }

    &:hover {
      opacity: 0.64;
    }
  }

  > ${/* sc-selector */VerticalDivider}:last-child {
    display: none;
  }

  > ${/* sc-selector */VerticalDivider}:first-child {
    display: none;
  }
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

export const CardBody = styled.div`
  padding: ${variableGlsp()};

  &:not(:first-child) {
    padding-top: 0;
    margin-top: ${variableGlsp(-0.5)};
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

export const CardTopicsList = styled.dl`
  display: flex;
  gap: ${variableGlsp(0.25)};
  max-width: 100%;
  width: 100%;
  overflow: hidden;
  mask-image: linear-gradient(
    to right,
    black calc(100% - 3rem),
    transparent 100%
  );

  > dt {
    ${visuallyHidden()}
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

interface CardComponentProps {
  title: ReactNode;
  linkLabel: string;
  linkTo: string;
  href?: string;
  className?: string;
  cardType?: CardType;
  description?: ReactNode;
  date?: Date;
  overline?: ReactNode;
  imgSrc?: string;
  imgAlt?: string;
  parentName?: string;
  parentTo?: string;
  footerContent?: ReactNode;
  onCardClickCapture?: MouseEventHandler;
}

function CardComponent(props: CardComponentProps) {
  const {
    className,
    title,
    cardType,
    description,
    linkLabel,
    linkTo,
    href,
    date,
    overline,
    imgSrc,
    imgAlt,
    parentName,
    parentTo,
    footerContent,
    onCardClickCapture
  } = props;

  const linkProps = href? { href } : {
    as: Link,
    to: linkTo
  };
  return (
    <ElementInteractive
      as={CardSelf}
      cardType={cardType}
      className={className}
      linkLabel={linkLabel || 'View more'}
      linkProps={linkProps}
      onClickCapture={onCardClickCapture}
    >
      <CardHeader>
        <CardHeadline>
          <CardTitle>{title}</CardTitle>
          <CardOverline as='div'>
            {parentName && parentTo && (
              <CardLabel as={Link} to={parentTo}>
                {parentName}
              </CardLabel>
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
    </ElementInteractive>
  );
}

export const Card = styled(CardComponent)`
  /* Convert to styled-component: https://styled-components.com/docs/advanced#caveat */
`;
