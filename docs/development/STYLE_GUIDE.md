# Style Guide

This style guide is an evolving document and will be updated as the VEDA UI project develops. The following guidelines are designed to streamline the current development experience and ensure consistency among contributors. Please review and adhere to these guidelines when contributing to the project.

## Code Reviews

### Who Resolves PR Comments?

- The PR maker resolves the conversation once the issue is resolved / fixed. The reviewer can start another conversation if the problem persists.

## PR Branching

### Naming for Branches

- Use the related GitHub issue number; if not available, use `hotfix` or `update`.

## Tagging in PRs

### Tagging Developers

- Tag all developers in PRs for now.
- Ping people in Slack if more than one developer's eyes are needed.

### When to Tag Designer

- Tag Designer when visual/UI changes are introduced.
- Tag project owner when UX/functionality changes are introduced. Confirm with relevant stakeholders if there are potential conflicts.

### Changes to Open PRs

- When another developer introduces changes to an already open PR, it can go directly to the same branch unless it is an experimental or critical change for which a separate branch might be better.

## Code Conventions

### Inline Code Notes

- Special cases use `@TODO`, `@FIXME`, and `@NOTE` tags for annotations in the code. We also use the temporary `@VEDA2-REFACTOR-WORK` note for core features while working to build a UI library out of VEDA UI

### Folder/File Naming Conventions

- Follow the patterns currently used throughout the project

### Recommended VS Code Settings

To maintain consistent code formatting and linting across all contributors, follow these steps to configure your VS Code settings according to the project's guidelines:

1. Navigate to the `.vscode` directory at the root of the project. If it doesn't exist, create it
2. Copy the `settings.json.sample` file from the veda-ui repository
3. Rename the copied file to `settings.json`
4. Customize the `settings.json` file with your personal preferences as needed