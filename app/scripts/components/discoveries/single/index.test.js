/**
 * set up test environment for jest
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import Block, {
  generalErrorMessage,
  blockTypeErrorMessage,
  contentTypeErrorMessage
} from '$components/discoveries/blocks';
import Figure from '$components/discoveries/blocks/figure';
import { Caption } from '$components/discoveries/images';

test('Throws a content type when not supported content composition is passed', () => {
  const { getByText } = render(
    <Block>
      <p>test</p>
    </Block>
  );
  expect(getByText(new RegExp(contentTypeErrorMessage, 'g'))).toBeDefined();
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
  expect(getByText(new RegExp(generalErrorMessage, 'g'))).toBeDefined();
});

test('Throws an error when a block has wrong type name', () => {
  const { getByText } = render(
    <Block type='almost-full'>
      <Figure>
        <Caption />
      </Figure>
    </Block>
  );
  expect(getByText(new RegExp(blockTypeErrorMessage, 'g'))).toBeDefined();
});
