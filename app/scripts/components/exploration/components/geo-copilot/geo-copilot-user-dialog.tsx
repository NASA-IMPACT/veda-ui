import React from 'react';

import styled from 'styled-components';

import JsxParser from 'react-jsx-parser';

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
    position: relative;

    &.active::after {
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
      max-width: 150px;
      text-wrap: balance;
    }
`;

const Query = styled.span`
  position: relative;
  cursor: pointer;
  display: inline-block;
  padding-bottom: 1px;
  // border-bottom: 1px solid;

  &[data-explanation-index='0'] {
    // text-decoration: underline;
    text-decoration-color: blue;
    color: blue;
  }

  &[data-explanation-index='1'] {
    // text-decoration: underline;
    // text-decoration-color: red;
    color: red;
  }

  &[data-explanation-index='2'] {
    // text-decoration: underline;
    // text-decoration-color: black;
    color: green;
  }

  &[data-explanation-index='3'] {
    // text-decoration: underline;
    // text-decoration-color: orange;
    color: orange;
  }

  &[data-explanation-index='4'] {
    // text-decoration: underline;
    // text-decoration-color: yellow;
    color: yellow;
  }

  &[data-explanation-index='5'] {
    // text-decoration: underline;
    // text-decoration-color: pink;
    // border-bottom-color: pink;
    color: pink;
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
    const lowerQuery: string = query.toLowerCase();
    const elementsToRender: string[] = lowerQuery.toLowerCase().split(' ');

    explanations.forEach(({ query_part, matchup }, internalIndex) => {
      const index = query.indexOf(query_part.toLowerCase());
      if (index < 0) return;
      const splits = query_part.split(' ');
      const lastWord = splits.at(-1) || '';
      const firstWord = splits[0] || '';
      const firstWordIndex = elementsToRender.indexOf(firstWord.toLowerCase());
      if (firstWordIndex < 0) return;
      elementsToRender.splice(
        firstWordIndex,
        0,
        `<Query key="${query_part}" data-tooltip="${matchup}" data-explanation-index="${internalIndex.toString()}">`
      );
      const lastWordIndex = elementsToRender.indexOf(lastWord.toLowerCase());
      if (lastWordIndex > 0) {
        elementsToRender.splice(lastWordIndex + 1, 0, '</Query>');
      }
    });
    let joinedElements = elementsToRender.join(' ');
    const startingQueryCount = (joinedElements.match(/<Query/g) || []).length;
    const endingQueryCount = (joinedElements.match(/<\/Query/g) || []).length;

    // for now a Hacky way of making sure the responses are rendered;
    if (startingQueryCount != endingQueryCount) {
      for(let iterator = 1; iterator <= (startingQueryCount - endingQueryCount); iterator++) {
        joinedElements += '</Query>'
      }
    }
    return joinedElements;
  };

  const resetToolTip = (e) => {
    e.currentTarget.setAttribute('data-tooltip', '');
    e.currentTarget.classList.remove('active');
  };

  const handleEnter = (e) => {
    if (e.target) {
      const toolTipValue = e.target.attributes['data-tooltip']?.value;
      if (toolTipValue) {
        e.currentTarget.setAttribute('data-tooltip', toolTipValue);
        e.currentTarget.classList.add('active');
      }
      else resetToolTip(e);
    }
  };

  const handleExit = (e) => {
    if (e.currentTarget) {
      resetToolTip(e);
    }
  };

  return (
    <>
    {
      (query.length) &&
      <DialogContent onMouseMove={handleEnter} onMouseLeave={handleExit}>
        {explanations.length ?
          <JsxParser
            allowUnknownElements={false}
            components={{Query}}
            jsx={renderHighlightedQuery(query, explanations)}
          /> :
          query}
      </DialogContent>
    }
    </>
  );
}

export function GeoCoPilotUserDialog(props: GeoCoPilotModalProps) {
    const {query, explanations} = props;
    return (
      <GeoCoPilotUserDialogComponent
          explanations={explanations}
          query={query}
      />
    );
}
