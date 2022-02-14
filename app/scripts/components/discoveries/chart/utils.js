import { interpolateViridis } from 'd3-scale-chromatic';

function getColors(steps) {
  return new Array(steps).fill(0).map((e, idx) => {
    return interpolateViridis(idx / steps);
  });
}

function getBottomAxis(dateFormat) {
  const tickNum = 10; // adjust per screen size
  return {
    tickValues: tickNum,
    tickSize: 5,
    tickPadding: 5,
    tickRotation: 0,
    format: dateFormat
  };
}

const legendConfig = [
  {
    anchor: 'bottom-right',
    direction: 'column',
    justify: false,
    translateX: 100,
    translateY: 0,
    itemsSpacing: 0,
    itemDirection: 'left-to-right',
    itemWidth: 80,
    itemHeight: 20,
    itemOpacity: 0.75,
    symbolSize: 12,
    symbolShape: 'square',
    symbolBorderColor: 'rgba(0, 0, 0, .5)',
    effects: [
      {
        on: 'hover',
        style: {
          itemBackground: 'rgba(0, 0, 0, .03)',
          itemOpacity: 1
        }
      }
    ]
  }
];

const fileExtensionRegex = /(?:\.([^.]+))?$/;
function getFormattedData({ data, idKey, xKey, yKey }) {
  const dataWId = data.reduce((acc, curr) => {
    if (!acc.find((e) => e.id === curr.County)) {
      const newEntry = {
        id: curr[idKey],
        data: []
      };
      acc.push(newEntry);
    }
    acc
      .find((e) => e.id === curr.County)
      .data.push({
        x: curr[xKey],
        y: curr[yKey]
      });
    return acc;
  }, []);
  return dataWId;
}

export {
  fileExtensionRegex,
  legendConfig,
  getFormattedData,
  getBottomAxis,
  getColors
};
