import React, { ComponentType } from 'react';
import styled from 'styled-components';
import { Tip } from '../tip';
import { LinkProperties } from '$types/veda';

//@TODO: Add design tokens from theme
const Container = styled.div`
  display: flex;
  flex-shrink: 0;

  a {
    display: grid;
    align-items: center;

    &,
    &:visited {
      color: inherit;
      text-decoration: none;
    }

    #nasa-logo-pos {
      opacity: 1;
      transform: translate(0, -100%); //@TODO: fix svg translate
    }

    svg {
      grid-row: 1 / span 2;
      height: 2.5rem;
      width: auto;
    }

    span:first-of-type {
      font-size: 0.875rem;
      line-height: 1rem;
      font-weight: extrabold;
      text-transform: uppercase;
    }

    span:last-of-type {
      grid-row: 2;
      font-size: 1.25rem;
      line-height: 1.5rem;
      font-weight: regular;
      letter-spacing: -0.025em;
    }
  }
`;

export const BetaTag = styled.a`
  align-self: end;
  font-size: 0.75rem;
  font-weight: bold;
  line-height: 1rem;
  text-transform: uppercase;

  &&,
  &&:visited {
    color: primary;
  }
`;

/**
 * LogoContainer that is meant to integrate in the default
 * page header without the dependencies of the veda virtual modules
 * and expects the Logo SVG to be passed in as a prop - this will
 * support the instance for refactor
 */

export default function LogoContainer({
  linkProperties,
  Logo,
  title,
  subTitle,
  version
}: {
  linkProperties: LinkProperties;
  Logo?: JSX.Element;
  title: string;
  subTitle?: string;
  version?: string;
}) {
  const LinkElement: ComponentType<any> =
    linkProperties.LinkElement as ComponentType<any>;

  return (
    <Container>
      <LinkElement {...{ [linkProperties.pathAttributeKeyName]: '/' }}>
        {Logo}
        <span>{title}</span> {subTitle && <span>{subTitle}</span>}
      </LinkElement>
      {version && (
        <Tip content={`v${version}`}>
          <BetaTag
            {...{
              as: linkProperties.LinkElement as ComponentType<any>,
              [linkProperties.pathAttributeKeyName]: '/development'
            }}
          >
            Beta
          </BetaTag>
        </Tip>
      )}
    </Container>
  );
}
