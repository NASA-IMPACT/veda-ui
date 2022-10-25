import React, { useState, useCallback } from 'react';
import FileSaver from 'file-saver';
import { Button } from '@devseed-ui/button';

import { exportImage, ChartToImageProps } from './utils';

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
        <span>Export as JPG</span>
      </Button>
      {debug && <img src={imageUrl} />}
    </div>
  );
}
