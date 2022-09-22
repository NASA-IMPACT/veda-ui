import React, { useRef, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import FileSaver from 'file-saver';
import { Button } from '@devseed-ui/button';

import {  chartAspectRatio, brushHeight} from '$components/common/chart/constant';

const PNGWidth = 800;
const PNGHeight = PNGWidth/chartAspectRatio;

const brushAreaHeight = (brushHeight * 1.6);

const NoDisplayImage = styled.img`
  display: block;
`;

function getFontStyle() {
  const encodedFontUrl = window.btoa('https://fonts.gstatic.com/s/opensans/v34/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4taVIUwaEQbjB_mQ.woff2');
  const fontStyleAsString = `@font-face { font-family: "Open Sans",sans-serif; 
  src: url("data:application/font-woff;charset=utf-8;base64,${encodedFontUrl}") format('woff2');}`;

  const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(fontStyleAsString));
  return style;
}

export default function ExportPNG({ svgRef, legendSvgString }) {

  const imgRef = useRef(null);
  const legendRef = useRef(null);

  const [zoomRatio, setZoomRatio] = useState(1);
  const [imgUrl, setImgUrl] = useState('');
  const [legendUrl, setLegendUrl] = useState('');

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current.container.getElementsByTagName('svg')[0];

    const originalSVGWidth = svg.getAttribute('width');
    

    const clonedSvgElement = svg.cloneNode(true);
    const FontStyleElement = getFontStyle();
    clonedSvgElement.setAttribute('style', `font-family: "Open Sans",sans-serif;`);
    clonedSvgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clonedSvgElement.setAttribute('width', PNGWidth);
    clonedSvgElement.setAttribute('height', PNGHeight);
    clonedSvgElement.appendChild(FontStyleElement);
    
    setZoomRatio(PNGWidth/originalSVGWidth);

    const wrapper = document.createElement('div');
    wrapper.appendChild(clonedSvgElement);

    const blob = new Blob([wrapper.innerHTML], {
      type: 'image/svg+xml;charset=utf-8'
    });

    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(blob);
    const legendUrl =
      'data:image/svg+xml;base64,' + window.btoa(legendSvgString);

    setImgUrl(blobURL);
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
    
    ctx.drawImage(img, 0, 0, PNGWidth, PNGHeight - brushAreaHeight*zoomRatio, 0, 0, PNGWidth, PNGHeight - brushAreaHeight*zoomRatio);
    ctx.drawImage(lgd, 100, PNGHeight - brushAreaHeight*zoomRatio);

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
      <NoDisplayImage
        ref={legendRef}
        width={PNGWidth}
        height={brushAreaHeight}
        src={legendUrl}
      />
    </div>
  );
}
