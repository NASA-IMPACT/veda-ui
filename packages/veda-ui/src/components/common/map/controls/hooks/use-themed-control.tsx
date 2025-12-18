import { IControl } from 'mapbox-gl';
import React, { ReactNode, useState } from 'react';
import { createPortal } from 'react-dom';
import { useControl } from 'react-map-gl';
import { useTheme, ThemeProvider } from 'styled-components';

export default function useThemedControl(
  renderFn: () => ReactNode,
  opts?: any
) {
  const theme = useTheme();

  const [controlContainer, setControlContainer] = useState<HTMLElement | null>(
    null
  );
  // Define the control methods and its lifecycle
  class ThemedControl implements IControl {
    onAdd() {
      const div = document.createElement('div');
      div.className = 'mapboxgl-ctrl';

      // Store the DOM node so you can render into it:
      setControlContainer(div);
      return div;
    }

    onRemove() {
      // Cleanup if necessary.
    }
  }

  useControl(() => new ThemedControl(), opts);

  // use createPortal to render React content into controlContainer once it becomes available:
  return controlContainer !== null ? (
    createPortal(
      <ThemeProvider theme={theme}>{renderFn()}</ThemeProvider>,
      controlContainer
    )
  ) : (
    <></>
  );
}
