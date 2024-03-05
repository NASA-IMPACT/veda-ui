import React from 'react';
import { Link } from 'react-router-dom';

interface SmartLinkProps {
  to: string;
}

interface CustomLinkProps {
  href: string;
}

/**
 * Switches between a `a` and a `Link` depending on the url.
 */
export default function SmartLink(props: SmartLinkProps) {
  const { to, ...rest } = props;

  return /^https?:\/\//.test(to) ? (
    <a href={to} {...rest} />
  ) : (
    <Link to={to} {...rest} />
  );
}


export function CustomLink(props: CustomLinkProps) {
  const { href, ...rest } = props;

  return /^https?:\/\//.test(href) ? (
    <a target='_blank' href={href} {...rest} />
  ) : (
    <Link to={href} {...rest} />
  );
}
