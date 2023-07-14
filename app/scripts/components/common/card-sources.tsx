import React from 'react';
import styled from 'styled-components';
import { TaxonomyItem } from 'veda';
import { Link } from 'react-router-dom';
import { listReset } from '@devseed-ui/theme-provider';
import { Actions } from '$components/common/browse-controls/use-browse-controls';

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
  onSourceClick?: (v: string) => void;
  rootPath?: string;
}

export function CardSourcesList(props: SourcesListProps) {
  const { sources, onSourceClick, rootPath } = props;

  if (!sources?.length) return null;

  // No link rendering
  if (!rootPath || !onSourceClick) {
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
              to={`${rootPath}?${Actions.TAXONOMY}=${JSON.stringify({
                Source: source.id
              })}`}
              onClick={(e) => {
                e.preventDefault();
                onSourceClick(source.id);
              }}
            >
              {source.name}
            </Link>
          </li>
        ))}
      </SourcesUl>
    </div>
  );
}
