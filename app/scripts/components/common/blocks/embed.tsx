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
  className?: string;
  src: string;
  height: number;
}

export default function Embed({
  className,
  src,
  height = 800,
  ...props
}: EmbedProps) {
  if (!src) {
    throw new HintedError('Embed block requires a URL');
  }

  return (
    <EmbedWrapper className={className}>
      <BrowserFrame link={src}>
        <IframeWrapper loading='lazy' src={src} height={height} {...props} />
      </BrowserFrame>
    </EmbedWrapper>
  );
}
