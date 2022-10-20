import React from 'react';
import T from 'prop-types';
import {
  Figure,
  Figcaption,
  FigcaptionInner,
  FigureAttribution
} from '$components/common/figure';

import { captionDisplayName } from '$components/common/blocks/block-constant';

export function Caption({ children, attrAuthor, attrUrl }) {
  return (
    <Figcaption>
      {children && <FigcaptionInner>{children}</FigcaptionInner>}
      <FigureAttribution author={attrAuthor} url={attrUrl} forwardedAs='span' />
    </Figcaption>
  );
}

Caption.displayName = captionDisplayName;

Caption.propTypes = {
  attrAuthor: T.string,
  attrUrl: T.string,
  children: T.node
};

export default function Image(props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { align, caption, attrAuthor, ...propsWithoutAttrs } = props;
  const imageAlign = align ? align : 'center';
  return caption || attrAuthor ? (
    // if it is an inline image with a caption
    <Figure className={`align-${imageAlign}`}>
      <img loading='lazy' {...propsWithoutAttrs} />
      <Caption attrAuthor={attrAuthor} attrUrl={props.attrUrl}>
        {caption}
      </Caption>
    </Figure>
  ) : (
    <img loading='lazy' {...propsWithoutAttrs} />
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
