/**
 * set up test environment for jest
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';

import { ContentBlockProse } from '$styles/content-block';
import Block from '$components/discoveries/blocks';
import Figure from '$components/discoveries/blocks/figure';
import { Caption } from '$components/discoveries/images';

test('Throws an error when content is not wrapped with Prose', () => {
  const { getByText } = render(
    <Block>
      <p>test</p>
    </Block>
  );
  expect(getByText(/There is an error in this block: /)).toBeDefined();
});

test('Throws an error when a block has two captions', () => {
  const { getByText } = render(
    <Block>
      <Figure>
        <Caption />
        <Caption />
      </Figure>
    </Block>
  );
  expect(getByText(/There is an error in this block: /)).toBeDefined();
});
