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
  border-bottom: 1px solid;

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
    const elementsToRender: string[] = query.toLowerCase().split(' ');

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
      elementsToRender.splice(lastWordIndex + 1, 0, '</Query>');
    });
    return elementsToRender.join(' ');
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
