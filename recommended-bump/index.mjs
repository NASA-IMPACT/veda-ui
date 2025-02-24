import { Bumper } from 'conventional-recommended-bump';
import semver from 'semver';
import { getSemverTags } from 'git-semver-tags';
import ConventionalChangelog from '@release-it/conventional-changelog';
import createPreset from 'conventional-changelog-conventionalcommits';

// Detect the version number based on conventional commits
// This does not handle pre-release
class RecommendedBump extends ConventionalChangelog {
  constructor(...args) {
    super(...args); // Initialize Conventional Changelog
  }

  // Somehow loadPreset('conventional') shows different result
  async getIncrementedVersion() {
    const bumper = new Bumper(process.cwd());
    const conventionalCommitPreset = await createPreset();
    const recommendation = await bumper.bump(conventionalCommitPreset.whatBump);

    let { releaseType } = recommendation;

    const tags = await getSemverTags({
      skipUnstable: true
    });

    const lastStableTag = tags.length > 0 ? tags[0] : null;
    if (releaseType) {
      return semver.inc(lastStableTag, releaseType);
    }
  }

  async getIncrementedVersionCI(options) {
    return await this.getIncrementedVersion(options);
  }
}

export default RecommendedBump;
