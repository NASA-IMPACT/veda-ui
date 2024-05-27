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

### ESLint Configuration for VSCode

The project uses `ESLint` and `Prettier` for code formatting and linting which can be configured to ensure consistency:

1. Install the `ESLint` and `Prettier` extensions in VSCode
2. Open the VSCode settings (`settings.json`)
3. Add the following configuration to your VSCode `settings.json`:

```
{
    ...
    "editor.defaultFormatter": "dbaeumer.vscode-eslint",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "explicit"
    },
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        "typescript",
        "typescriptreact"
    ],
    "prettier.requireConfig": true,
}
```
