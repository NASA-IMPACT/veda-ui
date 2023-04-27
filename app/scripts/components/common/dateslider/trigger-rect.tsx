import React, { useEffect, useMemo, useRef } from 'react';
import { ScaleLinear, select, ZoomBehavior } from 'd3';

import { DateSliderDataItem } from './constants';

interface TriggerRectProps {
  onDataOverOut: (result: { hover: boolean; date: Date | null }) => void;
  onDataClick: (result: { date: Date }) => void;
  data: DateSliderDataItem[];
  x: ScaleLinear<number, number, never>;
  zoomXTranslation: number;
  width: number;
  height: number;
  zoomBehavior: ZoomBehavior<SVGRectElement, unknown>;
}

interface Point {
  x: number;
  y: number;
}

interface HotZone extends Point {
  date: Date;
  radius: number;
}

function dist(p1: Point, p2: Point) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function getHotZone(zones: HotZone[], mouse) {
  return zones.find(
    (z) => dist(z, { x: mouse.layerX, y: mouse.layerY }) <= z.radius
  );
}

export default function TriggerRect(props: TriggerRectProps) {
  const {
    onDataOverOut,
    onDataClick,
    width,
    height,
    data,
    x,
    zoomXTranslation,
    zoomBehavior
  } = props;

  const elRef = useRef<SVGRectElement>(null);
  const hoverDataRef = useRef(false);

  // Since we're applying the zoom behavior on an invisible trigger rect, it
  // swallows all mouse events. To be able to handle a hover state or even a
  // click on a data point we create a list of coordinates for where the data
  // is, and then check if a mouse event is within a given radius of them.
  const dataHotZones = useMemo(() => {
    const dataList = data.filter((d) => d.hasData);
    return dataList.map<HotZone>((d) => ({
      date: d.date,
      x: x(d.index) + zoomXTranslation,
      y: 12,
      radius: 8
    }));
  }, [data, x, zoomXTranslation]);

  useEffect(() => {
    select(elRef.current)
      .call(zoomBehavior)
      .on('dblclick.zoom', null)
      .on('wheel.zoom', (event) => {
        event.preventDefault();
        zoomBehavior.translateBy(select(event.target), event.wheelDelta, 0);
      });
  }, [zoomBehavior, x]);

  useEffect(() => {
    select(elRef.current)
      .on('click', (event) => {
        const zone = getHotZone(dataHotZones, event);
        if (zone) {
          onDataClick({ date: zone.date });
        }
      })
      .on('mousemove', (event) => {
        const zone = getHotZone(dataHotZones, event);
        const currHover = !!zone;
        const prevHover = hoverDataRef.current;

        if (currHover !== prevHover) {
          hoverDataRef.current = currHover;
          onDataOverOut({
            hover: currHover,
            date: currHover ? zone.date : null
          });
        }
      })
      .on('mouseout', () => {
        onDataOverOut({
          hover: false,
          date: null
        });
      });
  }, [dataHotZones, onDataClick, onDataOverOut]);

  return (
    <rect
      className='trigger-rect'
      ref={elRef}
      fillOpacity={0}
      fill='red'
      width={width}
      height={height}
    />
  );
}
