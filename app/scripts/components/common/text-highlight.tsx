import React, { ComponentType, ReactNode } from 'react';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';

const SearchHighlight = styled.mark`
  font-style: italic;
  background-color: ${themeVal('color.warning')};
`;

interface TextHighlightProps {
  children: string;
  value?: string;
  highlightEl?: ComponentType | keyof JSX.IntrinsicElements;
  disabled?: boolean;
}

export default function TextHighlight(props: TextHighlightProps) {
  const { children, value, highlightEl, disabled } = props;

  if (!value || disabled) return <>{children}</>;
  const El = highlightEl ?? SearchHighlight;

  // Highlight is done index based because it has to take case insensitive
  // searches into account.
  const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedValue, 'ig');

  /* eslint-disable-next-line prefer-const */
  let highlighted: ReactNode[] = [];
  let workingIdx = 0;
  let m;
  /* eslint-disable-next-line no-cond-assign */
  while ((m = regex.exec(children)) !== null) {
    // Prevent infinite loops with zero-width matches.
    if (m.index === regex.lastIndex) regex.lastIndex++;

    // Store string since last match.
    highlighted = highlighted.concat(children.substring(workingIdx, m.index));
    // Highlight word.
    highlighted = highlighted.concat(
      <El key={m.index}>
        {children.substring(m.index, m.index + value.length)}
      </El>
    );
    // Move index forward.
    workingIdx = m.index + value.length;
  }
  // Add last piece. From working index to the end.
  highlighted = highlighted.concat(children.substring(workingIdx));

  return <>{highlighted}</>;
}