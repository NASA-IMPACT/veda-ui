import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { getLinkProps } from '$utils/url';

interface SmartLinkProps {
  to: string;
  isLinkExternal?: boolean;
  onLinkClick?: ()=> void;
  children?: ReactNode;
}

/**
 * Switches between a `a` and a `Link` depending on the optional `isLinkExternal` prop or the url.
 */
export default function SmartLink(props: SmartLinkProps) {
  const { to, isLinkExternal, onLinkClick, children, ...rest } = props;
  const isExternalLink = isLinkExternal ?? /^https?:\/\//.test(to);
  const linkProps = getLinkProps(to, isLinkExternal, undefined, onLinkClick);

  return isExternalLink ? (
    <a {...linkProps} {...rest}> {children} </a>
    ) : (
      <Link {...linkProps} {...rest}> {children} </Link>
    );
}


interface CustomLinkProps {
  href: string;
  isLinkExternal?: boolean;
}

/**
 * For links defined as markdown, this component will open the external link in a new tab depending on the optional `isLinkExternal` prop or the url.
 */
export function CustomLink(props: CustomLinkProps) {
  const { href, isLinkExternal, ...rest } = props;
  const isExternalLink = isLinkExternal ?? /^https?:\/\//.test(href);
  const linkProps = getLinkProps(href);
  return isExternalLink ? (
      <a {...linkProps} {...rest} />
  ) : (
    <Link {...linkProps} {...rest} />
  );
}
