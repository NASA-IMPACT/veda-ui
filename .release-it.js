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

  // Loop through each prefix to find conventional commit pattern ex. feat: , feat(card):, feat(card)! including some edge cases
  Object.entries(prefixes).forEach(([prefix, category]) => {
    const regex = new RegExp(
      `^(${prefix}(\([\w\-]+\))?!?: [^\r\n]+((\s)((\s)[^\r\n]+)+)*)(\s?)$`
    );
    const matches = logs.filter((l) => l.match(regex));
    grouped[category] = [...matches, ...grouped[category]];
  });

  return grouped;
}

module.exports = {
  hooks: !debug && {
    'after:release': 'echo "VERSION_NUMBER=v${version}" >> "$GITHUB_OUTPUT" '
  },
  git: {
    release: debug ? false : true,
    commitMessage: 'chore(release): update to version v${version}',
    tagName: 'v${version}',
    tagAnnotation: 'Release v${version}',
    pushArgs: ['--follow-tags'],
    requireCleanWorkingDir: debug ? false : true,
    requireUpstream: debug ? false : true,
    requireCommits: true,
    changelog: 'git log --pretty=format:%s ${latestTag}...HEAD' // The output will be passed to releaseNotes context.changelog
  },
  npm: {
    publish: false
  },
  github: {
    release: debug ? false : true,
    releaseName: 'v${version}',
    autoGenerate: false,
    releaseNotes: function (context) {
      const logs = context.changelog.split('\n');
      const groupedCommits = groupCommitsByCategory(logs);
      const title = `## What's changed \n`;
      const changelog = Object.entries(groupedCommits)
        .map(([prefix, commits]) => {
          if (commits.length > 0) {
            return `### ${prefix}\n ${commits.map((c) => '* ' + c).join('\n')}`;
          }
        })
        .join('\n');

      return title + changelog;
    }
  },
  // Only to bump the version with conventional commits
  plugins: {
    './recommended-bump/index.mjs': {}
  }
};
