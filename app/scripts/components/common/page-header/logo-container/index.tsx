import React, { ComponentType } from 'react';
import { Tip } from '../../tip';
import './logo-container.scss';
import { useVedaUI } from '$context/veda-ui-provider';

/**
 * LogoContainer that is meant to integrate in the default
 * page header without the dependencies of the veda virtual modules
 * and expects the Logo SVG to be passed in as a prop - this will
 * support the instance for refactor
 */

export default function LogoContainer({
  LogoSvg,
  title,
  version,
  className
}: {
  LogoSvg?: SVGElement | JSX.Element;
  title: string;
  version?: string;
  className?: string;
}) {
  const {
    navigation: { LinkComponent, linkProps }
  } = useVedaUI();

  return (
    <div id='logo-container'>
      <LinkComponent
        id='logo-container-link'
        {...{ [linkProps.pathAttributeKeyName]: '/' }}
      >
        <span className={className}>{LogoSvg as any}</span>
        <span>{title}</span>
      </LinkComponent>
      <Tip content={version ? `v${version}` : 'beta version'}>
        <div
          id='logo-container-beta-tag'
          className='display-none mobile-lg:display-block'
          {...{
            as: LinkComponent,
            [linkProps.pathAttributeKeyName]: '/development'
          }}
        >
          {version || 'BETA'}
        </div>
      </Tip>
    </div>
  );
}
