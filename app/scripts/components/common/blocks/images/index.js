import React from 'react';
import T from 'prop-types';
import {
  Figure,
  Figcaption,
  FigcaptionInner,
  FigureAttribution
} from '$components/common/figure';
import { LinkAttribution } from '$components/common/link-full-map';

import { captionDisplayName } from '$components/common/blocks/block-constant';

export function Caption({ children, attrAuthor, attrUrl }) {
  return (
    <Figcaption>
      {children && <FigcaptionInner>{children}</FigcaptionInner>}
      <FigureAttribution author={attrAuthor} url={attrUrl} forwardedAs='span' />
    </Figcaption>
  );
}

export function FullMapLinkButton({ layerId, date, compareDate }) {
  return (
    <LinkAttribution
      layerId={layerId}
      date={date}
      compareDate={compareDate}
    />
  );
}

FullMapLinkButton.propTypes = {
  layerId: T.string,
  date: T.string,
  compareDate: T.string
};

Caption.displayName = captionDisplayName;

Caption.propTypes = {
  attrAuthor: T.string,
  attrUrl: T.string,
  children: T.node
};

export default function Image(props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { align, caption, attrAuthor, ...propsWithoutAttrs } = props;
  if (caption || attrAuthor) {
    const imageAlign = align ? align : 'center';
    return (
      // if it is an inline image with a caption
      <Figure className={`align-${imageAlign}`}>
        <img loading='lazy' {...propsWithoutAttrs} />
        <Caption attrAuthor={attrAuthor} attrUrl={props.attrUrl}>
          {caption}
        </Caption>
      </Figure>
    );
  }

  const imageAlign = align ? align : 'left';
  return (
    <img
      className={`img-align-${imageAlign}`}
      loading='lazy'
      {...propsWithoutAttrs}
    />
  );
}

Image.propTypes = {
  src: T.string,
  alt: T.string,
  align: T.string,
  caption: T.string,
  attrAuthor: T.string,
  attrUrl: T.string
};
