import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { glsp, listReset, media, themeVal } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import { Icon } from '@trussworks/react-uswds';

import Hug from '$styles/hug';
import { useDeprecationWarning } from '$utils/deprecation-warning';

/**
 * Legacy Connections section component for the home page.
 *
 * @deprecated This component is deprecated and will be removed in version 7.
 *             See {@link https://github.com/NASA-IMPACT/veda-ui/issues/1889} for details.
 *
 * Provides navigation links and feedback functionality that would normally be handled
 * by the modern USWDS footer. Hidden when `ENABLE_USWDS_PAGE_FOOTER` is enabled.
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
  useDeprecationWarning({
    name: 'ConnectionsSection',
    removalVersion: '7.0.0',
    issueUrl: 'https://github.com/NASA-IMPACT/veda-ui/issues/1889',
    alternative: 'Use the modern USWDS footer component instead'
  });

  return (
    <Connections>
      <ConnectionsBlock>
        <ConnectionsBlockTitle>About</ConnectionsBlockTitle>
        <ConnectionsList>
          <li>
            <Link to='/about'>
              <Icon.ArrowForward aria-hidden='true' /> Learn more
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
              <Icon.ArrowForward aria-hidden='true' /> Give feedback
            </a>
          </li>
        </ConnectionsList>
      </ConnectionsBlock>
    </Connections>
  );
}
