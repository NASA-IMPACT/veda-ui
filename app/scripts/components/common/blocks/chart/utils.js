import { interpolateViridis } from 'd3-scale-chromatic';

export const fileExtensionRegex = /(?:\.([^.]+))?$/;

export const chartMargin = { top: 50, right: 10, bottom: 100, left: 60 };
export const itemHeight = 20;
export const itemWidth = 120;

function getLegendData({ data, width, itemWidth }) {
  const rowNum = Math.ceil((itemWidth * data.length) / width);
  const itemsPerRow = Math.floor(data.length / rowNum);
  return new Array(rowNum).fill(0).map((elem, idx) => ({
    anchor: 'bottom',
    data: data
      .filter(
        (e, dataIdx) =>
          itemsPerRow * idx <= dataIdx && dataIdx < itemsPerRow * (idx + 1)
      )
      .map((e, dataIdx) => ({
        id: e.id,
        label: e.id,
        color: getColors(data.length)[dataIdx + itemsPerRow * idx]
      })),
    direction: 'row',
    translateX: 0,
    translateY: itemHeight * (idx + 1) + 45,
    itemDirection: 'left-to-right',
    itemWidth,
    itemHeight: itemHeight,
    itemOpacity: 0.75,
    symbolSize: 12,
    symbolShape: 'square'
  }));
}

export const getLegendConfig = (data, isMediumUp) => {
  return getLegendData({ data, itemWidth, width: isMediumUp ? 600 : 450 });
};

export const chartTheme = {
  grid: {
    line: {
      stroke: '#efefef',
      strokeWidth: 1
    }
  }
};

export const getColors = function (steps) {
  return new Array(steps).fill(0).map((e, idx) => {
    return interpolateViridis(idx / steps);
  });
};

export const getBottomAxis = function (dateFormat, isLargeScreen) {
  // nivo's limit for ticknum:  https://nivo.rocks/guides/axes/
  const tickNum = isLargeScreen ? 8 : 3;
  return {
    tickValues: tickNum,
    tickSize: 5,
    tickPadding: 5,
    format: dateFormat
  };
};

export const getFormattedData = function ({ data, idKey, xKey, yKey }) {
  const dataWId = data.reduce((acc, curr) => {
    if (!acc.find((e) => e.id === curr[idKey])) {
      const newEntry = {
        id: curr[idKey],
        data: []
      };
      acc.push(newEntry);
    }
    acc
      .find((e) => e.id === curr[idKey])
      .data.push({
        x: curr[xKey],
        y: curr[yKey]
      });
    return acc;
  }, []);
  return dataWId;
};

export const getMinMax = function (data) {
  const allYVals = data.reduce((acc, curr) => {
    curr.data.map((e) => acc.push(e.y));
    return acc;
  }, []);
  return {
    minY: Math.min(...allYVals),
    maxY: Math.max(...allYVals)
  };
};
