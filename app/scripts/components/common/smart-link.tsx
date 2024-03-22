import React from 'react';
import { Link } from 'react-router-dom';

import { getLinkProps } from '$utils/url'

interface SmartLinkProps {
  to: string;
}

/**
 * Switches between a `a` and a `Link` depending on the url.
 */
export default function SmartLink(props: SmartLinkProps) {
  const { to, ...rest } = props;
  const isExternalLink = /^https?:\/\//.test(to);
  const linkProps = getLinkProps(isExternalLink, to);
  return isExternalLink ? (
      <a {...linkProps} {...rest} />
  ) : (
    <Link {...linkProps} {...rest} />
  );
}


interface CustomLinkProps {
  href: string;
}

/**
 * For links defined as markdown, this component will open the external link in a new tab.
 */
export function CustomLink(props: CustomLinkProps) {
  const { href, ...rest } = props;
  const isExternalLink = /^https?:\/\//.test(href);
  const linkProps = getLinkProps(isExternalLink, href);
  return isExternalLink ? (
      <a {...linkProps} {...rest} />
  ) : (
    <Link {...linkProps} {...rest} />
  );
}
