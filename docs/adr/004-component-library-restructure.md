# Component Library Restructure: Consolidating Exported Components

* Status: **Accepted**
* Authors: @AliceR, @vgeorge, @ifsimicoded
* Deciders: VEDA UI Team
* As of: December 2025

## Context and Problem Statement

This work builds on broader architectural changes captured in [ADR 006: VEDA2 Architecture Refactor](./006-veda2-architecture-refactor.md). ADR 004 focuses on repository structure changes to better separate library code from runnable applications.

VEDA UI had a split architecture:

1. **Storybook** in `/storybook` (Vite, separate deps)
2. **Library exports** scattered through `/app` and bundled from `/app/scripts/libs/index.ts`
3. **Two build systems**: Gulp/Parcel (app + library) and Vite (Storybook)

This made library boundaries unclear and component discovery difficult.

Previously, the library exports were managed through `/app/scripts/libs/index.ts` which imported components from various locations throughout the application. This has been moved to `packages/veda-ui/src/libs/index.ts` in PR #1898.

```ts
// Scattered exports (pre-monorepo)
export { PageHero } from '$components/common/page-hero';
export { CatalogContent } from './page-components';
export { PageHeader, PageFooter } from './uswds-components';
// ... many more scattered imports
```

## Primary Goal: Defining Clear Boundaries

Define clear boundaries between library packages and runnable applications:

* Clear location for exportable components
* Less ambiguity between “app code” and “library code”

## Decision Drivers

* **Developer experience**: Clear separation between library components and application code
* **Library evolution**: Clear path toward a standalone component library
* **Migration clarity**: Obvious location for new library components
* **Build system modernization**: Better organization supports planned build system updates (see [v7 roadmap](#references))
* **Monorepo boundaries**: Define clear boundaries between packages and applications

## Considered Options

### Option A: Keep Current Structure

Keep exported components scattered under the app structure.

**Pros:**

* No immediate restructuring work required
* Existing imports and references remain unchanged

**Cons:**

* Continued confusion about library boundaries
* Dual build system maintenance
* Difficult component discovery for library consumers
* No clear migration path forward

### Option B: Move Everything to `/storybook` Immediately

Relocate all library components into Storybook in one step.

**Pros:**

* Clean break from legacy structure
* Unified build system immediately
* Clear component organization

**Cons:**

* High-risk, large-scale migration
* Potential breaking changes for existing applications
* Significant coordination required across team

### Option C: Gradual Migration with Renamed `/core` Directory (Original Proposal)

Rename `/storybook` to `/core` to signal “library first”, keep Vite-based Storybook, and migrate components gradually.

**Pros:**

* Clear naming that reflects purpose (core library vs. just Storybook)
* Gradual, lower-risk migration path
* Maintains backward compatibility during transition
* Vite build system advantages for modern component development

**Cons:**

* Temporary complexity during migration period
* Requires coordination for new component placement
* Doesn't establish broader monorepo structure

### Option D: Monorepo Structure with `/packages` and `/apps`

Establish a monorepo split between reusable packages and runnable apps (library code lives under `packages/`, runnable apps live under `apps/`).

**Trade-offs:**

**Pros:**

* Clear boundaries between package code and runnable apps
* Easier component discovery
* Supports evolving build tooling per-surface

**Cons:**

* Incremental migration work
* Temporary ambiguity while old and new structures coexist

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
* [ADR 006: VEDA2 Architecture Refactor](./006-veda2-architecture-refactor.md)
* [ADR 002: Application Architecture for Configurability](./002-application-architecture-for-configurability.md)
* [ADR 003: Design System Change](./003-design-system-change.md)
* [VEDA UI Development Documentation](../development/DEVELOPMENT.md)
* [Component Library Registry Documentation](../development/REGISTRY.md)
