import { Plugin } from 'release-it';
import { Bumper } from 'conventional-recommended-bump';
import semver from 'semver';
import { getSemverTags } from 'git-semver-tags';
import createPreset from 'conventional-changelog-conventionalcommits';

const preReleaseId = 'alpha';
// Detect the version number based on conventional commits
// This does not handle pre-release
class RecommendedBump extends Plugin {
  async getIncrementedVersion(options) {
    const bumper = new Bumper(process.cwd());
    const conventionalCommitPreset = await createPreset();
    bumper.commits(null, conventionalCommitPreset.parser);

    const recommendation = await bumper.bump(conventionalCommitPreset.whatBump);

    let { releaseType } = recommendation;

    const tags = await getSemverTags({
      lernaTags: !!options.lernaPackage,
      package: options.lernaPackage,
      tagPrefix: options.tagPrefix,
      skipUnstable: true,
      cwd: options.cwd
    });

    const lastStableTag = tags.length > 0 ? tags[0] : null;
    if (releaseType) {
      return semver.inc(lastStableTag, releaseType, preReleaseId);
    }
  }

  async getIncrementedVersionCI(options) {
    return await this.getIncrementedVersion(options);
  }
}

export default RecommendedBump;
