# Veda UI – Storybook Setup

This directory contains the standalone Storybook environment for the **Veda UI** component library. The setup is designed to support isolated component development, visual testing, and documentation — completely decoupled from the legacy application architecture.

---

## 🧱 Architecture Overview

Storybook is housed in a dedicated subdirectory with its own build system and dependency graph. This ensures:

- **Separation of concerns** – Storybook operates independently from the main app.
- **Reduced dependency coupling** – Isolated tooling avoids version conflicts.
- **Modular tooling** – Enables rapid iteration on Storybook without touching legacy infrastructure.


### A separate `package.json`

The Storybook directory includes its own `package.json`, allowing it to function as a self-contained environment.

**Key advantages:**

- **Dependency isolation**: Prevents Storybook-related packages (e.g., `@storybook/addon-essentials`) from bloating the root project.
- **Simplified maintenance**: Updates to Storybook tooling can be done independently.
- **Cleaner dev experience**: Developers working on components don’t need to worry about legacy dependencies or build tools.


### Vite as the Storybook Builder

We’ve chosen [`@storybook/builder-vite`](https://github.com/storybookjs/builder-vite) over the default Webpack builder or legacy gulp-based processes.

Gulp, used by the legacy app, lacks modern bundling capabilities and module system support. It introduces unnecessary complexity for a tool like Storybook, which thrives in declarative, fast build environments like Vite.


## 🚀 Getting Started

You can run Storybook in two ways, depending on your working directory:

### Option 1: From Inside the `/core` Directory

```bash
cd storybook
yarn install
yarn storybook
```

### Option 2: From the veda-ui Project Root

```bash
yarn core:install
yarn core:storybook
```

These scripts proxy to the Storybook subproject for convenience and support CI workflows.


## Benefits and Summary

- ✅ Modular and maintainable
- ⚡ Fast startup and feedback with Vite
- 🧪 Visual testing and documentation in isolation
- 📦 Dependency hygiene via local `package.json`
- 📐 Scalable architecture for component-driven development

This setup enables modern, high-performance component development for the Veda UI library. By isolating Storybook from the main application, using Vite for bundling, and managing dependencies separately, we ensure a clean, scalable, and developer-friendly workflow.
