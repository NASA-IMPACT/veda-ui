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
    display: flex;
`;

const Query = styled.span`
  background-color: #d1e7ff;
  padding: 2px 6px;
  border-radius: 5px;
  margin: 0 3px;
  position: relative;
  cursor: pointer;

  &:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    background-color: #333;
    color: #fff;
    padding: 5px;
    border-radius: 5px;
    top: 120%;
    left: 0;
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
  let explanationss = [
      {
        "query_part": "precipitation",
        "matchup": "lis-global-da-totalprecip"
      },
      {
        "query_part": "in 2022",
        "matchup": "2022-01-01T00:00:00 to 2022-12-31T23:59:59"
      },
      {
        "query_part": "Atlanta",
        "matchup": "[-85.06468963623047, 34.112266540527344, -85.06468963623047, 33.41950225830078, -83.71636199951172, 33.41950225830078, -83.71636199951172, 34.112266540527344, -85.06468963623047, 34.112266540527344]"
      },
      { "query_part": "show", "matchup": "load" }
    ]
  
  // Function to dynamically split the query and insert Query parts
  const renderHighlightedQuery = (query: string, explanations: any) => {
    let remainingQuery = query.toLowerCase();
    let elements = [];

    explanations.forEach(({ query_part, matchup }) => {
      const index = remainingQuery.indexOf(query_part.toLowerCase());
      if (index !== -1) {
        // Before query_part text
        if (index > 0) {
          elements.push(remainingQuery.slice(0, index));
        }
        // Highlighted query_part with a tooltip
        elements.push(
          <Query key={query_part} data-tooltip={matchup}>
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
        { query }
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
