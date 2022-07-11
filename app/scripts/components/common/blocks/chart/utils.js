import * as d3ScaleChromatic from 'd3-scale-chromatic';

export const fileExtensionRegex = /(?:\.([^.]+))?$/;
export const defaultChartMargin = { top: 50, right: 10, bottom: 100, left: 60 };

export const itemHeight = 20;
export const itemWidth = 115;
export const largeScreenItemNum = 5;
export const smallScreenItemNum = 3;
export const chartBottomPadding = 40;

export function getLegendConfig({ data, isMediumUp, colors, colorScheme }) {
  const width = isMediumUp ? itemWidth * 5 : itemWidth * 3;
  const rowNum = Math.ceil((itemWidth * data.length) / width);

  const itemsPerRow = isMediumUp ? largeScreenItemNum : smallScreenItemNum;
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
        color: colors
          ? colors[dataIdx]
          : getColors({ steps: data.length, colorScheme })[
              dataIdx + itemsPerRow * idx
            ]
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

export const chartTheme = {
  grid: {
    line: {
      stroke: '#efefef',
      strokeWidth: 1
    }
  }
};

function getInterpoateFunction(colorScheme) {
  const fnName = `interpolate${
    colorScheme[0].toUpperCase() + colorScheme.slice(1)
  }`;
  return d3ScaleChromatic[fnName];
}

export const getColors = function ({ steps, colorScheme }) {
  const colorFn = getInterpoateFunction(colorScheme);
  return new Array(steps).fill(0).map((e, idx) => {
    return colorFn(idx / steps);
  });
};

export const getBottomAxis = function ({
  dateFormat,
  isLargeScreen,
  xAxisLabel
}) {
  // nivo's limit for ticknum:  https://nivo.rocks/guides/axes/
  const tickNum = isLargeScreen ? 8 : 3;
  return {
    legend: xAxisLabel,
    legendOffset: 30,
    legendPosition: 'end',
    tickValues: tickNum,
    tickSize: 5,
    tickPadding: 5,
    format: dateFormat
  };
};

export const getLeftAxis = function (yAxisLabel) {
  return {
    legend: yAxisLabel,
    legendOffset: -(defaultChartMargin.left * 0.9),
    legendPosition: 'end'
  };
};

export const getFormattedData = function ({ data, idKey, xKey, yKey }) {
  let minY = 0;
  let maxY = 0;

  let dataToSort = [...data].sort((a, b) => {
    // sort by date (x axis)
    const dateGap = new Date(a[xKey]) - new Date(b[xKey]);
    return dateGap
      ? // sort by id key when date is the same
        dateGap
      : a[idKey].localeCompare(b[idKey], { sensitivity: 'base' });
  });

  const dataWId = dataToSort.reduce((acc, curr) => {
    if (!acc.find((e) => e.id === curr[idKey])) {
      const newEntry = {
        id: curr[idKey],
        data: [
          {
            x: curr[xKey],
            y: curr[yKey]
          }
        ]
      };
      acc.push(newEntry);
    } else
      acc
        .find((e) => e.id === curr[idKey])
        .data.push({
          x: curr[xKey],
          y: curr[yKey]
        });
    minY = Math.min(minY, curr[yKey]);
    maxY = Math.max(maxY, parseFloat(curr[yKey]));
    return acc;
  }, []);

  return {
    dataWId,
    minY,
    maxY
  };
};
