import React from 'react';
import { Link } from 'react-router-dom';

import { getBoolean } from 'veda';

interface SmartLinkProps {
  to: string;
}

/**
 * Switches between a `a` and a `Link` depending on the url.
 */
export default function SmartLink(props: SmartLinkProps) {
  const { to, ...rest } = props;
  const externalLinksInNewTab = getBoolean('externalLinksInNewTab');
  const isExternalLink = /^https?:\/\//.test(to);
  return isExternalLink ? (
    externalLinksInNewTab ? (
      <a target='_blank' rel='noopener noreferrer' href={to} {...rest} />
    ) : (
      <a href={to} {...rest} />
    )
  ) : (
    <Link to={to} {...rest} />
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
  const externalLinksInNewTab = getBoolean('externalLinksInNewTab');
  const isExternalLink = /^https?:\/\//.test(href);
  return isExternalLink ? (
    externalLinksInNewTab ? (
      <a target='_blank' rel='noopener noreferrer' href={href} {...rest} />
    ) : (
      <a href={href} {...rest} />
    )
  ) : (
    <Link to={href} {...rest} />
  );
}
