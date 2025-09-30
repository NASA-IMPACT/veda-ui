import React from 'react';
import styled from 'styled-components';
import { CollecticonExpandTopRight } from '@devseed-ui/collecticons';
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
 * @deprecated This is the legacy version using CollecticonExpandTopRight.
 * Use the new version from '@teamimpact/veda-ui' instead.
 *
 * @returns {JSX.Element} The external link flag badge with legacy icon
 */
export function ExternalLinkFlagDeprecated(): JSX.Element {
  return (
    <ExternalLinkMark>
      <FlagText>External Link</FlagText>
      <CollecticonExpandTopRight size='small' meaningful={false} />
    </ExternalLinkMark>
  );
}

export default ExternalLinkFlagDeprecated;
