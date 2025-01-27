import React, { MouseEventHandler } from 'react';
import styled from 'styled-components';
import ClassicCard, { ClassicCardItem } from './classic';
import CoverCard, { CoverCardItem } from './cover';
import FeaturedCard, { FeaturedCardItem } from './featured';
import HorizontalInfoCard, {
  HorizontalInfoCardItem
} from './horizontal-info-card';
import { LinkProperties } from '$types/veda';
import * as utils from '$utils/utils';
import { ElementInteractive } from '$components/common/element-interactive';
import { useVedaUI } from '$context/veda-ui-provider';

export enum CardType {
  CLASSIC = 'classic',
  COVER = 'cover',
  FEATURED = 'featured',
  HORIZONTALINFO = 'horizontal-info'
}

export interface CardItemProps {
  isStateFocus?: boolean;
  isStateOver?: boolean;
  isStateActive?: boolean;
  cardType?: CardType;
}

interface BaseCardComponentProps {
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
  hideExternalLinkBadge?: boolean;
  onCardClickCapture?: MouseEventHandler;
}

interface LinkCardComponentProps extends BaseCardComponentProps {
  to: string;
  onClick?: never;
  isExternalLink?: boolean;
}

interface ClickCardComponentProps extends BaseCardComponentProps {
  to?: never;
  onClick: MouseEventHandler;
}

export type CardComponentProps =
  | LinkCardComponentProps
  | ClickCardComponentProps
  | BaseCardComponentProps;

export interface DeprecatedCardComponentProps {
  linkProperties?: LinkProperties & { linkTo?: string };
  linkTo?: string;
}

export default function CardComponent(
  data: CardComponentProps & DeprecatedCardComponentProps
) {
  const { cardType, className, linkLabel, onCardClickCapture } = data;
  const { Link } = useVedaUI();

  // For backwards compatibility with deprecated props
  const to =
    ('to' in data && data.to) || data.linkTo || data.linkProperties?.linkTo;

  const isExternalLink = to ? utils.isExternalLink(to) : false;

  const cardData = {
    to: to,
    isExternalLink: isExternalLink,
    ...data
  };

  const defineBaseProps = () => {
    const baseProps = {
      className,
      linkLabel,
      onClickCapture: onCardClickCapture
    };

    if (cardType === CardType.CLASSIC) {
      baseProps['as'] = ClassicCardItem;
      baseProps['children'] = <ClassicCard {...cardData} />;
    } else if (cardType === CardType.COVER) {
      baseProps['as'] = CoverCardItem;
      baseProps['children'] = <CoverCard {...cardData} />;
    } else if (cardType === CardType.FEATURED) {
      baseProps['as'] = FeaturedCardItem;
      baseProps['children'] = <FeaturedCard {...cardData} />;
    } else if (cardType === CardType.HORIZONTALINFO) {
      baseProps['as'] = HorizontalInfoCardItem;
      baseProps['children'] = (
        <HorizontalInfoCard
          title={data.title}
          description={data.description}
          imgSrc={data.imgSrc}
          imgAlt={data.imgAlt}
          tagLabels={data.tagLabels}
        />
      );
    }
    return baseProps;
  };

  const baseProps = defineBaseProps();

  // Link variant
  if (to) {
    return (
      <ElementInteractive
        {...baseProps}
        linkProps={{
          as: Link,
          to
        }}
      />
    );
  }

  // Clickable variant
  if ('onClick' in data && data.onClick) {
    return <ElementInteractive {...baseProps} onClick={data.onClick} />;
  }

  // Non-interactive variant
  return <ElementInteractive {...baseProps} />;
}

export const Card = styled(CardComponent)`
  /* Convert to styled-component: https://styled-components.com/docs/advanced#caveat */
`;
