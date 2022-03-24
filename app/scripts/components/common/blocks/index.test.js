/**
 * set up test environment for jest
 * @jest-environment jsdom
 */
import React from 'react';

import renderWithTheme from '$test/utils';
import Block from '$components/common/blocks/';
import {
  generalErrorMessage,
  blockTypeErrorMessage,
  contentTypeErrorMessage
} from '$components/common/blocks/block-constant';
import Figure from '$components/common/blocks/figure';
import { Caption } from '$components/common/images';

describe('Block edge case tests', () => {
  it('Throws a content type when not supported content composition is passed', () => {
    const { getByText } = renderWithTheme(
      <Block>
        <p>test</p>
      </Block>
    );
    expect(getByText(new RegExp(contentTypeErrorMessage, 'g'))).toBeDefined();
  });

  it('Throws an error when a block has two captions', () => {
    const { getByText } = renderWithTheme(
      <Block>
        <Figure>
          <Caption />
          <Caption />
        </Figure>
      </Block>
    );
    expect(getByText(new RegExp(generalErrorMessage, 'g'))).toBeDefined();
  });

  it('Throws an error when a block has wrong type name', () => {
    const { getByText } = renderWithTheme(
      <Block type='almost-full'>
        <Figure>
          <Caption />
        </Figure>
      </Block>
    );
    expect(getByText(new RegExp(blockTypeErrorMessage, 'g'))).toBeDefined();
  });
});
