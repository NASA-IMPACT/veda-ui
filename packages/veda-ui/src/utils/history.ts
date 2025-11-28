const publicUrl = process.env.PUBLIC_URL ?? '';

export const getAppURL = () => {
  const { protocol, host } = window.location;
  const baseUrl = publicUrl.match(/https?:\/\//)
    ? publicUrl
    : `${protocol}//${host}/${publicUrl}`;

  // Remove trailing url if exists.
  const url = new URL(baseUrl.replace(/\/$/, ''));
  return url;
};

/**
 * Create am absolute APP url to a resource. Useful when there's a base path in
 * the app url.
 *
 * @param {string} resource root url to the resource, if any.
 */
export const makeAbsUrl = (resource = '') =>
  `${getAppURL().href.replace(/\/$/, '')}${resource}`;
