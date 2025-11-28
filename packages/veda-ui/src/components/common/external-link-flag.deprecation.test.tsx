/* eslint-disable no-console */
import React from 'react';
import { render } from '@testing-library/react';
import { ExternalLinkFlag } from '$components/common/card/';

// Mock console.warn to capture warnings
const mockConsoleWarn = jest.fn();
const originalConsoleWarn = console.warn;

describe('ExternalLinkFlag Deprecation Warning', () => {
  beforeEach(() => {
    // Reset the mock and restore original console.warn
    mockConsoleWarn.mockClear();
    console.warn = mockConsoleWarn;

    // Reset the module to clear the hasWarnedExternalLinkFlag flag
    jest.resetModules();
  });

  afterEach(() => {
    // Restore original console.warn
    console.warn = originalConsoleWarn;
  });

  it('should log deprecation warning once in development', () => {
    // Set NODE_ENV to development
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    try {
      // First render should trigger warning
      render(<ExternalLinkFlag />);
      expect(mockConsoleWarn).toHaveBeenCalledTimes(1);
      expect(mockConsoleWarn).toHaveBeenCalledWith(
        '[veda-ui] ExternalLinkFlag import from card/ is deprecated and will be removed in v7. Import from @teamimpact/veda-ui or $components/common/external-link-flag. Migrated to USWDS Icon.Launch; expect a slightly larger icon.'
      );

      // Second render should not trigger warning again
      render(<ExternalLinkFlag />);
      expect(mockConsoleWarn).toHaveBeenCalledTimes(1);
    } finally {
      // Restore original NODE_ENV
      process.env.NODE_ENV = originalNodeEnv;
    }
  });

  it('should not log warning in production', () => {
    // Set NODE_ENV to production
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    try {
      render(<ExternalLinkFlag />);
      expect(mockConsoleWarn).not.toHaveBeenCalled();
    } finally {
      // Restore original NODE_ENV
      process.env.NODE_ENV = originalNodeEnv;
    }
  });

  it('should render the component correctly', () => {
    const { container } = render(<ExternalLinkFlag />);

    // Check that the component renders
    expect(container.firstChild).toBeTruthy();

    // Check for the "External Link" text
    expect(container.textContent).toContain('External Link');
  });
});
