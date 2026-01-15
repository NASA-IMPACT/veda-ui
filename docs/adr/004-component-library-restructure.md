# Component Library Restructure

* Status: **Accepted**
* Authors: @AliceR, @vgeorge, @ifsimicoded, @dzole0311
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

## Implementation Status

### Completed

* **[PR #1898](https://github.com/NASA-IMPACT/veda-ui/pull/1898)**: Established the monorepo structure and moved library exports into `packages/veda-ui/`
* **[PR #1957](https://github.com/NASA-IMPACT/veda-ui/pull/1957)**: Moved the Parcel-based dashboard to `apps/dashboard-parcel/`

  * Makes the build tool explicit at the app level
  * Aligns with the v7 migration plan ([Issue #1900](https://github.com/NASA-IMPACT/veda-ui/issues/1900))
  * Parcel-specific tooling (`/parcel-resolver/`, `/parcel-transformer/`) remains at the repo root as legacy infrastructure and will be removed when Parcel is deprecated in v7

### Deferred

The following items are intentionally deferred to v7 to avoid further incremental refactors in v6:

* Migration from Parcel to Vite (tracked in [Issue #1900](https://github.com/NASA-IMPACT/veda-ui/issues/1900))
* Relocating Storybook under `apps/` (e.g. `apps/storybook/`)

These changes are coupled to the broader v7 reset and will be addressed as part of that effort rather than incrementally in v6.

## Parcel notes / v7 follow-ups

* v6 runnable dashboard: `apps/dashboard-parcel/`.
* Legacy Parcel tooling remains at repo root (e.g. `/parcel-resolver/`, `/parcel-transformer/`) and can be removed when Parcel is deprecated (v7, see [Issue #1900](https://github.com/NASA-IMPACT/veda-ui/issues/1900)).
* Once we migrate away from Parcel (v7, see [Issue #1900](https://github.com/NASA-IMPACT/veda-ui/issues/1900)) and introduce a new dashboard build (e.g. `apps/dashboard-vite/`, `apps/dashboard-nextjs/`), update:
  * Docs that reference Parcel paths/behavior (e.g. `docs/content/MDX_BLOCKS.md`, `docs/development/ARCHITECTURE.md`, `docs/development/DEPLOYMENT.md`, `docs/development/PAGE_OVERRIDES_DEV.md`, `docs/development/SETUP.md`).
  * Tests + test infra that assume Parcel paths (Playwright paths, TS `$test/*` alias, scripts referencing `apps/dashboard-parcel/`).
  * Build targets: Parcel `targets.veda-app` (and related scripts) to the new app entrypoint.

## Direction

* Keep exportable library code under `packages/veda-ui/`
* Keep runnable apps under `apps/`
* Build-tool-specific apps use naming pattern: `apps/{app-name}-{build-tool}/`
  * Example: `apps/dashboard-parcel/` (v6, Parcel-based)
  * Future: `apps/dashboard-vite/` or similar (v7, see [Issue #1900](https://github.com/NASA-IMPACT/veda-ui/issues/1900))
  * Non-goal: support multiple dashboard implementations/build tools at the same time. The intent is to make the build tool explicit and enable a clean replacement during v7 migration.
* Storybook placement is flexible; recommendation is to colocate it with the library package (`packages/veda-ui/storybook/`) when practical
* Prefer incremental migration and preserve compatibility exports during transition
* Build tooling work is related but out-of-scope here and should likely be addressed in v7 (see [#1889](https://github.com/NASA-IMPACT/veda-ui/issues/1889) and [#1900](https://github.com/NASA-IMPACT/veda-ui/issues/1900))

## References

* [PR #1871](https://github.com/NASA-IMPACT/veda-ui/pull/1871) - Introduces ADR 004 (by @AliceR)
* [PR #1898](https://github.com/NASA-IMPACT/veda-ui/pull/1898) - Established monorepo structure (`packages/veda-ui/`)
* [PR #1957](https://github.com/NASA-IMPACT/veda-ui/pull/1957) - Move parcel dashboard to `/apps/dashboard-parcel/`
* [Issue #1889](https://github.com/NASA-IMPACT/veda-ui/issues/1889) - Version 7 Roadmap
* [Issue #1900](https://github.com/NASA-IMPACT/veda-ui/issues/1900) - Migrate Parcel to Vite (v7 epic)
* [ADR 006: VEDA2 Architecture Refactor](./006-veda2-architecture-refactor.md)
* [Architecture documentation](../development/ARCHITECTURE.md)
