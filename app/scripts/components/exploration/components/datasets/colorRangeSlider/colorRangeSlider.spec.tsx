import React from 'react';
import '@testing-library/jest-dom';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { ColorRangeSlider } from './index';

describe('colorRangeSlider should render with correct content.', () => {
  const colorRangeData = {
    min: 0,
    max: 0.3,
    colorMapScale: { max: 0.263, min: 0.131 },
    setColorMapScale: jest.fn()
  };

  beforeEach(() => {
    render(<ColorRangeSlider {...colorRangeData} />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Renders correct content', async () => {
    const maxSlider = screen.getByTestId('maxSlider');
    const minSlider = screen.getByTestId('minSlider');
    const maxInput = screen.getByTestId('maxInput');
    const minInput = screen.getByTestId('minInput');

    expect(screen.getByText('Rescale')).toBeInTheDocument();
    await waitFor(() => {
      expect(minSlider).toHaveValue('0.131');
      expect(maxSlider).toHaveValue('0.263');
      expect(minInput).toHaveValue(0.131);
      expect(maxInput).toHaveValue(0.263);
    });
  });

  it('Shows error when number entered above max', () => {
    const minInput = screen.getByTestId('minInput');

    fireEvent.change(minInput, { target: { value: 0.29 } });
    expect(
      screen.getByText('Please enter a value less than 0.263')
    ).toBeInTheDocument();
  });
  it('Shows error when number entered below min', () => {
    const maxInput = screen.getByTestId('maxInput');

    fireEvent.change(maxInput, { target: { value: -0.1 } });
    expect(
      screen.getByText('Please enter a value larger than 0.131')
    ).toBeInTheDocument();
  });
  it('Shows error when number entered outside of min and max', () => {
    const minInput = screen.getByTestId('minInput');

    fireEvent.change(minInput, { target: { value: -0.1 } });
    expect(
      screen.getByText('Please enter a value between 0 and 0.3')
    ).toBeInTheDocument();
    const maxInput = screen.getByTestId('maxInput');

    fireEvent.change(maxInput, { target: { value: 0.4 } });
    expect(
      screen.getByText('Please enter a value between 0 and 0.3')
    ).toBeInTheDocument();
  });
});

describe('colorRangeSlider should render with correct display content.', () => {
  const colorRangeData = {
    min: -0.0000003,
    max: 0.0000003,
    colorMapScale: { max: 0.000000263, min: -0.000000131 },
    setColorMapScale: jest.fn()
  };

  beforeEach(() => {
    render(<ColorRangeSlider {...colorRangeData} />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Renders correct content', async () => {
    const maxSlider = screen.getByTestId('maxSlider');
    const minSlider = screen.getByTestId('minSlider');
    const maxInput = screen.getByTestId('maxInput');
    const minInput = screen.getByTestId('minInput');

    screen.debug();

    expect(screen.getByText('Rescale')).toBeInTheDocument();
    await waitFor(() => {
      expect(minSlider).toHaveValue("-1.31e-7");
      expect(maxSlider).toHaveValue("2.63e-7");
      expect(minInput).toHaveValue(-1.31e-7);
      expect(maxInput).toHaveValue(2.63e-7);
    });
  });
});
