import React, { ReactNode, Fragment, useState, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { AccordionFold, AccordionManager } from '@devseed-ui/accordion';
import {
  glsp,
  themeVal,
  truncated,
  visuallyHidden
} from '@devseed-ui/theme-provider';
import {
  CollecticonCircleInformation,
  CollecticonChevronDown,
  CollecticonChevronUp
} from '@devseed-ui/collecticons';
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
import { LayerLegendCategorical, LayerLegendGradient, LayerLegendText} from '$types/veda';
import {
  divergingColorMaps,
  sequentialColorMaps,
  restColorMaps } from '$components/exploration/components/datasets/colorMaps';
import { DEFAULT_COLORMAP } from '$components/exploration/components/datasets/colormap-options';

interface LayerLegendCommonProps {
  id: string;
  title: string;
  description: string;
}

interface LegendSwatchProps {
  type: 'categorical' | 'gradient';
  hasHelp?: boolean;
  stops: string | string[];
}

interface LayerLegendContainerProps {
  children: ReactNode | ReactNode[];
}

interface LegendListProps {
  type: 'categorical' | 'gradient'
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



const LegendList = styled.dl<LegendListProps>`
  ${({ type }) => {
    if (type === 'gradient') {
      return css`
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
        justify-content: space-between;

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

        &:not(:first-of-type):not(:last-of-type) {
          ${visuallyHidden()}
        }
      }

      .unit {
        grid-row: 3;
        width: 100%;
        text-align: center;
        font-size: 0.75rem;
        line-height: 1rem;
        justify-content: center;
      }
    `;
    }
    else if (type === 'categorical') {
      return css`
        display: flex;
        flex-direction: column;
        gap: ${glsp(0.25)};

        dt, dd {
          margin: 0;
          padding: 0;
        }

        dt {
          display: flex;
          align-items: flex-start;
          gap: ${glsp(0.25)};
        }
      
        dt > span {
          display: block;
          max-width: calc(100% - 1rem);
        } 

        dt > *:first-child {
          margin-top: 0.5rem;
        }

        dd {
          font-size: 0.75rem;
          line-height: 1rem;
          margin: 0 0 0 calc(1rem + ${glsp(0.25)});
        } 
        
        overflow-y: scroll;
        overscroll-behavior: none;
        max-height: 300px;  
        scrollbar-color: transparent transparent;
      `;
    }
  }
}`;

const LegendSwatch = styled.span<LegendSwatchProps>`
  /* position is needed to ensure that the layerX on the event is relative to
    this element */
  position: relative;
  display: ${({ type }) => (type === 'gradient' ? 'block' : 'inline-block')};
  font-size: 0;
  height: 0.5rem;
  width: ${({ type }) => (type === 'gradient' ? 'auto' : '1rem')};
  border-radius: ${themeVal('shape.rounded')};
  background: ${({ stops }) =>
    typeof stops === 'string' ? stops : makeGradient(stops)};
  margin: 0 0 ${glsp(1 / 8)} 0;
  margin-right: ${({ type }) => (type === 'gradient' ? '0' : '0.5rem')};
  box-shadow: inset 0 0 0 1px ${themeVal('color.base-100a')};
  cursor: ${({ hasHelp }) => (hasHelp ? 'help' : 'auto')};
  flex-shrink: 0; 
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
  props: LayerLegendCommonProps & (LayerLegendGradient | LayerLegendCategorical | LayerLegendText)
) {
  const { id, type, title, description } = props;
  const [isChevToggleExpanded, setIsChevToggleExpanded] = useState(false);
  const chevToggleExpanded = () => {
    setIsChevToggleExpanded((prev) => !prev);
  };

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
              {
                type === 'categorical' && (
                  <ToolbarIconButton
                    variation='base-text'
                    active={isChevToggleExpanded}
                    onClick={chevToggleExpanded}
                  >
                    {isChevToggleExpanded ? (
                    <CollecticonChevronUp
                    title='Expand Legend'
                    meaningful
                    />
                  ) : (
                    <CollecticonChevronDown
                    title='Collapse Legend'
                    meaningful
                    />
                  )}
                  </ToolbarIconButton>
                )
              }
            </Toolbar>
          </WidgetItemHGroup>
          {type === 'categorical' && (
            <div style={{ cursor: 'pointer' }}>
              {renderSwatchLine(props as LayerLegendCategorical)}
            </div>
          )}
          {type === 'categorical' && !isChevToggleExpanded && (
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

export function LayerCategoricalGraphic(props: LayerLegendCategorical) {
  const { stops } = props;

  const renderLegendItems = () =>
    stops.map((stop) => (
      <Fragment key={`legend-item-${stop.color}`}>
        <dt>
          <LegendSwatch
            type='categorical'
            stops={stop.color}
          />
          <span>
            {stop.label}
          </span>
        </dt>
      </Fragment>
    )
  );

  return (
    <LegendList type='categorical'>
      {renderLegendItems()}
    </LegendList>
  );
}

interface SwatchSegmentProps {
  color: string;
}

const SwatchContainer = styled.div`
  display: flex;
  border-radius: ${themeVal('shape.rounded')};
  overflow: hidden;
  height: 0.5rem;
  width: 100%;
`;

const SwatchSegment = styled.div<SwatchSegmentProps>`
  background: ${({ color }) => color};
  flex: 1;
`;

export const renderSwatchLine = (props: LayerLegendCategorical) => {
  const { stops } = props;

  return (
    <SwatchContainer>
      {stops.map((stop) => (
        <Tip
          key={`${stop.color}-${stop.label}`}
          content={stop.label}
        >
          <SwatchSegment color={stop.color} />
        </Tip>
      ))}
    </SwatchContainer>
  );
};

export const LayerGradientGraphic = (props: LayerLegendGradient) => {
  const { stops, min, max, unit } = props;
  const [hoverVal, setHoverVal] = useState(0);

  const moveListener = useCallback(
    (e) => {
      const target = e.nativeEvent.target;
      const boundingRect = target.getBoundingClientRect();
      const offsetX = e.nativeEvent.clientX - boundingRect.left;
      const width = boundingRect.width;

      const scale = scaleLinear()
        .domain([0, width])
        .range([Number(min), Number(max)]);

      setHoverVal(Math.max(Number(min), Math.min(Number(max), scale(offsetX))));
    },
    [min, max]
  );

  const hasNumericLegend = !isNaN(Number(min) + Number(max));
  const tipText = formatTooltipValue(hoverVal, unit);

  return (
    <LegendList type='gradient'>
      <dt>
        <Tip
          disabled={!hasNumericLegend}
          content={tipText}
          followCursor='horizontal'
          plugins={[followCursor]}
        >
          <LegendSwatch type='gradient' stops={stops} onMouseMove={moveListener}>
            {stops[0]} to {stops[stops.length - 1]}
          </LegendSwatch>
        </Tip>
      </dt>
      <dd>
        <span>{printLegendVal(min)}</span>
        <span>{printLegendVal(max)}</span>
      </dd>
      {unit?.label && <dd className='unit'>{unit.label}</dd>}
    </LegendList>
  );
};

export const LayerGradientColormapGraphic = (props: Omit<LayerLegendGradient, 'type'>) => {
  const { colorMap, stops: defaultStops, ...otherProps } = props;

  const processedStops = React.useMemo(() => {
    if (!colorMap) return defaultStops;

    const { foundColorMap, isReversed } = findColormapByName(colorMap);
    const stops = Object.values(foundColorMap)
      .filter(value => Array.isArray(value) && value.length === 4)
      .map(value => `rgba(${(value as number[]).join(',')})`);

    return isReversed ? [...stops].reverse() : stops;
  }, [colorMap, defaultStops]);

  return <LayerGradientGraphic type='gradient' {...otherProps} stops={processedStops} />;
};

export const findColormapByName = (name: string) => {
  const isReversed = name.toLowerCase().endsWith('_r');
  const baseName = isReversed ? name.slice(0, -2).toLowerCase() : name.toLowerCase();
  const colormap = sequentialColorMaps[baseName] ?? divergingColorMaps[baseName] ?? restColorMaps[baseName];

  if (!colormap) {
    const defaultColormap = sequentialColorMaps[DEFAULT_COLORMAP.toLowerCase()] ?? divergingColorMaps[DEFAULT_COLORMAP.toLowerCase()];
    return { foundColorMap: {...defaultColormap}, isReversed: false };
  }

  return { foundColorMap: {...colormap}, isReversed };
};