import React from 'react';
import styled from 'styled-components';
import { HintedError } from '$utils/hinted-error';
import BrowserFrame from '$styles/browser-frame';

const EmbedWrapper = styled.div`
  width: 100%;

  > div {
    width: 100%;
  }
`;

const IframeWrapper = styled.iframe`
  width: 100%;
  border: 0;
  height: ${(props: { height: number }) => props.height}px;
`;

interface EmbedProps {
  src: string;
  height: number;
}

export default function Embed({ src, height = 800 }: EmbedProps) {
  if (!src) {
    throw new HintedError('Embed block requires a URL');
  }

  return (
    <EmbedWrapper>
      <BrowserFrame link={src}>
        <IframeWrapper loading='lazy' src={src} height={height} />
      </BrowserFrame>
    </EmbedWrapper>
  );
}
