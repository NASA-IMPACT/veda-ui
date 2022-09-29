import React, { useState, RefObject, useCallback } from 'react';
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

interface ChartToImageProps {
  svgWrapperRef: RefObject<HTMLDivElement>;
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

function drawOnCanvas({ chartImage, legendImage, zoomRatio }) {
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

    const jpg = c.toDataURL('image/jpg');
    return jpg;
  }
}

function loadImageWithPromise(url: string) {
  return new Promise((resolve) => {
    const image = new Image();
    image.addEventListener('load', () => {
      resolve(image);
    });
    image.src = url;
  });
}

export async function exportImage({
  svgWrapperRef,
  legendSvgString
}: ChartToImageProps) {
  const svgWrapper = svgWrapperRef.current;
  if (!svgWrapper) return;

  // Extract SVG element from svgRef (div wrapper around chart SVG)

  const svg = svgWrapper.container.getElementsByTagName('svg')[0];
  // Scale up/down the chart to make it width 800px
  const originalSVGWidth = svg.getAttribute('width');
  const zoomRatio = PNGWidth / originalSVGWidth;

  const clonedSvgElement = svg.cloneNode(true);
  clonedSvgElement.setAttribute('width', PNGWidth);
  clonedSvgElement.setAttribute('height', PNGHeight);

  const legendSVG = getLegendSVG(legendSvgString);

  const chartUrl = getDataURLFromSVG(clonedSvgElement);
  const legendUrl = getDataURLFromSVG(legendSVG);

  const chartImage = await loadImageWithPromise(chartUrl);
  const legendImage = await loadImageWithPromise(legendUrl);

  return drawOnCanvas({ chartImage, legendImage, zoomRatio });
}

export default function ExportPNGButton(props: ChartToImageProps) {
  const { svgWrapperRef, legendSvgString } = props;
  const debug = false;
  // debug purpose
  const [imageUrl, setImageUrl] = useState<string | undefined>('');

  const handleDownload = useCallback(async () => {
    const chartImageUrl = await exportImage({
      svgWrapperRef,
      legendSvgString
    });
    setImageUrl(chartImageUrl);
    FileSaver.saveAs(chartImageUrl, 'chart-' + Date.now() + '.jpg');
  }, [svgWrapperRef, legendSvgString]);

  return (
    <div>
      <Button type='submit' variation='primary-fill' onClick={handleDownload}>
        <span>Export as PNG</span>
      </Button>
      {debug && <img src={imageUrl} />}
    </div>
  );
}
