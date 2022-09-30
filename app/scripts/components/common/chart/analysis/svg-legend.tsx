import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// The legend on dashboard is consist of HTML elements to make the alignment easy
// However, SVG needs to be 'pure' to be exportable
// Creating SVG version of legend for exporting purpose
export function getLegendStringForScreenshot({ uniqueKeys, lineColors }) {
  const legendWidth = 80;
  const legendHeight = 40;

  return renderToStaticMarkup(
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={legendWidth * uniqueKeys.length}
      height={legendHeight}
    >
      {uniqueKeys
        .filter((k) => k.active)
        .map((entry, idx) => (
          <g
            key={entry.label}
            transform={`translate(${idx * legendWidth}, 10)`}
          >
            <rect width={12} height={12} fill={lineColors[idx]} />
            <text x={20} y={10}>
              {entry.label}
            </text>
          </g>
        ))}
    </svg>
  );
}
