import React from 'react';
import styled from 'styled-components';
import { listReset } from '@devseed-ui/theme-provider';
import { useVedaUI } from '$context/veda-ui-provider';
import { TaxonomyItem } from '$types/veda';

import { FilterActions } from '$components/common//catalog/utils';

const SourcesUl = styled.ul`
  ${listReset()}
  display: inline;
  gap: 0.25rem;

  li {
    display: inline;
  }

  li:not(:last-child)::after {
    content: ', ';
  }
`;

interface SourcesListProps {
  sources?: TaxonomyItem[];
  rootPath?: string;
}

export function CardSourcesList(props: SourcesListProps) {
  const { sources, rootPath } = props;

  const { Link } = useVedaUI();

  if (!sources?.length) return null;

  // No link rendering
  if (!rootPath) {
    return (
      <div>
        <span>By</span>{' '}
        <SourcesUl>
          {sources.map((source) => (
            <li key={source.id}>{source.name}</li>
          ))}
        </SourcesUl>
      </div>
    );
  }

  return (
    <div>
      <span>By</span>{' '}
      <SourcesUl>
        {sources.map((source) => (
          <li key={source.id}>
            <Link
              to={`${rootPath}?${FilterActions.TAXONOMY}=${encodeURIComponent(
                JSON.stringify({
                  Source: source.id
                })
              )}`}
            >
              {source.name}
            </Link>
          </li>
        ))}
      </SourcesUl>
    </div>
  );
}
