import React, { RefObject, useState, useEffect, useCallback } from 'react';
import FileSaver from 'file-saver';
import { Button } from '@devseed-ui/button';

import {
  chartAspectRatio,
  brushHeight
} from '$components/common/chart/constant';

const URL = window.URL || window.webkitURL || window;
const chartPNGPadding = 20;
const PNGWidth = 800 - chartPNGPadding * 2;

const brushAreaHeight = brushHeight * 1.6;
const PNGHeight = PNGWidth / chartAspectRatio - brushAreaHeight;

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

export function getLegendSVG(legendsString: string) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.innerHTML = legendsString;
  return svg;
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

interface ChartToPNGProps {
  svgWrapperRef: RefObject<HTMLDivElement>;
  legendSvgString: string;
}

const useChartToPNG = (props: ChartToPNGProps) => {
  const { svgWrapperRef, legendSvgString } = props;
  const [zoomRatio, setZoomRatio] = useState(1);
  const [chartImageLoaded, setChartImageLoaded] = useState(false);
  const [legendImageLoaded, setLegendImageLoaded] = useState(false);

  const [chartImage] = useState(new Image());
  const [legendImage] = useState(new Image());

  const [chartImageUrl, setChartImageUrl] = useState('');

  useEffect(() => {
    const svgWrapper = svgWrapperRef.current;
    if (!svgWrapper) return;

    // Extract SVG element from svgRef (div wrapper around chart SVG)

    const svg = svgWrapper.container.getElementsByTagName('svg')[0];
    // Scale up/down the chart to make it width 800px
    const originalSVGWidth = svg.getAttribute('width');
    setZoomRatio(PNGWidth / originalSVGWidth);

    const clonedSvgElement = svg.cloneNode(true);
    clonedSvgElement.setAttribute('width', PNGWidth);
    clonedSvgElement.setAttribute('height', PNGHeight);

    const legendSVG = getLegendSVG(legendSvgString);

    const chartUrl = getDataURLFromSVG(clonedSvgElement);
    const legendUrl = getDataURLFromSVG(legendSVG);

    chartImage.src = chartUrl;
    legendImage.src = legendUrl;

    chartImage.onload = () => {
      setChartImageLoaded(true);
    };
    legendImage.onload = () => {
      setLegendImageLoaded(true);
    };
  }, [svgWrapperRef, legendSvgString, chartImage, legendImage]);

  useEffect(() => {
    if (!chartImageLoaded || !legendImageLoaded) return;
    const c = document.createElement('canvas');
    const canvasWidth = PNGWidth + chartPNGPadding * 2;
    const canvasHeight = PNGHeight + chartPNGPadding * 2;
    c.width = canvasWidth;
    c.height = canvasHeight;

    const ctx = c.getContext('2d');
    if (ctx) {
      // Draw white background
      ctx.rect(0, 0, canvasWidth, canvasHeight);
      ctx.fillStyle = 'white';
      ctx.fill();

      // Draw chart (crop out brush part)
      ctx.drawImage(
        chartImage,
        0,
        0,
        PNGWidth,
        PNGHeight - brushAreaHeight * zoomRatio,
        0,
        chartPNGPadding,
        PNGWidth,
        PNGHeight - brushAreaHeight * zoomRatio
      );
      // Draw legend
      ctx.drawImage(
        legendImage,
        0,
        0,
        legendImage.width,
        legendImage.height,
        canvasWidth - legendImage.width,
        PNGHeight - brushAreaHeight * zoomRatio + 20,
        legendImage.width,
        legendImage.height
      );

      // export it as jpg dataurl
      const jpg = c.toDataURL('image/jpg');
      setChartImageUrl(jpg);
    }
  }, [chartImageLoaded, legendImageLoaded, chartImage, legendImage, zoomRatio]);

  return chartImageUrl;
};

export default function ExportPNGButton(props: ChartToPNGProps) {
  const { svgWrapperRef, legendSvgString } = props;
  const chartImageUrl = useChartToPNG({ svgWrapperRef, legendSvgString });
  const debug = false;
  const handleDownload = useCallback(() => {
    FileSaver.saveAs(chartImageUrl, 'chart-' + Date.now() + '.jpg');
  }, [chartImageUrl]);
  return (
    <div>
      <Button type='submit' variation='primary-fill' onClick={handleDownload}>
        <span>Export as PNG</span>
      </Button>
      {debug && <img src={chartImageUrl} />}
    </div>
  );
}
