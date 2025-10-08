import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { glsp, listReset, media, themeVal } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import { CollecticonChevronRightSmall } from '@devseed-ui/collecticons';

import Hug from '$styles/hug';

/**
 * Legacy Connections section component for the home page.
 *
 * This component provides navigation links and feedback functionality that would
 * normally be handled by the modern USWDS footer. It is conditionally rendered
 * when the USWDS footer is disabled (ENABLE_USWDS_PAGE_FOOTER=false).
 *
 * The content includes:
 * - "Learn more" link to the about page
 * - "Give feedback" link that opens the feedback modal
 *
 * This section was moved behind the ENABLE_USWDS_PAGE_FOOTER feature flag
 * because the new USWDS footer component includes similar navigation and
 * feedback functionality. When the USWDS footer is enabled, this section
 * is hidden to avoid duplication.
 *
 * @see {@link https://github.com/NASA-IMPACT/veda-ui/commit/f838337c4a31f09a1c40ab395911038c56eaf272} - Original commit that moved this behind the feature flag
 *
 * @param showFeedbackModal - Function to show the feedback modal
 */
interface ConnectionsSectionProps {
  showFeedbackModal: () => void;
}

const Connections = styled(Hug)`
  background: ${themeVal('color.base-50')};
  padding-top: ${glsp(2)};
  padding-bottom: ${glsp(2)};
  box-shadow: inset 0 -1px 0 0 ${themeVal('color.base-100a')};
`;

const ConnectionsBlock = styled.div`
  display: flex;
  flex-flow: column nowrap;
  gap: ${glsp()};

  &:nth-child(1) {
    grid-column: content-start / content-3;

    ${media.mediumUp`
      grid-column: content-start / content-4;
    `}

    ${media.largeUp`
      grid-column: content-4 / content-7;
    `}
  }

  &:nth-child(2) {
    grid-column: content-3 / content-end;

    ${media.mediumUp`
      grid-column: content-5 / content-end;
    `}

    ${media.largeUp`
      grid-column: content-7 / content-10;
    `}
  }
`;

const ConnectionsBlockTitle = styled(Heading).attrs({
  as: 'h2',
  size: 'medium'
})`
  /* no style, only attrs */
`;

const ConnectionsList = styled.ul`
  ${listReset()};

  li {
    margin-bottom: ${glsp(0.25)};
  }

  a {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: ${glsp(0.25)};
    font-weight: ${themeVal('button.type.weight')};
    text-decoration: none;
    transition: opacity 0.24s ease;

    &:visited {
      color: inherit;
    }

    &:hover {
      opacity: 0.64;
    }
  }
`;

export default function ConnectionsSection({
  showFeedbackModal
}: ConnectionsSectionProps) {
  return (
    <Connections>
      <ConnectionsBlock>
        <ConnectionsBlockTitle>About</ConnectionsBlockTitle>
        <ConnectionsList>
          <li>
            <Link to='/about'>
              <CollecticonChevronRightSmall /> Learn more
            </Link>
          </li>
          <li>
            <a
              href='#'
              onClick={(e) => {
                e.preventDefault();
                showFeedbackModal();
              }}
            >
              <CollecticonChevronRightSmall /> Give feedback
            </a>
          </li>
        </ConnectionsList>
      </ConnectionsBlock>
    </Connections>
  );
}
