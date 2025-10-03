import React from 'react';
import styled from 'styled-components';
import { Icon } from '@trussworks/react-uswds';
import { multiply, themeVal } from '@devseed-ui/theme-provider';
import { variableGlsp } from '$styles/variable-utils';

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

/**
 * ExternalLinkFlag
 *
 * Small badge component used to mark external links in card-like UIs.
 * Displays "External Link" text with a launch icon in the top-right corner.
 *
 * @example
 * ```tsx
 * <ExternalLinkFlag />
 * ```
 *
 * @returns {JSX.Element} The external link flag badge
 */
export function ExternalLinkFlag(): JSX.Element {
  return (
    <ExternalLinkMark>
      <FlagText>External Link</FlagText>
      <Icon.Launch size={3} aria-hidden='true' />
    </ExternalLinkMark>
  );
}

export default ExternalLinkFlag;
