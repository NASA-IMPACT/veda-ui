import React, {
  MutableRefObject,
  forwardRef,
  useEffect,
  useState
} from 'react';
import { createPortal } from 'react-dom';
import styled, {css} from 'styled-components';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift
} from '@floating-ui/react';
import { bisector, ScaleTime, sort } from 'd3';
import { format } from 'date-fns';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

import { AnalysisTimeseriesEntry, TimeDensity, TimelineDatasetSuccess } from '../types.d.ts';
import { FADED_TEXT_COLOR, TEXT_TITME_BG_COLOR } from '../constants';
import { DataMetric } from './datasets/analysis-metrics';

import { getNumForChart } from '$components/common/chart/utils';

function timeDensityFormat(
  date: Date | undefined | null,
  timeDensity: TimeDensity
) {
  if (!date) return 'no date';

  switch (timeDensity) {
    case TimeDensity.YEAR:
      return format(date, 'yyyy');
    case TimeDensity.MONTH:
      return format(date, 'yyyy/MM');
    case TimeDensity.DAY:
      return format(date, 'yyyy/MM/dd');
    default:
      return 'no date';
  }
}

const MetricList = styled.ul`
  display: flex;
  flex-flow: column;
  list-style: none;
  margin: 0 -${glsp()};
  padding: 0;
  padding-top: ${glsp(0.25)};
  gap: ${glsp(0.25)};
  > li {
    padding: ${glsp(0, 1)};
  }
`;
const MetricLi = styled.li`
  display: flex;
  justify-content: space-between;
`;

const MetricItem = styled.p<{ metricThemeColor: string }>`
  display: flex;
  gap: ${glsp(0.5)};
  font-size: 0.875rem;

  &::before {
    content: '';
    width: 0.5rem;
    height: 0.5rem;
    background: ${({ metricThemeColor }) =>
      themeVal(`color.${metricThemeColor}` as any)};
    border-radius: ${themeVal('shape.ellipsoid')};
    align-self: center;
  }
`;

const fadedtext = css`
  color: ${FADED_TEXT_COLOR};
`;

const TitleBox = styled.div`
  background-color: ${TEXT_TITME_BG_COLOR};
  ${fadedtext};
  padding: ${glsp(0.5)};
  font-size: 0.75rem;
`;

const ContentBox = styled.div`
  padding: ${glsp(0.5)};
  font-size: 0.75rem;
`;
const MetaBox = styled.div`
  display: flex;
  align-items: center;
  gap: ${glsp(1)};
`;

const UnitBox = styled.div`
  ${fadedtext};
`;

type DivProps = JSX.IntrinsicElements['div'];
interface DatasetPopoverProps extends DivProps {
  data: AnalysisTimeseriesEntry;
  activeMetrics: DataMetric[];
  timeDensity: TimeDensity;
  dataset: TimelineDatasetSuccess;
}

function DatasetPopoverComponent(
  props: DatasetPopoverProps,
  ref: MutableRefObject<HTMLDivElement>
) {
  const { data, dataset, activeMetrics, timeDensity, style, ...rest } = props;
  
  // Check if there is no data to show
  const hasData = activeMetrics.some(
    (metric) => typeof data[metric.id] === 'number'
  );

  if (!hasData) return null;

  return createPortal(
    <div ref={ref} style={{...style, padding: 0, gap: 0}} {...rest}>
      <TitleBox>{dataset.data.name}</TitleBox>
      <ContentBox>
        <MetaBox style={{display: 'flex'}}>
          <strong>{timeDensityFormat(data.date, timeDensity)}</strong>
          <UnitBox>{dataset.data.info?.unit}</UnitBox>
        </MetaBox>
        <MetricList>
          {activeMetrics.map((metric) => {
            const dataPoint = data[metric.id];
            return typeof dataPoint !== 'number' ? null : (
              <MetricLi key={metric.id}>
                <MetricItem metricThemeColor={metric.themeColor}>
                  {metric.chartLabel}
                </MetricItem>
                <strong>{getNumForChart(dataPoint)}</strong>
              </MetricLi>
            );
          })}
        </MetricList>
      </ContentBox>
    </div>,
    document.body
  );
}

const DatasetPopoverRef = forwardRef<HTMLDivElement, DatasetPopoverProps>(
  DatasetPopoverComponent
);

export const DatasetPopover = styled(DatasetPopoverRef)`
  width: max-content;
  position: absolute;
  top: 0;
  left: 0;
  background: ${themeVal('color.surface')};
  padding: ${glsp()};
  border-radius: ${themeVal('shape.rounded')};
  box-shadow: ${themeVal('boxShadow.elevationD')};
  pointer-events: none;
  z-index: ${themeVal('zIndices.popover' as any)};
  display: flex;
  flex-flow: column;
  gap: ${glsp()};
`;

function getClosestDataPoint(
  data?: AnalysisTimeseriesEntry[],
  positionDate?: Date
) {
  if (!positionDate || !data) return;

  const dataSorted = sort(data, (a, b) => a.date.getTime() - b.date.getTime());

  const bisect = bisector<AnalysisTimeseriesEntry, Date>((d) => d.date).left;

  const index = bisect(dataSorted, positionDate);

  const e0 = dataSorted[index - 1] as AnalysisTimeseriesEntry | undefined;
  const e1 = dataSorted[index] as AnalysisTimeseriesEntry | undefined;

  if (!e0) return e1!;
  if (!e1) return e0;

  // Check what date is closer to the position (hovered) date.
  const pTime = positionDate.getTime();
  const closest =
    pTime - e0.date.getTime() > e1.date.getTime() - pTime ? e1 : e0;

  return closest;
}

interface InteractionDataPointOptions {
  isHovering: boolean;
  xScaled?: ScaleTime<number, number>;
  containerWidth: number;
  layerX?: number;
  data?: AnalysisTimeseriesEntry[];
}

/**
 * Get the closest data point to the hovered position that:
 * 1) it's in the timeline viewport
 * 2) it's not too far from the hovered position (80px)
 * @returns data point or undefined
 */
export function getInteractionDataPoint(options: InteractionDataPointOptions) {
  const { isHovering, xScaled, containerWidth, layerX, data } = options;

  if (
    !isHovering ||
    !xScaled ||
    !containerWidth ||
    typeof layerX !== 'number' ||
    !data
  )
    return;

  // Get the closest data point to the hovered position.
  const closestDataPoint = getClosestDataPoint(data, xScaled.invert(layerX));

  // Get the X position of the closes data point to ensure that:
  // 1) it's in the timeline viewport
  // 2) it's not too far from the hovered position
  const closestDataPointPosition = closestDataPoint
    ? xScaled(closestDataPoint.date)
    : Infinity;

  const delta = Math.abs(layerX - closestDataPointPosition);

  const inView =
    closestDataPointPosition >= 0 &&
    closestDataPointPosition <= containerWidth &&
    delta <= 80;

  return inView ? closestDataPoint : undefined;
}

interface PopoverHookOptions {
  x?: number;
  y?: number;
  data?: AnalysisTimeseriesEntry;
  enabled?: boolean;
}

/**
 * Use a floating popover at the given position if there's data.
 * Uses React floating-ui library.
 * @param options 
 * @returns 
 */
export function usePopover(options: PopoverHookOptions) {
  const { x, y, data, enabled } = options;

  const inView = !!data;

  // We need an additional state to control the visibility of the popover
  // (besides the isHovering) because we need to have the virtual element set
  // before the popover is visible, otherwise the popover will appear positioned
  // incorrectly or a split second after the hover.
  const [_isVisible, setVisible] = useState(inView);
  const isVisible = enabled && _isVisible;

  const floating = useFloating({
    placement: 'left',
    open: isVisible,
    onOpenChange: setVisible,
    middleware: [offset(10), flip(), shift({ padding: 16 })],
    whileElementsMounted: autoUpdate
  });

  const { refs, floatingStyles } = floating;

  // Use a virtual element for the position reference.
  // https://floating-ui.com/docs/virtual-elements
  useEffect(() => {
    if (!inView) {
      setVisible(false);
      return;
    }

    refs.setPositionReference({
      getBoundingClientRect() {
        return {
          width: 0,
          height: 0,
          x: x ?? 0,
          y: y ?? 0,
          top: y ?? 0,
          left: x ?? 0,
          right: x ?? 0,
          bottom: y ?? 0
        };
      }
    });
    setVisible(true);
  }, [refs, inView, x, y]);

  return {
    refs,
    isVisible,
    floatingStyles
  };
}
