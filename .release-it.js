const debug = process.argv.includes('--debug');

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

  // Loop through each prefix to find conventional commit pattern ex. feat: , feat(card):
  Object.entries(prefixes).forEach(([prefix, category]) => {
    const regex = new RegExp(`^\\* ${prefix}!?\\(.*?\\)?: .*?\\)$`, 'gm');
    const matches = logs.match(regex) || [];
    grouped[category] = [...matches, ...grouped[category]];
  });

  return grouped;
}

module.exports = {
  hooks: !debug && {
    'after:release': 'echo "VERSION_NUMBER=v${version}" >> "$GITHUB_OUTPUT" '
  },
  git: {
    release: debug ? true : true,
    commitMessage: 'chore(release): update to version v${version}',
    tagName: 'v${version}',
    tagAnnotation: 'Release v${version}',
    pushArgs: ['--follow-tags'],
    getLatestTagFromAllRefs: debug ? false : true,
    requireCleanWorkingDir: debug ? false : true,
    requireUpstream: debug ? false : true,
    changelog: 'git log --pretty=format:%s ${latestTag}...HEAD'
  },
  npm: {
    publish: false
  },
  github: {
    release: debug ? false : true,
    releaseName: 'v${version}',
    autoGenerate: false,
    releaseNotes: function (context) {
      const groupedCommits = groupCommitsByCategory(context.changelog);
      const changelog = Object.entries(groupedCommits)
        .map(([prefix, commits]) => {
          if (commits.length > 0) {
            return `## What's changed \n ### ${prefix}\n ${commits.join('\n')}`;
          }
        })
        .join('\n');
      return changelog;
    }
  },
  plugins: {
    '@release-it/conventional-changelog': {
      preset: 'angular'
    }
  }
};
