/* eslint-disable react/no-unused-prop-types */
import React from 'react';

// Inspired by https://github.com/tsmith123/react-pluralize
// Adapted to remove wrapper.

interface PluralizeOpts {
  singular: string;
  plural?: string;
  zero?: string;
  count: number;
  showCount?: boolean;
}

export function pluralize({
  singular,
  plural,
  count,
  showCount,
  zero
}: PluralizeOpts) {
  if (count === 0 && zero) return zero;

  let output = singular;
  if (count !== 1) {
    output = plural ?? `${singular}s`;
  }

  return showCount ? `${count} ${output}` : output;
}

export default function Pluralize(props: PluralizeOpts) {
  const str = pluralize(props);
  return <>{str}</>;
}

Pluralize.defaultProps = {
  showCount: true,
  zero: null
};
