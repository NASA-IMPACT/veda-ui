import React, { Fragment } from 'react';
import styled from 'styled-components';
import { LayerLegendCategorical, LayerLegendGradient } from 'veda';
import { AccordionFold, AccordionManager } from '@devseed-ui/accordion';
import {
  glsp,
  themeVal,
  truncated,
  visuallyHidden
} from '@devseed-ui/theme-provider';
import { CollecticonCircleInformation } from '@devseed-ui/collecticons';
import { Toolbar, ToolbarIconButton } from '@devseed-ui/toolbar';
import { ShadowScrollbar } from '@devseed-ui/shadow-scrollbar';

import { Tip } from '../tip';
import { formatThousands } from '$utils/format';
import { variableBaseType, variableGlsp } from '$styles/variable-utils';
import {
  WidgetItemBodyInner,
  WidgetItemHeader,
  WidgetItemHeadline,
  WidgetItemHGroup
} from '$styles/panel';


interface LayerLegendCommonProps{
  id: string;
  title: string;
  description: string;
}

interface LegendSwatchProps{
  hasHelp?: boolean;
  stops: string | string[];
}

const makeGradient = (stops: string[]) => {
  if (stops.length === 1) return stops[0];
  const d = 100 / (stops.length - 1);
  const steps = stops.map((s, i) => `${s} ${i * d}%`);
  return `linear-gradient(to right, ${steps.join(', ')})`;
};

const printLegendVal = (val: string | number) =>
  typeof val === 'number' ? formatThousands(val, { shorten: true }) : val;

export const LegendContainer = styled.div`
  position: absolute;
  z-index: 8;
  bottom: ${variableGlsp()};
  right: ${variableGlsp()};
  display: flex;
  flex-flow: column nowrap;
`;

const LayerLegendSelf = styled.div`
  display: flex;
  flex-flow: column nowrap;
  border-radius: ${themeVal('shape.rounded')};
  box-shadow: ${themeVal('boxShadow.elevationB')};
  background-color: ${themeVal('color.surface')};
  width: 16rem;

  &:not(:last-child) {
    margin-bottom: ${variableGlsp(0.25)};
  }

  &.reveal-enter {
    opacity: 0;
    bottom: 4rem;
  }
  &.reveal-exit {
    opacity: 1;
    bottom: ${variableGlsp()};
  }
  &.reveal-enter-active {
    opacity: 1;
    bottom: ${variableGlsp()};
  }
  &.reveal-exit-active {
    opacity: 0;
    bottom: 4rem;
  }
  &.reveal-enter-active,
  &.reveal-exit-active {
    transition: bottom 240ms ease-in-out, opacity 240ms ease-in-out;
  }

  ${WidgetItemHeader} {
    padding: ${variableGlsp(0.5, 0.75)};
  }
`;

const LegendList = styled.dl`
  display: grid;
  grid-gap: 0 ${glsp(0.125)};
  grid-auto-columns: minmax(1rem, 1fr);
  grid-auto-flow: column;

  dt {
    grid-row: 1;
  }

  dd {
    font-size: 0.75rem;
    line-height: 1rem;
    grid-row: 2;
    display: flex;

    /* stylelint-disable-next-line no-descending-specificity */
    > * {
      width: 8rem;

      /* stylelint-disable-next-line no-descending-specificity */
      > * {
        ${truncated()}
        display: block;
      }

      &:last-child:not(:first-child) {
        text-align: right;
      }
    }

    &:last-of-type:not(:first-of-type) {
      justify-content: flex-end;
      text-align: right;
    }

    &:not(:first-of-type):not(:last-of-type) {
      ${visuallyHidden()}
    }

    i {
      margin: 0 auto;
      opacity: 0;
    }
  }
`;

const LegendSwatch = styled.span<LegendSwatchProps>`
  display: block;
  font-size: 0;
  height: 0.5rem;
  border-radius: ${themeVal('shape.rounded')};
  background: ${({ stops }) =>
    typeof stops === 'string' ? stops : makeGradient(stops)};
  margin: 0 0 ${glsp(1 / 8)} 0;
  box-shadow: inset 0 0 0 1px ${themeVal('color.base-100a')};
  cursor: ${({ hasHelp }) => (hasHelp ? 'help' : 'auto')};
`;

const LayerLegendTitle = styled.h3`
  font-size: ${variableBaseType('0.75rem')};
  line-height: ${variableBaseType('1rem')};
`;

const LegendBody = styled(WidgetItemBodyInner)`
  padding: 0;

  .scroll-inner {
    padding: ${variableGlsp(0.5, 0.75)};
  }

  .shadow-bottom {
    border-radius: ${themeVal('shape.rounded')};
  }
`;

function LayerLegend(
  props: LayerLegendCommonProps & (LayerLegendGradient | LayerLegendCategorical)
) {
  const { id, type, title, description } = props;

  return (
    <AccordionManager>
      <AccordionFold
        id={id}
        forwardedAs={LayerLegendSelf}
        renderHeader={({ isExpanded, toggleExpanded }) => (
          <WidgetItemHeader>
            <WidgetItemHGroup>
              <WidgetItemHeadline>
                <LayerLegendTitle>{title}</LayerLegendTitle>
                {/* <Subtitle as='p'>Subtitle</Subtitle> */}
              </WidgetItemHeadline>
              <Toolbar size='small'>
                <ToolbarIconButton
                  variation='base-text'
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
            {type === 'categorical' && (
              <LayerCategoricalGraphic type='categorical' stops={props.stops} />
            )}
            {type === 'gradient' && (
              <LayerGradientGraphic
                type='gradient'
                stops={props.stops}
                min={props.min}
                max={props.max}
              />
            )}
          </WidgetItemHeader>
        )}
        renderBody={() => (
          <LegendBody>
            <ShadowScrollbar
              scrollbarsProps={{
                autoHeight: true,
                autoHeightMin: 32,
                autoHeightMax: 240
              }}
            >
              <div className='scroll-inner'>
                {description || (
                  <p>No info available for this layer.</p>
                )}
              </div>
            </ShadowScrollbar>
          </LegendBody>
        )}
      />
    </AccordionManager>
  );
}

export default LayerLegend;

function LayerCategoricalGraphic(props: LayerLegendCategorical) {
  const { stops } = props;

  return (
    <LegendList>
      {stops.map((stop) => (
        <Fragment key={stop.color}>
          <dt>
            <Tip content={stop.label}>
              <LegendSwatch stops={stop.color} hasHelp>
                {stop.color}
              </LegendSwatch>
            </Tip>
          </dt>
          <dd>
            {/*
                The 2 spans are needed so that the text can be correctly
                truncated. The dd element is part of a grid and has an
                implicit width. The first span overflows the dd, setting
                the final width and the second span truncates the text.
              */}
            <span>
              <span>{stop.label}</span>
            </span>
          </dd>
        </Fragment>
      ))}
    </LegendList>
  );
}

function LayerGradientGraphic(props: LayerLegendGradient) {
  const { stops, min, max } = props;

  return (
    <LegendList>
      <dt>
        <LegendSwatch stops={stops}>
          {stops[0]} to {stops[stops.length - 1]}
        </LegendSwatch>
      </dt>
      <dd>
        <span>{printLegendVal(min)}</span>
        <i> – </i>
        <span>{printLegendVal(max)}</span>
      </dd>
    </LegendList>
  );
}
