import React from 'react';
import styled from 'styled-components';
import { listReset } from '@devseed-ui/theme-provider';
import { LinkProperties, TaxonomyItem } from '$types/veda';
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
  onSourceClick?: (v: string) => void;
  rootPath?: string;
  linkProperties: LinkProperties;
}

export function CardSourcesList(props: SourcesListProps) {
  const { sources, onSourceClick, linkProperties, rootPath } = props;
  const { LinkElement, pathAttributeKeyName } = linkProperties as { LinkElement: React.ElementType, pathAttributeKeyName: string };
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
            <LinkElement
              {...{[pathAttributeKeyName]:`${rootPath}?${FilterActions.TAXONOMY}=${encodeURIComponent(
                JSON.stringify({
                  Source: source.id
                })
              )}`}}
              onClick={(e) => {
                e.preventDefault();
                onSourceClick(source.id);
              }}
            >
              {source.name}
            </LinkElement>
          </li>
        ))}
      </SourcesUl>
    </div>
  );
}