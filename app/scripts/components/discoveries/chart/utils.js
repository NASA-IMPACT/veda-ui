import { interpolateViridis } from 'd3-scale-chromatic';

const fileExtensionRegex = /(?:\.([^.]+))?$/;

const chartMargin = { top: 50, right: 10, bottom: 100, left: 60 };
const itemHeight = 20;
const legendConfig = [
  {
    anchor: 'bottom',
    direction: 'row',
    justify: false,
    translateX: 0,
    translateY: chartMargin.bottom - itemHeight,
    itemsSpacing: 0,
    itemDirection: 'left-to-right',
    itemWidth: 70,
    itemHeight: itemHeight,
    itemOpacity: 0.75,
    symbolSize: 12,
    symbolShape: 'square',
    symbolBorderColor: 'rgba(0, 0, 0, .5)'
  }
];
const chartTheme = {
  grid: {
    line: {
      stroke: '#efefef',
      strokeWidth: 1
    }
  }
};

function getColors(steps) {
  return new Array(steps).fill(0).map((e, idx) => {
    return interpolateViridis(idx / steps);
  });
}

function getBottomAxis(dateFormat, isSmallScreen) {
  // nivo's limit for ticknum:  https://nivo.rocks/guides/axes/
  const tickNum = isSmallScreen ? 3 : 8;
  return {
    tickValues: tickNum,
    tickSize: 5,
    tickPadding: 5,
    format: dateFormat
  };
}

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
  chartMargin,
  chartTheme,
  itemHeight,
  fileExtensionRegex,
  legendConfig,
  getFormattedData,
  getBottomAxis,
  getColors
};
