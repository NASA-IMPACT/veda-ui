import React from 'react';

interface DeprecationWarningOptions {
  /** The name of the deprecated item */
  name: string;
  /** The version when the item will be removed */
  removalVersion: string;
  /** Optional GitHub issue URL */
  issueUrl?: string;
  /** Optional suggestion for what to use instead */
  alternative?: string;
}

export function logDeprecationWarning(
  options: DeprecationWarningOptions
): void {
  const { name, removalVersion, issueUrl, alternative } = options;

  let message = `⚠️ ${name} is deprecated and will be removed in version ${removalVersion}.`;

  if (alternative) {
    message += ` ${alternative}.`;
  }

  if (issueUrl) {
    message += ` See ${issueUrl} for details.`;
  }

  // eslint-disable-next-line no-console
  console.warn(message);
}

export function useDeprecationWarning({
  name,
  removalVersion,
  issueUrl,
  alternative
}: DeprecationWarningOptions): void {
  React.useEffect(() => {
    logDeprecationWarning({ name, removalVersion, issueUrl, alternative });
  }, [name, removalVersion, issueUrl, alternative]);
}
