import React from 'react';
import {
  render,
  screen,
  fireEvent,
  cleanup,
  act
} from '@testing-library/react';
import FullpageModal from './fullpage-modal';
import FullscreenWidget from './fullscreen-api';

const setContainerWidth = (width: number) => {
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    value: width
  });
};

describe('FullpageModal', () => {
  const defaultProps = {
    heading: 'Test Modal Widget',
    children: <div>Modal Content</div>
  };

  afterEach(cleanup);

  it('renders whith heading', () => {
    render(<FullpageModal {...defaultProps} />);
    expect(screen.getByText('Test Modal Widget')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Enter fullscreen/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId('widget-content')).toBeInTheDocument();
  });

  it('expands when fullscreen button is clicked', () => {
    render(<FullpageModal {...defaultProps} />);
    const button = screen.getByRole('button', { name: /Enter fullscreen/i });

    fireEvent.click(button);

    expect(screen.queryByTestId('widget-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('full-content')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Exit fullscreen/i })
    ).toBeInTheDocument();
  });

  it('renders the button with text on wide widgets', () => {
    setContainerWidth(500);

    render(<FullpageModal {...defaultProps} />);
    const button = screen.getByRole('button', { name: /Enter fullscreen/i });

    expect(button).toHaveTextContent('Enter fullscreen');
  });

  it('renders the button without text on small widgets', () => {
    setContainerWidth(200);

    render(<FullpageModal {...defaultProps} />);
    const button = screen.getByRole('button', { name: /Enter fullscreen/i });
    expect(button).not.toHaveTextContent('Enter fullscreen');
  });

  it('updates button text visibility when window resizes', () => {
    setContainerWidth(500);
    render(<FullpageModal {...defaultProps} />);

    expect(screen.getByText('Enter fullscreen')).toBeInTheDocument();

    setContainerWidth(200);
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    expect(screen.queryByText('Enter fullscreen')).not.toBeInTheDocument();
  });
});

describe('FullscreenWidget', () => {
  const defaultProps = {
    heading: 'Test Fullscreen Widget',
    children: <div>Widget Content</div>
  };

  it('renders with heading', () => {
    render(<FullscreenWidget {...defaultProps} />);
    expect(screen.getByText('Test Fullscreen Widget')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Enter fullscreen/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId('widget-content')).toBeInTheDocument();
  });

  it('expands when fullscreen button is clicked', async () => {
    render(<FullscreenWidget {...defaultProps} />);
    const button = screen.getByRole('button', { name: /Enter fullscreen/i });

    Element.prototype.requestFullscreen = jest
      .fn()
      .mockResolvedValue(Promise.resolve());

    Document.prototype.exitFullscreen = jest
      .fn()
      .mockResolvedValue(Promise.resolve());

    await act(async () => {
      fireEvent.click(button);
      document.dispatchEvent(new Event('fullscreenchange'));
    });

    expect(Element.prototype.requestFullscreen).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('full-content')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Exit fullscreen/i })
    ).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<FullscreenWidget {...defaultProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
