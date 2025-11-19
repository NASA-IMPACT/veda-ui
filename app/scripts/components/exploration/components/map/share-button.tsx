import React, { useCallback, useState } from 'react';
import { Icon } from '@trussworks/react-uswds';

import { SelectorButton } from '$components/common/map/style/button';
import useThemedControl from '$components/common/map/controls/hooks/use-themed-control';

function ShareButtonComponent({
  onClick,
  disabled,
  tipContent,
  onMouseLeave
}: {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled: boolean;
  tipContent: string;
  onMouseLeave?: () => void;
}) {
  return (
    <SelectorButton
      tipContent={tipContent}
      tipProps={{ placement: 'left', showOnCreate: true, hideOnClick: false }}
      disabled={disabled}
      onClick={onClick}
      onMouseLeave={onMouseLeave}
    >
      <Icon.Share size={3} />
    </SelectorButton>
  );
}

export function ShareButton(): JSX.Element | null {
  const [linkCopied, setLinkCopied] = useState(false);

  const handleMouseLeave = useCallback(() => {
    if (linkCopied) {
      setLinkCopied(false);
    }
  }, [linkCopied]);

  const handleShare = useCallback(async () => {
    try {
      // Get current URL
      const currentUrl = window.location.href;

      // Call the URL shortening API if endpoint is configured
      const urlShortenerEndpoint = process.env.API_URL_SHORTENER_ENDPOINT;
      if (urlShortenerEndpoint) {
        const response = await fetch(
          `${urlShortenerEndpoint}?url=${encodeURIComponent(currentUrl)}`
        );

        if (!response.ok) {
          throw new Error('Failed to shorten URL');
        }

        const data = await response.json();
        const shortenedUrl = data.short_url;

        // Copy to clipboard
        navigator.clipboard.writeText(shortenedUrl);
        setLinkCopied(true);
      } else {
        // No URL shortener configured, copy current URL directly
        navigator.clipboard.writeText(currentUrl);
        setLinkCopied(true);
      }
    } catch {
      // Fallback: copy current URL if shortening fails
      try {
        navigator.clipboard.writeText(window.location.href);
        setLinkCopied(true);
      } catch {
        // Silent fail - clipboard API may not be available in all contexts
      }
    }
  }, []);

  const control = useThemedControl(
    () => (
      <ShareButtonComponent
        onClick={handleShare}
        disabled={!navigator.clipboard}
        tipContent={
          linkCopied ? 'Link successfully copied' : 'Share Exploration'
        }
        onMouseLeave={handleMouseLeave}
      />
    ),
    {
      position: 'top-right'
    }
  );
  return control;
}
