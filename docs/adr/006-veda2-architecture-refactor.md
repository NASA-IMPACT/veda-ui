# Documentation of VEDA2 Architecture Refactor

* Status: Partially implemented
* Authors: @vgeorge
* As of: December 2025
* Purpose: Document architectural work started in 2024
* Label: [veda v2 issues](https://github.com/NASA-IMPACT/veda-ui/labels/veda%20v2)

## Context

In 2024, the VEDA team undertook significant architectural work (dubbed **VEDA2**) to modernize the UI library. This ADR documents that work and its outcomes, capturing the current state of the architecture as of December 2025.

The work addressed limitations in the original submodule-based approach:

* Complex integration requiring git submodules and custom Parcel resolvers
* Tightly coupled architecture with embedded data management
* Limited support for modern build tools like Vite and NextJS
* Maintenance burden from container patterns across instances

This architectural evolution runs in parallel with discussions captured in the [Version 7 Roadmap](https://github.com/NASA-IMPACT/veda-ui/issues/1889) and [Maintenance Mode](https://github.com/NASA-IMPACT/veda-ui/issues/1912) tickets.

## Approach

The work shifted from a monolithic, submodule architecture toward a modular, library-based model that supports:

1. **Direct component consumption** instead of wrapper containers
2. **npm package distribution** instead of git submodules
3. **Decoupled data layer** for better separation of concerns
4. **Modern build tools support** (Vite, NextJS, etc.)

## Outcomes

### Completed

#### Data layer ([#802](https://github.com/NASA-IMPACT/veda-ui/issues/802)) — PR [#893](https://github.com/NASA-IMPACT/veda-ui/pull/893)

* Data scaffold in `/data-layer/datasets`
* Datasets dependency removed from Data Catalog
* Pattern for data-agnostic components
* Data managed directly in page views

#### Core modularization

**Data Catalog** — PR [#930](https://github.com/NASA-IMPACT/veda-ui/pull/930)

* Layout components moved to wrappers
* `prepareDatasets` extracted
* Initial data-agnostic component refactors

**Map / Exploration** — PR [#962](https://github.com/NASA-IMPACT/veda-ui/pull/962)

* Exploration extracted as core UI feature
* `ExplorationMap` and `Timeline` as reusable components
* State lifted to container level
* Sandbox examples for direct usage

**Time-series analysis** — [#900](https://github.com/NASA-IMPACT/veda-ui/issues/900)

* Composite feature extraction planned

#### NextJS prototype ([#947](https://github.com/NASA-IMPACT/veda-ui/issues/947))

* `next-veda-ui` repo created
* Validated modern React integration and direct consumption

#### Design system migration ([#804](https://github.com/NASA-IMPACT/veda-ui/issues/804))

* Started replacing DevSeed UI with USWDS
* Improved maintainability and Vite compatibility

#### Build pipeline ([#800](https://github.com/NASA-IMPACT/veda-ui/issues/800))

* Core UI library access layer
* Template instance scaffold ([#803](https://github.com/NASA-IMPACT/veda-ui/issues/803))

## Current State

Two patterns coexist:

1. **Legacy support** — containers marked with `@LEGACY-SUPPORT`
   * Examples: `DataCatalogContainer`, `ExplorationAndAnalysisContainer`
   * Keeps existing instances working

2. **VEDA2 pattern** — direct component usage with explicit data management

## Architecture Snapshot (Dec 2025)

### Legacy (current veda-ui)

* Submodule consumption
* Container wrappers managing data
* Virtual modules via custom Parcel resolver

### VEDA2 (available)

* Direct component consumption
* `/data-layer/datasets` architecture
* Library-style distribution (npm pattern)
* NextJS support via `next-veda-ui`

### Migration discussions

* **Version 7 Roadmap** ([#1889](https://github.com/NASA-IMPACT/veda-ui/issues/1889)) — breaking changes to clean up architecture
* **Maintenance Mode** ([#1912](https://github.com/NASA-IMPACT/veda-ui/issues/1912)) — possible freeze of veda-ui
* **VEDA Dashboard Future** — successor architecture direction

## References

### PRs

* [#893](https://github.com/NASA-IMPACT/veda-ui/pull/893) — Data layer scaffold
* [#930](https://github.com/NASA-IMPACT/veda-ui/pull/930) — Data Catalog modularization
* [#962](https://github.com/NASA-IMPACT/veda-ui/pull/962) — Map / Exploration breakout
* [next-veda-ui](https://github.com/NASA-IMPACT/next-veda-ui) — NextJS prototype

### Issues

* [Version 7 Roadmap](https://github.com/NASA-IMPACT/veda-ui/issues/1889)
* [Maintenance Mode](https://github.com/NASA-IMPACT/veda-ui/issues/1912)
* [VEDA2 label](https://github.com/NASA-IMPACT/veda-ui/labels/veda%20v2)
