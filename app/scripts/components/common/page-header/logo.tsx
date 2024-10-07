import React from 'react';
import styled from 'styled-components';
import { glsp, media, themeVal } from '@devseed-ui/theme-provider';
import NasaLogo from '../nasa-logo';
import { Tip } from '../tip';
import { LinkProperties } from '../card';
import { ComponentOverride } from '$components/common/page-overrides';

const appTitle = process.env.APP_TITLE;
const appVersion = process.env.APP_VERSION;

const Brand = styled.div`
  display: flex;
  flex-shrink: 0;

  a {
    display: grid;
    align-items: center;
    gap: ${glsp(0, 0.5)};

    &,
    &:visited {
      color: inherit;
      text-decoration: none;
    }

    #nasa-logo-neg-mono {
      opacity: 1;
      transition: all 0.32s ease 0s;
    }

    #nasa-logo-pos {
      opacity: 0;
      transform: translate(0, -100%);
      transition: all 0.32s ease 0s;
    }

    &:hover {
      opacity: 1;

      #nasa-logo-neg-mono {
        opacity: 0;
      }

      #nasa-logo-pos {
        opacity: 1;
      }
    }

    svg {
      grid-row: 1 / span 2;
      height: 2.5rem;
      width: auto;

      ${media.largeUp`
        transform: scale(1.125);
      `}
    }

    span:first-of-type {
      font-size: 0.875rem;
      line-height: 1rem;
      font-weight: ${themeVal('type.base.extrabold')};
      text-transform: uppercase;
    }

    span:last-of-type {
      grid-row: 2;
      font-size: 1.25rem;
      line-height: 1.5rem;
      font-weight: ${themeVal('type.base.regular')};
      letter-spacing: -0.025em;
    }
  }
`;

const PageTitleSecLink = styled.a`
  align-self: end;
  font-size: 0.75rem;
  font-weight: ${themeVal('type.base.bold')};
  line-height: 1rem;
  text-transform: uppercase;
  background: ${themeVal('color.surface')};
  padding: ${glsp(0, 0.25)};
  border-radius: ${themeVal('shape.rounded')};
  margin: ${glsp(0.125, 0.5)};

  &&,
  &&:visited {
    color: ${themeVal('color.primary')};
  }

  ${media.largeUp`
    margin: ${glsp(0, 0.5)};
    font-size: 0.875rem;
    line-height: 1.25rem;
    padding: 0 ${glsp(0.5)};
  `}
`;

export default function Logo ({ linkProperties }: { linkProperties: LinkProperties }) {
  const LinkElement = linkProperties.LinkElement; // @TODO-SANDRA: Revisit typing here...
  const linkProps = {
    [linkProperties.pathAttributeKeyName]: '/'
  };

  return (
  <ComponentOverride with='headerBrand'>
    <Brand>
      <LinkElement {...linkProps}>
        <NasaLogo />
        <span>Earthdata</span> <span>{appTitle}</span>
      </LinkElement>
      <Tip content={`v${appVersion}`}>
        <PageTitleSecLink as={LinkElement} href='/development'>Beta</PageTitleSecLink>
      </Tip>
    </Brand>
  </ComponentOverride>);
}