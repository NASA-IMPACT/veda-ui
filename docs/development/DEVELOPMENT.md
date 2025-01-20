# Development

## Related Documentation
- Read the [SETUP GUIDE](./SETUP.md) first to learn how to run the project locally.
- Refer to [STYLE_GUIDE](./STYLE_GUIDE.md) docs to read about contribution guidelines.
- Refer to [ARCHITECTURE](./ARCHITECTURE.md) docs to read about architecture.
- Refer to [PAGE_OVERRIDES](./PAGE_OVERRIDES.md) for information about the component/content overriding feature.
- Refer to [DEPLOYMENT](./DEPLOYMENT.md) for instructions how to deploy the project

## Code Conventions

### Inline Code Annotation

- Special cases use `@TODO`, `@FIXME`, and `@NOTE` tags for annotations in the code. We also use the temporary `@VEDA2-REFACTOR-WORK` note for core features while working to build a UI library out of VEDA UI

### Folder/File Naming Conventions

- Follow the kebab-case patterns currently used throughout the project

### Recommended VS Code Settings

To maintain consistent code formatting and linting across all contributors, follow these steps to configure your VS Code settings according to the project's guidelines:

1. Navigate to the `.vscode` directory at the root of the project
2. Copy the `settings.json.sample` file from the veda-ui repository
3. Rename the copied file to `settings.json`
4. Customize the `settings.json` file with your personal preferences as needed

## Naming for Branches

- Use the related GitHub issue number, if available.
- The ideal pattern would be {issue#}-{some}-{meaningful}-{title}

## Pull Request Naming

The title of any Pull Request to `main` should follow [Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0/). This is to make sure the automatic versioning and release works seamlessly. Please give it a read to [its summary](https://www.conventionalcommits.org/en/v1.0.0/#summary) before making a PR.

An example Pull Request title could look like this:

- `feat: Implement new component`: This commit will bump the minor version.
- `fix: typo in description`: This commit will bump the patch version.
- `feat!: New component that is not compatible`: `!` is a shortcut for `BREAKING CHANGE`. This commit will bump the major version.

We currently support the following task types. Any type other than `feat` will be treated as a patch version change (unless it is a breaking change):
`["feat","fix", "docs", "test", "ci", "refactor", "chore", "revert"]'`

## Code Quality
Ensuring high code quality is crucial for maintainability, readability, and reducing bugs in the codebase. It also helps streamline collaboration across the team.

### TypeScript
We use TypeScript to add static typing, enabling developers to catch errors early in the development process and improve the overall robustness of the codebase.

### Linting 
Linting helps enforce consistent code style and identify potential issues before they make it into production.  
To manually check for linting errors, run:  
```
yarn lint
```

### Testing  
Testing ensures that the application behaves as expected and prevents regressions as the code evolves. Well-tested code is more reliable and easier to maintain.

#### Unit Tests  
Our unit tests focus on verifying the smallest testable parts of an application to ensure they function correctly in isolation.  
We use Jest and Testing Library to write and run these tests.  
To run unit tests, use:  
```
yarn test
```

#### End-to-End Tests  
For end-to-end (E2E) tests, make sure the development server is running:  
```
yarn serve
```
Then, run the tests with:  
```
yarn test:e2e --ui
```

Alternatively, you can install the **Playwright extension** for VS Code (`ms-playwright.playwright`). This extension allows you to run tests directly from the editor in watch mode, view the browser or trace viewer, and set breakpoints for debugging.


### GitHub Actions

VEDA-UI includes a GitHub action for checking TypeScript and lint errors. If your changes trigger any of these errors, your pull request (PR) will be marked as 'Some checks were not successful.'

### Pre-commit Hook

Additionally, there's a pre-commit hook that performs the same error checks. This helps developers identify and address issues at an earlier stage.
If you need to bypass the check (to make a local temporary commit etc.), include the `--no-verify`` flag in your commit command.

### Format on Save
While the existing checks ensure that no linting errors are introduced into the main branch, enabling "Format on Save" in your code editor provides an additional layer of convenience.
It helps catch formatting issues early in the development process, minimizing the risk of committing errors and ensuring consistent code style across the team.

#### How to Set Up Format on Save in VS Code
Install Required Extensions:

1. Install the ESLint extension ("dbaeumer.vscode-eslint").
2. Enable Format on Save in the settings (<kbd>⌘ Command</kbd> + <kbd>,</kbd> on macOS)
3. Configure Formatter Settings:
   Ensure ESLint is set as the default formatter:

      **Using Settings UI**: Open the Command Palette (<kbd>⌘ Command</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> on macOS), select Preferences: Open Settings (UI), search "default formatter," and select ESLint _dbaeumer.vscode-eslint_.

   **Using JSON**: Open Preferences: Open User Settings (JSON) and add:
   ```json
   "editor.defaultFormatter": "dbaeumer.vscode-eslint"
   ```
5. Test the Configuration:
   Make a change to any file in your project, save it, and verify that it is automatically formatted.

Note: The project contains a file `.vscode/settings.json.sample` with our recommended vscode settings.
To apply these settings to your workspace in VS Code, rename the file to `.vscode/settings.json` by removing the `.sample` extension.