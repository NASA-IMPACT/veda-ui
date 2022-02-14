/**
 * set up test environment for jest
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import TestUI from './example-component';

test('test works?', () => {
  const { getByText } = render(<TestUI />);
  expect(getByText('hello world')).toBeDefined();
});
