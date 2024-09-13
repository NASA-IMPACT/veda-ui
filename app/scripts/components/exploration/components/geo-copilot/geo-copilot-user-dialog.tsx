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

interface GeoCoPilotModalProps {
    explanations: any;
    query: string;
}

export function GeoCoPilotUserDialogComponent({explanations, query}: {
    explanations: any;
    query: string;
}) {
  return (
    <DialogContent>
      <div>{query}</div>
    </DialogContent>
  )
}

export function GeoCoPilotUserDialog(props: GeoCoPilotModalProps) {
    const {query, explanations} = props;
    return <GeoCoPilotUserDialogComponent
        explanations={explanations}
        query={query}
    />
}
