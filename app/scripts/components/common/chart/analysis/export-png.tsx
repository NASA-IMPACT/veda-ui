import React, { useRef, useState, useEffect, useCallback } from 'react';
import FileSaver from 'file-saver';

export default function ExportPNG({ svgRef, legendSvgString }) {
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const imgRef = useRef(null);
  const legendRef = useRef(null);
  const [imgUrl, setImgUrl] = useState('');
  const [legendUrl, setLegendUrl] = useState('');

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current.container.getElementsByTagName('svg')[0];

    const { width, height } = svg.getBBox();
    setImgWidth(width);
    setImgHeight(height);
    const clonedSvgElement = svg.cloneNode(true);

    clonedSvgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    const wrapper = document.createElement('div');
    wrapper.appendChild(clonedSvgElement);

    const blob = new Blob([wrapper.innerHTML], {
      type: 'image/svg+xml;charset=utf-8'
    });
    // const legendBlob = legendSvgString.toDataURL();
    // new Blob([legendSvgString], {
    //   type: 'image/svg+xml;charset=utf-8'
    // });
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
    c.width = imgWidth;
    c.height = imgHeight;
    const ctx = c.getContext('2d');
    const img = imgRef.current;
    const lgd = legendRef.current;

    ctx.drawImage(img, 0, 0, imgWidth, imgHeight-40, 0, 0, imgWidth, imgHeight-40);
    ctx.drawImage(lgd, 0, imgHeight - 40, 300, 40);
    const jpg = c.toDataURL('image/jpg');
    FileSaver.saveAs(jpg, 'chart.jpg');
  }, [imgWidth, imgHeight]);

  return (
    <>
      <button type='submit' onClick={handleDownload}>
        <span>Download</span>
      </button>
      <img
        style={{display: 'none'}}
        ref={imgRef}
        crossOrigin='anonymous'
        width={imgWidth}
        height={imgHeight}
        src={imgUrl}
      />
      <img
      style={{display: 'none'}}
        ref={legendRef}
        crossOrigin='anonymous'
        width={300}
        height={40}
        src={legendUrl}
      />
    </>
  );
}
