// We will need to access history from outside components.
// The only way to do this is create our own history and pass it to the router.
// eslint-disable-next-line inclusive-language/use-inclusive-words
// https://github.com/ReactTraining/react-router/blob/master/FAQ.md#how-do-i-access-the-history-object-outside-of-components
import { createBrowserHistory } from 'history';
const publicUrl = process.env.PUBLIC_URL || '';

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

export default createBrowserHistory({ basename: getAppURL().pathname });
