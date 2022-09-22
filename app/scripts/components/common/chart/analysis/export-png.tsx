import React, { useRef, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import FileSaver from 'file-saver';
import { Button } from '@devseed-ui/button';

import {
  chartAspectRatio,
  brushHeight
} from '$components/common/chart/constant';

const URL = window.URL || window.webkitURL || window;

const PNGWidth = 800;
const PNGHeight = PNGWidth / chartAspectRatio;

const brushAreaHeight = brushHeight * 1.6;

const NoDisplayImage = styled.img`
  display: none;
`;

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

export function getLegendSVG(legendsString) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.innerHTML = legendsString;
  return svg;
}

function getDataURLFromSVG(svgElement) {
  // Inject font styles to SVG
  const fontNode = getFontStyle();
  svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svgElement.setAttribute('style', `font-family:"Open Sans",sans-serif;`);
  svgElement.appendChild(fontNode);

  const blob = new Blob([svgElement.outerHTML], {
    type: 'image/svg+xml;charset=utf-8'
  });
  const blobURL = URL.createObjectURL(blob);
  return blobURL;
}

export default function ExportPNG({ svgRef, legendSvgString }) {
  const imgRef = useRef(null);
  const legendRef = useRef(null);

  const [zoomRatio, setZoomRatio] = useState(1);
  const [imgUrl, setImgUrl] = useState('');
  const [legendUrl, setLegendUrl] = useState('');

  useEffect(() => {
    if (!svgRef.current) return;

    // Extract SVG element from svgRef (div wrapper around chart SVG)
    const svg = svgRef.current.container.getElementsByTagName('svg')[0];
    // Scale up/down the chart to make it width 800px
    const originalSVGWidth = svg.getAttribute('width');
    setZoomRatio(PNGWidth / originalSVGWidth);

    const clonedSvgElement = svg.cloneNode(true);
    clonedSvgElement.setAttribute('width', PNGWidth);
    clonedSvgElement.setAttribute('height', PNGHeight);

    const legendSVG = getLegendSVG(legendSvgString);

    const blobUrl = getDataURLFromSVG(clonedSvgElement);
    const legendUrl = getDataURLFromSVG(legendSVG);

    setImgUrl(blobUrl);
    setLegendUrl(legendUrl);
  }, [svgRef, legendSvgString]);

  const handleDownload = useCallback(() => {
    if (!imgRef.current) return;
    const c = document.createElement('canvas');

    c.width = PNGWidth;
    c.height = PNGHeight;

    const ctx = c.getContext('2d');
    const img = imgRef.current;
    const lgd = legendRef.current;

    // Fill background (white)
    ctx.rect(0, 0, PNGWidth, PNGHeight);
    ctx.fillStyle = 'white';
    ctx?.fill();
    // draw chart (crop brush part)
    ctx.drawImage(
      img,
      0,
      0,
      PNGWidth,
      PNGHeight - brushAreaHeight * zoomRatio,
      0,
      0,
      PNGWidth,
      PNGHeight - brushAreaHeight * zoomRatio
    );
    // draw legend
    ctx.drawImage(lgd, 80, PNGHeight - brushAreaHeight * zoomRatio);

    // save it as jpg
    const jpg = c.toDataURL('image/jpg');
    FileSaver.saveAs(jpg, 'chart.jpg');
  }, [zoomRatio]);

  return (
    <div>
      <Button type='submit' variation='primary-fill' onClick={handleDownload}>
        <span>Export as PNG</span>
      </Button>
      <NoDisplayImage
        ref={imgRef}
        width={PNGWidth}
        height={PNGHeight}
        src={imgUrl}
      />
      <NoDisplayImage ref={legendRef} src={legendUrl} />
    </div>
  );
}
