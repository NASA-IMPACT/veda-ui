import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';

import { glsp, themeVal, truncated } from '@devseed-ui/theme-provider';
import { Subtitle } from '@devseed-ui/typography';
import { CollecticonCircleInformation } from '@devseed-ui/collecticons';

import { variableBaseType, variableGlsp } from '$styles/variable-utils';

export const Figure = styled.figure`
  position: relative;
  display: inline-block;
  vertical-align: top;

  > a {
    display: block;
  }
`;

export const Figcaption = styled.figcaption`
  clear: both;
  display: flex;
  flex-flow: row nowrap;
`;

export const FigcaptionInner = styled(Subtitle).attrs({
  as: 'span'
})`
  padding: ${variableGlsp(0.5, 0, 0, 0)};
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: start;
  font-size: ${variableBaseType('0.75rem')};
  text-align: left;
  max-width: 52rem;

  &::after {
    content: '';
    width: ${glsp(2)};
    height: ${themeVal('layout.border')};
    margin-top: calc(${variableGlsp(0.5)} - ${themeVal('layout.border')});
    background: ${themeVal('color.base-100a')};
  }
`;

const FigureAttributionSelf = styled.p`
  position: absolute;
  top: ${glsp()};
  right: ${glsp()};
  z-index: 40;
  max-width: calc(100% - ${glsp(2)}); /* stylelint-disable-line */
  height: 1.5rem;
  display: inline-flex;
  color: ${themeVal('color.surface')};
  border-radius: ${themeVal('shape.ellipsoid')};
  padding: ${glsp(0, 0.25)};
  font-size: 0.75rem;
  background: ${themeVal('color.base-300a')};
  overflow: hidden;

  a,
  a:visited {
    color: inherit;
    text-decoration: none;
  }
`;

const FigureAttributionInner = styled.span`
  display: flex;
  flex-flow: nowrap;
  align-items: center;

  svg {
    flex-shrink: 0;
  }

  strong {
    display: block;
    width: 100%;
    max-width: 0;
    overflow: hidden;
    font-weight: normal;
    white-space: nowrap;
    padding: ${glsp(0)};
    opacity: 0;
    transition: all 0.24s ease-in-out 0s;
  }

  &:hover {
    strong {
      ${truncated()}
      max-width: 64vw;
      padding: ${glsp(0, 0.5, 0, 0.25)};
      opacity: 1;
    }
  }
`;

function FigureAttributionCmp(props) {
  const { author, url, ...rest } = props;

  if (!author) return null;

  const innerProps = url
    ? {
        as: 'a',
        href: url,
        target: '_blank',
        rel: 'noreferrer noopener'
      }
    : {};

  return (
    <FigureAttributionSelf {...rest}>
      <FigureAttributionInner {...innerProps}>
        <CollecticonCircleInformation />
        <strong>Figure by {author}</strong>
      </FigureAttributionInner>
    </FigureAttributionSelf>
  );
}

export const FigureAttribution = styled(FigureAttributionCmp)`
  /* Convert to styled-component: https://styled-components.com/docs/advanced#caveat */
`;

FigureAttributionCmp.propTypes = {
  author: T.string,
  url: T.string
};
