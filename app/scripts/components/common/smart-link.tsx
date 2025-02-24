import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { getLinkProps } from '$utils/url';

interface SmartLinkProps {
  to: string;
  children?: ReactNode;
}

/**
 * Switches between a `a` and a `Link` depending on the url.
 */
export default function SmartLink(props: SmartLinkProps) {
  const { to, children, ...rest } = props;
  const isExternalLink = /^https?:\/\//.test(to);
  const linkProps = getLinkProps(to);

  return isExternalLink ? (
    <a {...linkProps} {...rest}> {children} </a>
    ) : (
      <Link {...linkProps} {...rest}> {children} </Link>
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
  const isExternalLink = /^(https?:\/\/|mailto:)/i.test(href);
  const linkProps = getLinkProps(href);
  return (isExternalLink) ? (
    // @ts-expect-error linkProps returned from getLinkProps are not being recognized suddenly
    <a {...linkProps} {...rest} />
  ) : (
    <Link {...linkProps} {...rest} />
  );
}
