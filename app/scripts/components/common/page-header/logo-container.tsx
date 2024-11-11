import React, { ComponentType } from 'react';
import { Tip } from '../tip';
import { LinkProperties } from '$types/veda';
import { Brand, PageTitleSecLink } from './logo';
/**
 * LogoContainer that is meant to integrate in the default page header without the dependencies of the veda virtual modules
 * and expects the Logo SVG to be passed in as a prop - this will support the instance for refactor
 */

export default function LogoContainer ({ linkProperties, Logo, title, subTitle, version }: {
  linkProperties: LinkProperties,
  Logo: JSX.Element,
  title: string,
  subTitle: string,
  version: string
}) {
  const LinkElement: ComponentType<any> = linkProperties.LinkElement as ComponentType<any>;

  return (
    <Brand>
      <LinkElement {...{[linkProperties.pathAttributeKeyName]: '/'}}>
        {Logo}
        <span>{title}</span> <span>{subTitle}</span>
      </LinkElement>
      <Tip content={`v${version}`}>
      <PageTitleSecLink {...{as: linkProperties.LinkElement as ComponentType<any>, [linkProperties.pathAttributeKeyName]: '/development'}}>Beta</PageTitleSecLink>
      </Tip>
    </Brand>
  );
}