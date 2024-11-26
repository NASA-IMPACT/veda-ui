import React, { ComponentType } from 'react';
import { Tip } from '../../tip';
import { LinkProperties } from '$types/veda';
import './styles.scss';

/**
 * LogoContainer that is meant to integrate in the default
 * page header without the dependencies of the veda virtual modules
 * and expects the Logo SVG to be passed in as a prop - this will
 * support the instance for refactor
 */

export default function LogoContainer({
  linkProperties,
  LogoSvg,
  title,
  version,
}: {
  linkProperties: LinkProperties;
  LogoSvg?: SVGElement;
  title: string;
  version?: string;
}) {
  const LinkElement: ComponentType<any> =
    linkProperties.LinkElement as ComponentType<any>;

  return (
    <div id='logo-container'>
      <LinkElement id='logo-container-link' {...{ [linkProperties.pathAttributeKeyName]: '/' }}>
        {LogoSvg}
        <span>{title}</span>
      </LinkElement>
      <Tip content={`v${version}`}>
        <div
          id='logo-container-beta-tag'
          {...{
            as: linkProperties.LinkElement as ComponentType<any>,
            [linkProperties.pathAttributeKeyName]: '/development'
          }}
        >
          {version || 'BETA'}
        </div>
      </Tip>
    </div>
  );
}