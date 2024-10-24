import { IControl } from 'mapbox-gl';
import React, { ReactNode, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { useControl } from 'react-map-gl';
import { useTheme, ThemeProvider } from 'styled-components';

export default function useThemedControl(
  renderFn: () => ReactNode,
  opts?: any
) {
  const theme = useTheme();
  const elementRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<ReturnType<typeof createRoot> | null>(null);

  // Define the control methods and its lifecycle
  class ThemedControl implements IControl {
    onAdd() {
      const el = document.createElement('div');
      el.className = 'mapboxgl-ctrl';
      elementRef.current = el;

      // Create a root and render the component
      rootRef.current = createRoot(el);

      rootRef.current.render(
        <ThemeProvider theme={theme}>{renderFn() as any}</ThemeProvider>
      );

      return el;
    }

    onRemove() {
      // Cleanup if necessary.
      // Defer to next tick.
      setTimeout(() => {
        if (elementRef.current) {
          rootRef.current?.unmount();
          rootRef.current = null;
        }

        elementRef.current = null;
      }, 1);
    }
  }

  // Listen for changes in dependencies and re-render if necessary
  useEffect(() => {
    let isMounted = true;

    if (rootRef.current && elementRef.current && isMounted) {
      rootRef.current.render(
        <ThemeProvider theme={theme}>{renderFn() as any}</ThemeProvider>
      );
    }

    return () => {
      isMounted = false;
    };
  }, [renderFn, theme]);

  useControl(() => new ThemedControl(), opts);

  return null;
}
