# Component Library Restructure: Consolidating Exported Components

* Status: **In Progress**
* Authors: @AliceR, @vgeorge, @ifsimicoded
* Deciders: [To be updated with team decision makers]
* As of: September 2025

## Context and Problem Statement

The VEDA UI project currently has a split architecture where:

1. **Storybook** lives in a dedicated `/storybook` subdirectory with its own build system (Vite) and dependency management
2. **Exported components** for the library package are scattered throughout the main `/app` directory structure and bundled via Parcel from `/app/scripts/libs/index.ts`
3. **Two separate build systems** exist: Gulp/Parcel for the main application and library, and Vite for Storybook

While the split architecture successfully addressed the original technical challenges with Gulp and enabled modern Storybook development with Vite, this has created new opportunities for improvement:

* **Scattered component organization**: Library components are mixed within the application structure rather than being clearly separated
* **Unclear library boundaries**: It's not immediately apparent which components are part of the exportable library vs. application-specific to the legacy dashboard setup

Previously, the library exports were managed through `/app/scripts/libs/index.ts` which imported components from various locations throughout the application. This has been moved to `packages/veda-ui/src/libs/index.ts` in PR #1898.

```ts
// Current scattered structure
export { PageHero } from '$components/common/page-hero';
export { CatalogContent } from './page-components';
export { PageHeader, PageFooter } from './uswds-components';
// ... many more scattered imports
```

## Primary Goal: Defining Clear Boundaries

The primary goal of this restructure is to **define clear boundaries** between library packages and applications. This separation of concerns is essential for:

* **Maintainability**: Clear understanding of what belongs to the library vs. application-specific code
* **Build system modernization**: Better organization facilitates the planned build system updates outlined in the [v7 roadmap](#references)
* **Scalability**: Enables the codebase to grow with clear separation between reusable components and application code
* **Developer experience**: Obvious location for new components and clear import patterns

This goal was agreed upon by the team as the foundation for the restructure work.

**Note**: This ADR represents **Phase 1** of a larger refactor effort. While this phase focuses on establishing clear boundaries and organizing the codebase structure, it sets the foundation for addressing broader developer experience concerns tracked in the [v7 roadmap](#references):

* Uniform design system and style approach (USWDS, devseed-ui)
* Consistent style customization patterns (styled components, SCSS, USWDS patterns)
* Component modularity and decoupling (components currently entangled with logic and other components)
* Improved developer experience (deeply nested props, intermixed logic/view code)
* Build system reliability (mysterious build failures, swallowed errors)

## Decision Drivers

* **Developer experience**: Clear separation between library components and application code
* **Library evolution**: Clear path toward a standalone component library
* **Migration clarity**: Obvious location for new library components
* **Build system modernization**: Better organization supports planned build system updates (see [v7 roadmap](#references))
* **Monorepo boundaries**: Define clear boundaries between packages and applications

## Considered Options

### Option A: Keep Current Structure

Continue with the existing scattered approach where library components remain throughout the application structure.

**Pros:**

* No immediate restructuring work required
* Existing imports and references remain unchanged

**Cons:**

* Continued confusion about library boundaries
* Dual build system maintenance
* Difficult component discovery for library consumers
* No clear migration path forward

### Option B: Move Everything to `/storybook` Immediately

Immediately relocate all library components to the Storybook directory and switch to Vite for all library builds.

**Pros:**

* Clean break from legacy structure
* Unified build system immediately
* Clear component organization

**Cons:**

* High-risk, large-scale migration
* Potential breaking changes for existing applications
* Significant coordination required across team

### Option C: Gradual Migration with Renamed `/core` Directory (Original Proposal)

Rename `/storybook` to `/core` and establish it as the primary location for library components, with gradual migration of existing components.

**Pros:**

* Clear naming that reflects purpose (core library vs. just Storybook)
* Gradual, low-risk migration path
* Maintains backward compatibility during transition
* Sets up future structure for standalone library
* Vite build system advantages for modern component development

**Cons:**

* Temporary complexity during migration period
* Requires coordination for new component placement
* Doesn't establish broader monorepo structure

### Option D: Monorepo Structure with `/packages` and `/apps`

Establish a monorepo structure with `/packages` for reusable libraries and `/apps` for runnable applications.

**Pros:**

* Clear separation between reusable packages and runnable apps
* Proper decoupling between the library and its consumers
* Standard, scalable setup that matches VEDA's growth needs
* Supports build system modernization plans
* Future-proof architecture aligned with v7 roadmap
* Team consensus achieved without opposition

**Cons:**

* Requires more initial setup work
* Temporary complexity during migration period

## Decision

**We choose Option D: Monorepo Structure with `/packages` and `/apps`**

During team discussion on [PR #1871](https://github.com/NASA-IMPACT/veda-ui/pull/1871), the proposal evolved from Option C to a monorepo structure. @ifsimicoded expressed skepticism about moving files around without addressing broader developer concerns, but did not oppose moving files around. @vgeorge moved forward with [PR #1898](https://github.com/NASA-IMPACT/veda-ui/pull/1898), which was merged and established the monorepo structure (`packages/veda-ui/`).

### Action Items

From [PR #1871](https://github.com/NASA-IMPACT/veda-ui/pull/1871) discussion, the proposed scope includes:

* [x] Move the library to a dedicated folder (completed in [PR #1898](https://github.com/NASA-IMPACT/veda-ui/pull/1898))
* [ ] Move the SPA to `apps/legacy-spa`
* [ ] Move Storybook to `apps/storybook`
* [x] Update this ADR with the results of these changes

**Out of scope** (tracked separately):

* Build tool changes (tracked in [#1900](https://github.com/NASA-IMPACT/veda-ui/issues/1900); higher complexity)
* Component refactors (tracked in [#1889](https://github.com/NASA-IMPACT/veda-ui/issues/1889))

### Implementation Plan

#### Phase 1: Monorepo Structure

* [x] Move library code to `packages/veda-ui/` (completed in PR #1898)
* [ ] Move Storybook to `apps/storybook/`
* [ ] Move SPA to `apps/legacy-spa/`

#### Phase 2: Component Migration Strategy

1. **New components**: All new library components must be created in `packages/veda-ui/src/components/`
2. **Existing components**: Gradual migration based on:
   * Components undergoing major updates
   * Components with high reusability
   * Components needed for new library features

3. **Migration process per component**:
   * Move component to `packages/veda-ui/src/components/[category]/[component-name]/`
   * Update imports in applications to reference `packages/veda-ui/`
   * Add Storybook stories
   * Update library exports in `packages/veda-ui/src/index.ts`

#### Phase 3: Build System Integration

**Current Library Build Process:**

* Entry: `packages/veda-ui/src/libs/index.ts` (moved from `/app/scripts/libs/index.ts` in PR #1898)
* Build: Gulp + Parcel → `/lib/` directory
* Output: `main.js` (CommonJS), `module.js` (ES modules), `index.d.ts`, CSS, assets

**Build System Modernization:**

Build system updates are planned as part of the [v7 roadmap](#references). The monorepo structure facilitates this work by creating clear package boundaries. Build tool changes are tracked separately in [#1900](https://github.com/NASA-IMPACT/veda-ui/issues/1900).

### Updated Directory Structure (Target State)

```text
/
├── packages/
│   └── veda-ui/                # Main component library package
│       └── src/
│           ├── index.ts        # Main library exports
│           ├── components/     # All library components
│           ├── hooks/          # Exported hooks
│           ├── styles/         # Component styles
│           └── libs/           # Legacy exports (during transition)
└── apps/
    ├── storybook/              # Storybook documentation app
    └── legacy-spa/             # Legacy dashboard application
```

### Migration Guidelines

**New components**: Create in `packages/veda-ui/src/components/`

**Component updates**: Migrate to `packages/veda-ui/src/components/` when:

* Component is part of the public API
* Component is used across multiple instances
* Update is substantial (major refactor/redesign)

## Consequences

### Positive

* **Clearer architecture** with obvious library boundaries
* **Better developer experience** with modern tooling
* **Simplified maintenance** with unified build system
* **Future flexibility** for standalone library distribution
* **Improved component discoverability** for library consumers
* **Build system modernization** facilitated by better organization

### Negative

* **Temporary complexity** during migration period
* **Coordination overhead** for component placement decisions
* **Documentation updates** required across multiple files
* **Potential confusion** during transition period

### Risks and Mitigations

* **Risk**: Breaking changes during migration
  * **Mitigation**: Maintain backward compatibility exports during transition
* **Risk**: Team adoption of new structure
  * **Mitigation**: Clear documentation and examples, gradual enforcement
* **Risk**: Build system complexity during transition
  * **Mitigation**: Maintain both systems until migration complete, clear deprecation timeline

## Related Issues and Tickets

* [Issue #1290](https://github.com/NASA-IMPACT/veda-ui/issues/1290) - Fix build issues
* [Issue #1889](https://github.com/NASA-IMPACT/veda-ui/issues/1889) - Version 7 Roadmap
* [Issue #1900](https://github.com/NASA-IMPACT/veda-ui/issues/1900) - Build tool changes

## References

* [PR #1871](https://github.com/NASA-IMPACT/veda-ui/pull/1871) - Original ADR proposal by @AliceR
* [PR #1898](https://github.com/NASA-IMPACT/veda-ui/pull/1898) - Monorepo structure implementation (merged; moved `app/scripts/` → `packages/veda-ui/src/`)
* [Issue #1889](https://github.com/NASA-IMPACT/veda-ui/issues/1889) - Version 7 Roadmap (includes folder reorganization and build system updates)
* [ADR 002: Application Architecture for Configurability](./002-application-architecture-for-configurability.md)
* [ADR 003: Design System Change](./003-design-system-change.md)
* [VEDA UI Development Documentation](../development/DEVELOPMENT.md)
* [Component Library Registry Documentation](../development/REGISTRY.md)
