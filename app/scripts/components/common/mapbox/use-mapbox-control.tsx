import mapboxgl from 'mapbox-gl';
import React, { useEffect, useMemo, useRef } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { ThemeProvider, useTheme } from 'styled-components';

/**
 * Since it is rendered by Mapbox this component becomes detached from
 * react. To ensure that is becomes reconnected the render method should be
 * called with props and state on componentDidUpdate.
 * The constructor takes a render function with signature (props, state) => {}
 *
 * @example
 * function () {
 *   const control = useMapboxControl(() => (
 *     <SomeControl
 *        name={props.name}
 *        active={isActive}
 *     />
 *   ), [props.name, isActive]);
 *
 *  // Add the control to mapbox
 * }
 */
export function useMapboxControl(renderFn, deps:Array<any> = []) {
  const containerRef = useRef<Element>();
  const renderFnRef = useRef<() => void>(() => ({}));
  const theme = useTheme();

  // Use a ref so that we don't need to receive a memoized renderFn
  renderFnRef.current = () => {
    if (!containerRef.current) return;

    render(
      <ThemeProvider theme={theme}>{renderFn()}</ThemeProvider>,
      containerRef.current
    );
  };

  useEffect(() => {
    renderFnRef.current();
  }, deps);

  return useMemo(
    () => ({
      onAdd() {
        containerRef.current = document.createElement('div');
        containerRef.current.className = 'mapboxgl-ctrl';
        renderFnRef.current();
        return containerRef.current as HTMLDivElement;
      },
      onRemove() {
        if (!containerRef.current) return;

        unmountComponentAtNode(containerRef.current);
        containerRef.current.parentNode?.removeChild(containerRef.current);
        containerRef.current = undefined;
      }
    }),
    []
  ) as mapboxgl.IControl;
}
