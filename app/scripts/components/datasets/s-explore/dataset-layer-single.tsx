import React from 'react';
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
import { Tip } from '$components/common/tip';

interface LayerSelfProps {
  isStateOver?: boolean;
  isSelected?: boolean;
}

const LayerSelf = styled(ElementInteractiveWrapper)<LayerSelfProps>`
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

interface LayerProps {
  id: string;
  name: string;
  info: React.ReactNode;
  active: boolean;
  onToggleClick: () => void;
}

export function Layer(props: LayerProps) {
  const { id, name, info, active, onToggleClick } = props;

  const layerTitleRef = React.useRef<HTMLDivElement>(null);

  const isOverflowing = layerTitleRef.current
    ? layerTitleRef.current.scrollWidth > layerTitleRef.current.offsetWidth
    : false;

  return (
    <Tip content={name} disabled={!isOverflowing}>
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
        on
      >
        <AccordionFold
          id={`layer-${id}`}
          forwardedAs='div'
          renderHeader={({ isExpanded, toggleExpanded }) => (
            <WidgetItemHeader>
              <WidgetItemHGroup>
                <WidgetItemHeadline>
                  <LayerTitle ref={layerTitleRef}>{name}</LayerTitle>
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
              {info ?? <p>No info available for this layer.</p>}
            </WidgetItemBodyInner>
          )}
        />
      </ElementInteractive>
    </Tip>
  );
}
