import React, { ReactNode, Fragment, useState, useCallback } from 'react';
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
import { followCursor } from 'tippy.js';
import { scaleLinear } from 'd3';

import { Tip } from '../tip';
import {
  formatAsScientificNotation,
  formatThousands,
  round
} from '$utils/format';
import { variableBaseType, variableGlsp } from '$styles/variable-utils';
import {
  WidgetItemBodyInner,
  WidgetItemHeader,
  WidgetItemHeadline,
  WidgetItemHGroup
} from '$styles/panel';

interface LayerLegendCommonProps {
  id: string;
  title: string;
  description: string;
}

interface LegendSwatchProps {
  hasHelp?: boolean;
  stops: string | string[];
}

interface LayerLegendContainerProps {
  children: ReactNode | ReactNode[];
}

const makeGradient = (stops: string[]) => {
  if (stops.length === 1) return stops[0];
  const d = 100 / (stops.length - 1);
  const steps = stops.map((s, i) => `${s} ${i * d}%`);
  return `linear-gradient(to right, ${steps.join(', ')})`;
};

const printLegendVal = (val: string | number) => {
  const number = Number(val);
  if (isNaN(number)) return val;

  if (number === 0) return 0;

  if (Math.abs(number) < 9999 && Math.abs(number) > 0.0009) {
    return formatThousands(number, { decimals: 3 });
  } else {
    return formatAsScientificNotation(number, 2);
  }
};

const formatTooltipValue = (rawVal, unit) => {
  if (rawVal === 0) return 0;

  let value;

  if (Math.abs(rawVal) < 9999 && Math.abs(rawVal) > 0.0009) {
    value = round(rawVal, 3);
  } else {
    value = formatAsScientificNotation(rawVal, 2);
  }

  return unit?.label ? `${value} ${unit.label}` : value;
};

export const LegendContainer = styled.div`
  position: absolute;
  z-index: 8;
  bottom: ${variableGlsp()};
  right: ${variableGlsp()};
  display: flex;
  flex-flow: column nowrap;
  box-shadow: ${themeVal('boxShadow.elevationB')};
  border-radius: ${themeVal('shape.rounded')};
  background-color: ${themeVal('color.surface')};

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
`;

const LayerLegendSelf = styled.div`
  display: flex;
  flex-flow: column nowrap;
  width: 16rem;
  border-bottom: 1px solid ${themeVal('color.base-100')};

  ${WidgetItemHeader} {
    padding: ${variableGlsp(0.25, 0.5)};
  }

  &:only-child {
    ${WidgetItemHeader} {
      padding: ${variableGlsp(0.5)};
    }
    border-bottom: 0;
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

    .unit {
      width: 100%;
      text-align: center;
    }
  }
`;

const LegendSwatch = styled.span<LegendSwatchProps>`
  /* position is needed to ensure that the layerX on the event is relative to
    this element */
  position: relative;
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
  min-height: 32px;
  max-height: 120px;
  overflow-y: auto;
  overscroll-behavior: none;
  .scroll-inner {
    padding: ${variableGlsp(0.5, 0.75)};
  }
  .shadow-bottom {
    border-radius: ${themeVal('shape.rounded')};
  }
`;

export function LayerLegend(
  props: LayerLegendCommonProps & (LayerLegendGradient | LayerLegendCategorical)
) {
  const { id, type, title, description } = props;

  return (
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
              unit={props.unit}
              min={props.min}
              max={props.max}
            />
          )}
        </WidgetItemHeader>
      )}
      renderBody={() => (
        <LegendBody>

            <div className='scroll-inner'>
              {description || <p>No info available for this layer.</p>}
            </div>
          
        </LegendBody>
      )}
    />
  );
}

export function LayerLegendContainer(props: LayerLegendContainerProps) {
  return (
    <LegendContainer>
      <AccordionManager>{props.children}</AccordionManager>
    </LegendContainer>
  );
}

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
  const { stops, min, max, unit } = props;

  const [hoverVal, setHoverVal] = useState(0);

  const moveListener = useCallback(
    (e) => {
      const width = e.nativeEvent.target.clientWidth;
      const scale = scaleLinear()
        .domain([0, width])
        .range([Number(min), Number(max)]);
      setHoverVal(scale(e.nativeEvent.layerX));
    },
    [min, max]
  );

  const hasNumericLegend = !isNaN(Number(min) + Number(max));
  const tipText = formatTooltipValue(hoverVal, unit);

  return (
    <LegendList>
      <dt>
        <Tip
          disabled={!hasNumericLegend}
          content={tipText}
          followCursor='horizontal'
          plugins={[followCursor]}
        >
          <LegendSwatch stops={stops} onMouseMove={moveListener}>
            {stops[0]} to {stops[stops.length - 1]}
          </LegendSwatch>
        </Tip>
      </dt>
      <dd>
        <span>{printLegendVal(min)}</span>
        {unit?.label && <span className='unit'>{unit.label}</span>}
        <span>{printLegendVal(max)}</span>
      </dd>
    </LegendList>
  );
}
