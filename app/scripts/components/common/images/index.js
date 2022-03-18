import React from 'react';
import T from 'prop-types';

import {
  Figure,
  Figcaption,
  FigcaptionInner,
  FigureAttribution
} from '$components/common/figure';

import { CaptionDisplayName } from '$components/common/blocks/block-constant';

export const Caption = function ({ children, attrAuthor, attrUrl }) {
  return (
    <Figcaption>
      {children && <FigcaptionInner>{children}</FigcaptionInner>}
      <FigureAttribution author={attrAuthor} url={attrUrl} forwardedAs='span' />
    </Figcaption>
  );
};

Caption.displayName = CaptionDisplayName;

Caption.propTypes = {
  attrAuthor: T.string,
  attrUrl: T.string,
  children: T.node
};

const Image = function (props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { align, attr, attrAuthor, attrUrl, ...propsWithoutAttrs } = props;
  const imageAlign = align ? align : 'center';
  return attr || attrAuthor ? (
    // if it is an inline image with a caption
    <Figure className={`align-${imageAlign}`}>
      <img loading='lazy' {...propsWithoutAttrs} />
      <Caption attrAuthor={attrAuthor} attrUrl={props.attrUrl}>
        {attr}
      </Caption>
    </Figure>
  ) : (
    <img loading='lazy' {...propsWithoutAttrs} />
  );
};
Image.propTypes = {
  src: T.string,
  alt: T.string,
  align: T.string,
  attr: T.string,
  attrAuthor: T.string,
  attrUrl: T.string
};

export default Image;
