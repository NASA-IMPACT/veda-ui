import { IControl } from 'mapbox-gl';
import React, { useEffect, useMemo, useRef } from 'react';
import { Root, createRoot } from 'react-dom/client';
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
export function useMapboxControl(
  renderFn: (el: HTMLDivElement) => React.ReactNode,
  deps: any[] = []
) {
  const rootRef = useRef<Root>();
  const elementRef = useRef<HTMLDivElement>();
  const renderFnRef = useRef<() => void>(() => ({}));
  const theme = useTheme();

  // Use a ref so that we don't need to receive a memoized renderFn
  renderFnRef.current = () => {
    if (!rootRef.current) return;
    rootRef.current.render(
      <ThemeProvider theme={theme}>{renderFn(elementRef.current!)}</ThemeProvider>
    );
  };

  useEffect(() => {
    renderFnRef.current();
  }, deps);

  return useMemo(
    () => ({
      onAdd() {
        const el = document.createElement('div');
        el.className = 'mapboxgl-ctrl';
        elementRef.current = el;

        rootRef.current = createRoot(el);
        renderFnRef.current();

        return el as HTMLDivElement;
      },
      onRemove() {
        if (!rootRef.current) return;

        // Quicker way to access the node, instead of storing the created
        // element in a ref.
        // @ts-expect-error _internalRoot does not exist
        const node = rootRef.current._internalRoot.containerInfo;

        // Defer unmounting to next tick to avoid error:
        // Attempted to synchronously unmount a root while React was already
        // rendering.
        setTimeout(() => rootRef.current?.unmount(), 1);

        node.remove();
      }
    }),
    []
  ) as IControl;
}
