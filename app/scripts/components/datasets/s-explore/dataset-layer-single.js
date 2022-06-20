import React from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import { glsp, themeVal, truncated } from '@devseed-ui/theme-provider';
import { AccordionFold } from '@devseed-ui/accordion';
import { CollecticonCircleInformation } from '@devseed-ui/collecticons';
import { Heading } from '@devseed-ui/typography';
import { Toolbar, ToolbarIconButton } from '@devseed-ui/toolbar';

import {
  ElementInteractive,
  Wrapper as ElementInteractiveWrapper
} from '$components/common/element-interactive';
import {
  WidgetItemBodyInner,
  WidgetItemHeader,
  WidgetItemHeadline,
  WidgetItemHGroup
} from '$styles/panel';

const LayerSelf = styled(ElementInteractiveWrapper)`
  border-radius: 0;
  background: ${themeVal('color.surface')};
  transition: background 0.16s ease-in-out 0s;

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
    top: 50%;
    left: 0;
    width: ${glsp(0.25)};
    height: 0;
    transform: translate(0, -50%);
    transition: height 0.16s ease-in-out 0s;
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
        height: 100%;
      }
    `}
`;

const LayerTitle = styled(Heading).attrs({ as: 'h4', size: 'xsmall' })`
  ${truncated()}

  sub {
    bottom: 0;
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
          <WidgetItemHeader>
            <WidgetItemHGroup>
              <WidgetItemHeadline>
                <LayerTitle>{name}</LayerTitle>
                {/* <Subtitle as='p'>Subtitle</Subtitle> */}
              </WidgetItemHeadline>
              <Toolbar size='small'>
                <ToolbarIconButton
                  variation='base-text'
                  // disabled={!info}
                  active={isExpanded}
                  onClick={toggleExpanded}
                >
                  <CollecticonCircleInformation
                    title='Information about layer'
                    meaningful
                  />
                </ToolbarIconButton>
              </Toolbar>
            </WidgetItemHGroup>
          </WidgetItemHeader>
        )}
        renderBody={() => (
          <WidgetItemBodyInner>
            {info || <p>No info available for this layer.</p>}
          </WidgetItemBodyInner>
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
