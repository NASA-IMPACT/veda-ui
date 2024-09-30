import React from 'react';

import styled from 'styled-components';

const DialogContent = styled.div`
    min-width: 25%;
    max-width: 75%;
    width: fit-content;
    margin: 1em 1em 1em 0;
    margin-left: auto;
    background: #d5ecfb;
    padding: 1em;
    border-radius: 10px;
    justify-content: flex-end;
    display: inline-block;

`;

const Query = styled.span`
  position: relative;
  cursor: pointer;
  border-bottom: 1px dashed;

  &[data-explanation-index='0'] {
    border-bottom-color: blue;
  }

  &[data-explanation-index='1'] {
    border-bottom-color: red;
  }

  &[data-explanation-index='2'] {
    border-bottom-color: black;
  }

  &[data-explanation-index='3'] {
    border-bottom-color: orange;
  }

  &[data-explanation-index='4'] {
    border-bottom-color: yellow;
  }

  &[data-explanation-index='5'] {
    border-bottom-color: pink;
  }

  &:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    background-color: #333;
    color: #fff;
    padding: 5px;
    border-radius: 5px;
    bottom: 100%;
    right: 0;
    white-space: nowrap;
    z-index: 100;
    opacity: 0.9;
    font-size: 12px;
  }
`;

interface GeoCoPilotModalProps {
    explanations: any;
    query: string;
}

export function GeoCoPilotUserDialogComponent({explanations, query}: {
    explanations: any;
    query: string;
}) {

  // Function to dynamically split the query and insert Query parts
  const renderHighlightedQuery = (query: string, explanations: any) => {
    let remainingQuery = query.toLowerCase();
    let elements: (string | any)[] = [];

    explanations.forEach(({ query_part, matchup }, internalIndex) => {
      const index = remainingQuery.indexOf(query_part.toLowerCase());
      if (index !== -1) {
        // Before query_part text
        if (index > 0) {
          elements.push(remainingQuery.slice(0, index));
        }
        // Highlighted query_part with a tooltip
        elements.push(
          <Query key={query_part} data-tooltip={matchup} data-explanation-index={internalIndex.toString()}>
            {query_part}
          </Query>
        );
        // Update remaining query
        remainingQuery = remainingQuery.slice(index + query_part.length);
      }
    });

    // Add remaining text after the last match
    if (remainingQuery) {
      elements.push(remainingQuery);
    }

    return elements;
  };

  return (
    <>
    {
      (query.length) &&
      <DialogContent>
        { explanations.length ?
        renderHighlightedQuery(query, explanations) : query }
      </DialogContent>
    }
    </>
  )
}

export function GeoCoPilotUserDialog(props: GeoCoPilotModalProps) {
    const {query, explanations} = props;
    return <GeoCoPilotUserDialogComponent
        explanations={explanations}
        query={query}
    />
}
