import React from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import { glsp, themeVal, truncated } from '@devseed-ui/theme-provider';
import { AccordionFold } from '@devseed-ui/accordion';
import { CollecticonCircleInformation } from '@devseed-ui/collecticons';
import { Button } from '@devseed-ui/button';
import { Heading } from '@devseed-ui/typography';

import {
  ElementInteractive,
  Wrapper as ElementInteractiveWrapper
} from '$components/common/element-interactive';
import { VarProse } from '$styles/variable-components';
import { variableGlsp } from '$styles/variable-utils';

const LayerSelf = styled(ElementInteractiveWrapper)`
  border-radius: 0;

  > div {
    background: none;
  }

  a,
  button {
    pointer-events: auto;
  }

  &::before {
    content: '';
    background: ${themeVal('color.primary')};
    position: absolute;
    left: 0;
    width: 0;
    height: 100%;
    transition: width 240ms ease-in-out;
  }

  ${({ isStateOver }) =>
    isStateOver &&
    css`
      background: ${themeVal('color.primary-100')};
    `}

  ${({ isSelected }) =>
    isSelected &&
    css`
      background: ${themeVal('color.primary-50')};

      ${LayerTitle} {
        color: ${themeVal('color.primary')};
      }

      &::before {
        width: ${glsp(0.25)};
      }
    `}
`;

const LayerHeader = styled.header`
  display: flex;
  flex-flow: column nowrap;
  padding: ${variableGlsp(0.5, 1)};
  gap: ${glsp(0.5)};
`;

const LayerHeadline = styled.div`
  grid-row: 1;
  min-width: 0px;
`;

const LayerHGroup = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: ${glsp(0.5)};
  justify-content: space-between;
`;

const LayerTitle = styled(Heading).attrs({ as: 'h4', size: 'xsmall' })`
  ${truncated()}

  sub {
    bottom: 0;
  }
`;

const LayerToolbar = styled.div`
  grid-row: 1;
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-start;

  > * {
    margin-top: -0.125rem;
  }

  > *:not(:first-child) {
    margin-left: ${glsp(0.25)};
  }
`;

const LayerBodyInner = styled(VarProse)`
  position: relative;
  z-index: 8;
  box-shadow: inset 0 1px 0 0 ${themeVal('color.base-100a')};
  font-size: 0.875rem;
  line-height: 1.25rem;
  padding: ${variableGlsp(0.5, 1)};
  background: ${themeVal('color.base-50a')};

  /* stylelint-disable-next-line no-descending-specificity */
  > * {
    margin-bottom: ${glsp(0.75)};
  }
`;

export function Layer(props) {
  const { id, name, info, active, onToggleClick } = props;

  return (
    <ElementInteractive
      as={LayerSelf}
      forwardedAs='article'
      isSelected={active}
      linkLabel='Toggle layer'
      linkProps={{
        href: '#',
        onClick: (e) => {
          e.preventDefault();
          onToggleClick();
        }
      }}
    >
      <AccordionFold
        id={`layer-${id}`}
        forwardedAs='div'
        renderHeader={({ isExpanded, toggleExpanded }) => (
          <LayerHeader>
            <LayerHGroup>
              <LayerHeadline>
                <LayerTitle>{name}</LayerTitle>
                {/* <Subtitle as='p'>Subtitle</Subtitle> */}
              </LayerHeadline>
              <LayerToolbar>
                <Button
                  variation='base-text'
                  fitting='skinny'
                  size='small'
                  // disabled={!info}
                  active={isExpanded}
                  onClick={toggleExpanded}
                >
                  <CollecticonCircleInformation
                    title='Information about layer'
                    meaningful
                  />
                </Button>
              </LayerToolbar>
            </LayerHGroup>
          </LayerHeader>
        )}
        renderBody={() => (
          <LayerBodyInner>
            {info || <p>No info available for this layer.</p>}
          </LayerBodyInner>
        )}
      />
    </ElementInteractive>
  );
}

Layer.propTypes = {
  id: T.string,
  name: T.string,
  info: T.node,
  active: T.bool,
  onToggleClick: T.func
};
