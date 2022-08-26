import React, { useEffect, useRef } from 'react';
import { select, zoom } from 'd3';

import { useTimeseriesContext } from './context';

export function getZoomTranslateExtent(
  data,
  xScale
): [[number, number], [number, number]] {
  const lastDate = data.last.date;
  return [
    [0, 0],
    [xScale(lastDate) + 16, 0]
  ];
}

type TriggerRectProps = {
  onZoom: (event) => void;
};

export default function TriggerRect(props: TriggerRectProps) {
  const { onZoom } = props;
  const { width, height, data, x } = useTimeseriesContext();
  const elRef = useRef<SVGRectElement>(null);

  useEffect(() => {
    const element = elRef.current;

    const zoomBehavior = zoom<SVGRectElement, unknown>()
      .translateExtent(getZoomTranslateExtent(data, x))
      .on('zoom', onZoom);

    select(element)
      .call(zoomBehavior)
      .on('dblclick.zoom', null)
      .on('wheel.zoom', null);
  }, [onZoom, data, x]);

  return (
    <rect
      ref={elRef}
      fillOpacity={0}
      fill='red'
      width={width}
      height={height}
    />
  );
}
