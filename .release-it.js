const prefixes = {
  feat: '🎉 Features',
  fix: '🐛 Fixes',
  docs: '🚀 Improvements',
  ci: '🚀 Improvements',
  test: '🚀 Improvements',
  refactor: '🚀 Improvements',
  chore: '🚀 Improvements',
  revert: '🐛 Fixes'
};

function groupCommitsByCategory(logs) {
  const grouped = {};

  // Initialize categories from the values in the prefixes dictionary
  Object.values(prefixes).forEach((category) => {
    grouped[category] = [];
  });

  // Loop through each prefix and categorize commits
  Object.entries(prefixes).forEach(([prefix, category]) => {
    const regex = new RegExp(`^\\* ${prefix}: .*?\\)$`, 'gm');
    const matches = logs.match(regex) || [];
    grouped[category].push(...matches);
  });

  return grouped;
}

module.exports = {
  hooks: {
    'after:release': 'echo "VERSION_NUMBER=v${version}" >> "$GITHUB_OUTPUT" '
  },
  git: {
    commitMessage: 'chore(release): update to version v${version}',
    tagName: 'v${version}',
    tagAnnotation: 'Release v${version}',
    pushArgs: ['--follow-tags'],
    getLatestTagFromAllRefs: true,
    requireUpstream: false,
    requireCleanWorkingDir: false
  },
  npm: {
    publish: false
  },
  github: {
    release: true,
    releaseName: 'v${version}',
    autoGenerate: false,
    releaseNotes: function (context) {
      const groupedCommits = groupCommitsByCategory(context.changelog);
      const changelog = Object.entries(groupedCommits)
        .map(([prefix, commits]) => {
          if (commits.length > 0) {
            return `### ${prefix}\n ${commits.join('\n')}`;
          }
        })
        .join('\n');

      return changelog;
    }
  },
  plugins: {
    // @release-it/conventional-changelog is mainly for the verion bump
    // due to the challenges we faced during github release note generation
    '@release-it/conventional-changelog': {
      preset: 'conventionalcommits'
    }
  }
};
