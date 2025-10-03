import React, { MouseEventHandler } from 'react';
import { listReset, media } from '@devseed-ui/theme-provider';
import styled from 'styled-components';
import ClassicCard, { ClassicCardItem } from './classic';
import CoverCard, { CoverCardItem } from './cover';
import FeaturedCard, { FeaturedCardItem } from './featured';
import HorizontalInfoCard, { HorizontalInfoCardItem } from './horizontal-info';
import FlagCard from './uswds-cards/flag-card';
import { LabelType } from './uswds-cards/types';
import ExternalLinkFlagNew from '$components/common/external-link-flag';
import { LinkProperties } from '$types/veda';
import * as utils from '$utils/utils';
import { ElementInteractive } from '$components/common/element-interactive';
import { useVedaUI } from '$context/veda-ui-provider';
import { variableGlsp } from '$styles/variable-utils';
import './styles.scss';

/**
 * @LEGACY-SUPPORT
 *
 * @NOTE: This component is the controller where a cardType can be passed in.
 * This is to support how card is currently used in legacy code.
 * This controller file can be used moving forward but instances and veda-ui can also now just use the specific card type directly with the different types now broken out
 */

export enum CardType {
  CLASSIC = 'classic',
  COVER = 'cover',
  FEATURED = 'featured',
  HORIZONTALINFO = 'horizontal-info',
  FLAG = 'flag'
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
  cardLabel?: LabelType;
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

/**
  @NOTE: CardList & CardFooter have been moved over to /common/card/styles and has modified styles.
  These styles are directly imported in GHG instance & EIC instance, so we leave these here for now. We should move these styles to GHG instances
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

/**
 * CardComponent
 *
 * This component renders a card with various styles and content based on the provided props.
 * It can behave as a link if the `to` prop is provided, using the `Link` component from the Veda UI provider.
 * The `onClick` and `to` props are mutually exclusive.
 *
 * @param {string | JSX.Element} title - The title of the card.
 * @param {string} [linkLabel] - The label for the link.
 * @param {string} [className] - Additional class names for the card.
 * @param {CardType} [cardType] - The type of the card, which determines its style.
 * @param {string | JSX.Element} [description] - The description of the card.
 * @param {Date} [date] - The date associated with the card.
 * @param {JSX.Element} [overline] - The overline content for the card.
 * @param {string} [imgSrc] - The source URL for the card image.
 * @param {string} [imgAlt] - The alt text for the card image.
 * @param {string} [parentTo] - The URL for the parent link.
 * @param {string[]} [tagLabels] - The labels for the tags.
 * @param {JSX.Element} [footerContent] - The content for the card footer.
 * @param {boolean} [hideExternalLinkBadge] - Whether to hide the external link badge.
 * @param {MouseEventHandler} [onCardClickCapture] - The click capture handler for the card.
 * @param {MouseEventHandler} [onClick] - The click handler for the card. Mutually exclusive with `to`.
 * @param {string} [to] - The URL to link to. If provided, the card behaves as a link. Mutually exclusive with `onClick`.
 * @returns {JSX.Element} The rendered CardComponent.
 */

export default function CardComponent(
  data: CardComponentProps & DeprecatedCardComponentProps
) {
  const {
    cardType = CardType.CLASSIC,
    className,
    linkLabel,
    onCardClickCapture
  } = data;
  const { Link } = useVedaUI();

  // For backwards compatibility with deprecated props
  const to =
    ('to' in data && data.to) || data.linkTo || data.linkProperties?.linkTo;

  const isExternalLink = to ? utils.isExternalLink(to) : false;

  const cardData = {
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
    } else if (
      cardType === CardType.FLAG &&
      data.imgSrc &&
      data.imgAlt &&
      data.description &&
      data.footerContent &&
      data.title
    ) {
      baseProps['uswds'] = true;
      baseProps['children'] = (
        <FlagCard
          imgSrc={data.imgSrc}
          imgAlt={data.imgAlt}
          heading={data.title as string}
          description={data.description as string}
          footer={data.footerContent}
          cardLabel='data_collection'
        />
      );
    }

    return baseProps;
  };

  const baseProps = defineBaseProps();

  // Link variant
  if (to) {
    if (baseProps['uswds']) {
      return <CardLinkWrapper to={to}>{baseProps['children']}</CardLinkWrapper>;
    }
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

/**
 * @deprecated This re-export from card/ will be removed in v7.
 * Import `ExternalLinkFlag` from `@teamimpact/veda-ui` or from
 * `$components/common/external-link-flag` instead.
 *
 * @example
 * ```tsx
 * // New (preferred)
 * import { ExternalLinkFlag } from '@teamimpact/veda-ui';
 * // Or
 * import { ExternalLinkFlag } from '$components/common/external-link-flag';
 * ```
 */
let hasWarnedExternalLinkFlag = false;
export function ExternalLinkFlag() {
  if (process.env.NODE_ENV !== 'production' && !hasWarnedExternalLinkFlag) {
    // eslint-disable-next-line no-console
    console.warn(
      '[veda-ui] ExternalLinkFlag import from card/ is deprecated and will be removed in v7. Import from @teamimpact/veda-ui or $components/common/external-link-flag. Migrated to USWDS Icon.Launch; expect a slightly larger icon.'
    );
    hasWarnedExternalLinkFlag = true;
  }
  return <ExternalLinkFlagNew />;
}

function CardLinkWrapper({
  children,
  to
}: {
  children: JSX.Element;
  to: string;
}) {
  const { Link } = useVedaUI();
  return (
    <Link
      className='card-a11y-states'
      to={to}
      style={{
        width: '100%',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        borderRadius: '0.5rem'
      }}
    >
      {children}
    </Link>
  );
}
