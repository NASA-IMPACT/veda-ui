import React from 'react';
import styled from 'styled-components';
import { LayerLegendCategorical, LayerLegendGradient } from 'delta/thematics';

import { formatThousands } from '$utils/format';
import {
  glsp,
  themeVal,
  truncated,
  visuallyHidden
} from '@devseed-ui/theme-provider';
import { variableBaseType, variableGlsp } from '$styles/variable-utils';

import { Tip } from '../tip';

type LayerLegendCommonProps = {
  title: string;
};

type LegendSwatchProps = {
  hasHelp?: boolean;
  stops: string | string[];
};

const makeGradient = (stops: string[]) => {
  const d = 100 / stops.length - 1;
  const steps = stops.map((s, i) => `${s} ${i * d}%`);
  return `linear-gradient(to right, ${steps.join(', ')})`;
};

const printLegendVal = (val: string | number) =>
  typeof val === 'number' ? formatThousands(val, { shorten: true }) : val;

const LayerLegendSelf = styled.div`
  position: absolute;
  z-index: 8;
  bottom: ${variableGlsp()};
  right: ${variableGlsp()};
  display: flex;
  flex-flow: column nowrap;
  gap: ${glsp(0.5)};
  padding: ${variableGlsp(0.5, 1)};
  border-radius: ${themeVal('shape.rounded')};
  box-shadow: ${themeVal('boxShadow.elevationB')};
  background-color: ${themeVal('color.surface')};
  width: 18rem;

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
    transition: bottom 240ms ease-in-out, opacity 240ms ease-in-out ;
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

function LayerLegend(
  props: LayerLegendCommonProps & (LayerLegendGradient | LayerLegendCategorical)
) {
  const { title, type, stops } = props;

  // The categorical legend uses stops differently than the others.
  if (type === 'categorical') {
    return (
      <LayerLegendSelf>
        <LayerLegendTitle>{title}</LayerLegendTitle>
        <LegendList>
          {stops.map((stop) => (
            <React.Fragment key={stop.color}>
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
            </React.Fragment>
          ))}
        </LegendList>
      </LayerLegendSelf>
    );
  } else if (type === 'gradient') {
    const { min, max } = props;

    return (
      <LayerLegendSelf>
        <LayerLegendTitle>{title}</LayerLegendTitle>
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
      </LayerLegendSelf>
    );
  }

  return null;
}

export default LayerLegend;
