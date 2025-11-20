import React, { useCallback, useState } from 'react';
import { Icon } from '@trussworks/react-uswds';

import { SelectorButton } from '$components/common/map/style/button';
import useThemedControl from '$components/common/map/controls/hooks/use-themed-control';
import { useVedaUI } from '$context/veda-ui-provider';

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
  const { envUrlShortenerEndpoint } = useVedaUI();

  const handleMouseLeave = useCallback(() => {
    if (linkCopied) {
      setLinkCopied(false);
    }
  }, [linkCopied]);

  const handleShare = useCallback(async () => {
    try {
      // get current URL
      const currentUrl = window.location.href;

      if (envUrlShortenerEndpoint) {
        try {
          const response = await fetch(
            `${envUrlShortenerEndpoint}?url=${encodeURIComponent(currentUrl)}`
          );

          if (!response.ok) {
            const errorText = await response
              .text()
              .catch(() => 'Unknown error');
            throw new Error(
              `Failed to shorten URL: ${response.status} ${response.statusText}. ${errorText}`
            );
          }

          const data = await response.json();

          if (!data.short_url) {
            throw new Error('URL shortener response missing short_url');
          }
          const shortenedUrl = data.short_url;
          await navigator.clipboard.writeText(shortenedUrl);
          setLinkCopied(true);
        } catch (error) {
          // Log the error for debugging but fall through to fallback
          // eslint-disable-next-line no-console
          console.warn('URL shortening failed:', error);
          throw error; // Re-throw to trigger the outer catch block fallback
        }
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
  }, [envUrlShortenerEndpoint]);

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
