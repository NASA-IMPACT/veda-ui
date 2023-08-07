import React from 'react';
import styled from 'styled-components';
import { HintedError } from '$utils/hinted-error';

const IFrameWrapper = styled.iframe`
  width: 100%;
  border: 0;
  height: ${(props: { height: number }) => props.height}px;
`;

interface EmbedProps {
  src: string;
  height: number
}

export default function Embed({ src, height = 800 }: EmbedProps) {
  if (!src) {
    throw new HintedError('Embed block requires a URL');
  }

  return (
      <IFrameWrapper src={src} height={height} />
  );
}
