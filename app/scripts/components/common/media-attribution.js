import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { glsp, themeVal, truncated } from '@devseed-ui/theme-provider';
import { CollecticonCircleInformation } from '@devseed-ui/collecticons';

const MediaAttributionSelf = styled.p`
  position: absolute;
  bottom: ${glsp()};
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

const MediaAttributionInner = styled.span`
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

function MediaAttribution(props) {
  const { author, url, ...rest } = props;

  return (
    <MediaAttributionSelf {...rest}>
      <MediaAttributionInner as='a' href={url} target='_blank' rel='noreferrer'>
        <CollecticonCircleInformation />
        <strong>Image by {author}</strong>
      </MediaAttributionInner>
    </MediaAttributionSelf>
  );
}

export default styled(MediaAttribution)`
  /* Convert to styled-component: https://styled-components.com/docs/advanced#caveat */
`;

MediaAttribution.propTypes = {
  author: T.string,
  url: T.string
};
