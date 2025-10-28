import { isExternalLink } from './utils';

/**
 * These tests validate the current simple implementation of `isExternalLink`,
 * which now only checks if a URL starts with `http://` or `https://`.
 *
 * We intentionally stopped checking if the link is on the same domain,
 * because we have external apps (e.g., Mobile Climate Mapper) that are hosted
 * under the same domain (like `earth.gov/mobile-climate-mapper`) but
 * are separate from the React app (VEDA).
 *
 * Treating these as "external" allows opening them in a new tab instead
 * of using React Router's internal `<Link>` handling, which would otherwise
 * break with URLs like:
 *   https://earth.gov/visit/https://earth.gov/mobile-climate-mapper/
 *
 * This utility is therefore protocol-based, not domain-based, by design.
 *
 */
describe('isExternalLink (basic protocol check)', () => {
  it('returns true for external http link', () => {
    expect(isExternalLink('http://example.com')).toBe(true);
  });

  it('returns true for https link on same domain', () => {
    expect(isExternalLink('https://localhost:3000')).toBe(true);
  });

  it('returns true for same-hostname subpath', () => {
    expect(isExternalLink('https://localhost/foo')).toBe(true);
  });

  it('returns false for relative link', () => {
    expect(isExternalLink('/stories/123')).toBe(false);
  });

  it('returns false for mailto', () => {
    expect(isExternalLink('mailto:test@example.com')).toBe(false);
  });
});
