import { RefObject, Component } from 'react';
import FileSaver from 'file-saver';
import { unparse } from 'papaparse';
import {
  chartAspectRatio,
  brushHeight
} from '$components/common/chart/constant';
import { TimeseriesDataUnit } from '$components/analysis/results/timeseries-data';
import { DataMetric } from '$components/analysis/results/analysis-head-actions';

const URL = window.URL;

const chartPNGPadding = 20;
// Export in full HD.
const PNGWidth = 1920 - chartPNGPadding * 2;

const titleAreaHeight = 64;
const brushAreaHeight = brushHeight + 40;
const chartExportHeight = PNGWidth / chartAspectRatio - brushAreaHeight;
const chartExportWidth = PNGWidth;

// Rechart does not export the type for wrapper component (CategoricalChartWrapper)
// Working around
export interface ChartWrapperRef extends Component {
  container: HTMLElement;
}

export interface ChartToImageProps {
  title: string;
  svgWrapperRef: RefObject<ChartWrapperRef>;
  legendSvgString: string;
}

function getFontStyle() {
  // font url needs to be encoded to be embedded into svg
  const encodedFontUrl = window.btoa('/open-sans.woff2');
  const fontStyleAsString = `@font-face { font-family: "Open Sans",sans-serif; 
  src: url("data:application/font-woff;charset=utf-8;base64,${encodedFontUrl}") format('woff2');}`;

  const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(fontStyleAsString));
  return style;
}

function getLegendSVG(legendsString: string) {
  const wrapperDiv = document.createElement('div');
  wrapperDiv.innerHTML = legendsString;
  return wrapperDiv.firstChild;
}

function getDataURLFromSVG(svgElement: SVGElement) {
  // Inject font styles to SVG
  const fontNode = getFontStyle();
  svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svgElement.setAttribute(
    'style',
    `font-family:"Open Sans",sans-serif;font-size:14px;font-style:normal;`
  );
  svgElement.appendChild(fontNode);

  const blob = new Blob([svgElement.outerHTML], {
    type: 'image/svg+xml;charset=utf-8'
  });
  const blobURL = URL.createObjectURL(blob);
  return blobURL;
}

interface DrawOnCanvasParams {
  chartImage: HTMLImageElement;
  legendImage: HTMLImageElement;
  zoomRatio: number;
  title: string;
}

function drawOnCanvas({
  chartImage,
  legendImage,
  zoomRatio,
  title
}: DrawOnCanvasParams) {
  const c = document.createElement('canvas');
  const legendWidth = legendImage.width * zoomRatio;
  const legendHeight = legendImage.height * zoomRatio;

  // Height of all elements and the padding between them.
  const PNGHeight =
    titleAreaHeight + chartExportHeight + legendHeight + chartPNGPadding * 2;

  const canvasWidth = PNGWidth + chartPNGPadding * 2;
  const canvasHeight = PNGHeight + chartPNGPadding * 2;
  c.width = canvasWidth;
  c.height = canvasHeight;

  // Current Y coord where to start drawing
  let currentY = chartPNGPadding;

  const ctx = c.getContext('2d');

  if (!ctx) throw new Error('Failed to get canvas context to export chart.');

  // Draw white background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // DEBUG AREAS
  // 🎯 Uncomment to view areas.
  // ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
  // ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
  // // - title area
  // ctx.fillRect(chartPNGPadding, currentY, PNGWidth, titleAreaHeight);
  // currentY += titleAreaHeight + chartPNGPadding;
  // // - chart area
  // ctx.fillRect(chartPNGPadding, currentY, PNGWidth, chartExportHeight);
  // currentY += chartExportHeight + chartPNGPadding;
  // // - legend area
  // ctx.fillRect(chartPNGPadding, currentY, PNGWidth, legendHeight);
  // currentY = chartPNGPadding;
  // END DEBUG AREAS

  // Draw the title.
  ctx.fillStyle = 'black';
  ctx.font = 'bold 48px "Open Sans"';
  ctx.textAlign = 'center';

  ctx.fillText(title, canvasWidth / 2, currentY + 48);

  currentY += titleAreaHeight + chartPNGPadding;

  // Draw chart (crop out brush part)
  ctx.drawImage(
    chartImage,
    0,
    0,
    chartImage.width,
    chartImage.height - brushAreaHeight * zoomRatio,
    0,
    currentY,
    chartExportWidth,
    chartExportHeight
  );

  currentY += chartExportHeight + chartPNGPadding;

  // Draw legend
  ctx.drawImage(
    legendImage,
    0,
    0,
    legendImage.width,
    legendImage.height,
    PNGWidth - legendWidth,
    currentY,
    legendWidth,
    legendHeight
  );

  const png = c.toDataURL();
  return png;
}

function loadImageWithPromise(url: string) {
  return new Promise<HTMLImageElement>((resolve) => {
    const image = new Image();
    image.addEventListener('load', () => {
      resolve(image);
    });
    image.src = url;
  });
}

export async function exportImage({
  title,
  svgWrapperRef,
  legendSvgString
}: ChartToImageProps) {
  const svgWrapper = svgWrapperRef.current;

  // Extract SVG element from svgRef (div wrapper around chart SVG)
  const svg = svgWrapper?.container.getElementsByTagName('svg')[0] as
    | SVGSVGElement
    | undefined;

  // Scale up/down the chart to make it width 800px
  if (svg) {
    const originalSVGWidth = parseInt(svg.getAttribute('width') ?? '800');
    const zoomRatio = PNGWidth / originalSVGWidth;

    const clonedSvgElement = svg.cloneNode(true) as SVGElement;
    clonedSvgElement.setAttribute('width', chartExportWidth.toString());
    clonedSvgElement.setAttribute('height', chartExportHeight.toString());
    clonedSvgElement.querySelector('g.recharts-brush')?.remove();

    const legendSVG = getLegendSVG(legendSvgString) as SVGElement;

    const chartUrl = getDataURLFromSVG(clonedSvgElement);
    const legendUrl = getDataURLFromSVG(legendSVG);

    const chartImage = await loadImageWithPromise(chartUrl);
    const legendImage = await loadImageWithPromise(legendUrl);

    return drawOnCanvas({ chartImage, legendImage, zoomRatio, title });
  } else {
    throw Error('No SVG specified');
  }
}

export function exportCsv(
  filename: string,
  data: TimeseriesDataUnit[],
  startDate: Date,
  endDate: Date,
  activeMetrics: DataMetric[]
) {
  const startTimestamp = +startDate;
  const endTimestamp = +endDate;
  const filtered = data.filter((row) => {
    const timestamp = +new Date(row.date);
    return timestamp >= startTimestamp && timestamp <= endTimestamp;
  });
  const csv = unparse(filtered, {
    columns: ['date', ...activeMetrics.map((m) => m.id)]
  });
  FileSaver.saveAs(
    new Blob([csv], { type: 'text/csv;charset=utf-8' }),
    `${filename}.csv`
  );
}
