import React, { useRef, useState, useEffect, useCallback } from 'react';
import FileSaver from 'file-saver';

export default function ExportPNG({ svgRef }) {
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const imgRef = useRef(null);
  const [imgUrl, setImgUrl] = useState('');

  useEffect(() => {
    console.log(svgRef);
    if (!svgRef.current) return;

    const svg = svgRef.current.container.getElementsByTagName('svg')[0];
    const legendSvg = document.getElementById('legend');
    const { width, height } = svg.getBBox();
    setImgWidth(width);
    setImgHeight(height);
    const clonedSvgElement = svg.cloneNode(true);
    // const clonedLegendElement = legendSvg?.cloneNode(true);
    clonedSvgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    // const legendNode = document.createElementNS(
    //   'http://www.w3.org/2000/svg',
    //   'foreignObject'
    // ); //Create a rect in SVG's namespace
    // legendNode.setAttribute('x', '20');
    // legendNode.setAttribute('y', '20');
    // legendNode.setAttribute('width', '200');
    // legendNode.setAttribute('heigiht', '40');
    //
    //clonedSvgElement.appendChild(legendNode);
    // legendNode.appendChild(clonedLegendElement);

    // const outerHTML = clonedSvgElement.outerHTML;
    const wrapper = document.createElement('div');
    wrapper.appendChild(clonedSvgElement);
    // wrapper.appendChild(legendNode);
    console.log(wrapper.innerHTML);
    const blob = new Blob([wrapper.innerHTML], {
      type: 'image/svg+xml;charset=utf-8'
    });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(blob);
    setImgUrl(blobURL);
  }, [svgRef]);

  const handleDownload = useCallback(() => {
    if (!imgRef.current) return;
    const c = document.createElement('canvas');
    c.width = imgWidth;
    c.height = imgHeight;
    const ctx = c.getContext('2d');
    const img = imgRef.current;
    ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
    const jpg = c.toDataURL('image/jpg');
    FileSaver.saveAs(jpg, 'chart.jpg');
  }, [imgWidth, imgHeight]);

  return (
    <>
      <button type='submit' onClick={handleDownload}>
        <span>Download</span>
      </button>
      <img
        ref={imgRef}
        crossOrigin='anonymous'
        width={imgWidth}
        height={imgHeight}
        src={imgUrl}
      />
    </>
  );
}
