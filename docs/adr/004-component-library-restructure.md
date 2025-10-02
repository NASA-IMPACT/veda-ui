# Component Library Restructure: Consolidating Exported Components

* Status: **Proposed**
* Authors: @alice
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

Currently, the library exports are managed through `/app/scripts/libs/index.ts` which imports components from various locations throughout the application:

```ts
// Current scattered structure
export { PageHero } from '$components/common/page-hero';
export { CatalogContent } from './page-components';
export { PageHeader, PageFooter } from './uswds-components';
// ... many more scattered imports
```

## Decision Drivers

* **Developer experience**: Clear separation between library components and application code
* **Library evolution**: Clear path toward a standalone component library
* **Migration clarity**: Obvious location for new library components

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

### Option C: Gradual Migration with Renamed `/core` Directory (Recommended)

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

## Decision

**We choose Option C: Gradual Migration with Renamed `/core` Directory**

### Implementation Plan

#### Phase 1: Directory Restructure

1. **Rename `/storybook` → `/core`**
   * Update all references in scripts, documentation, and CI/CD
   * Update package.json scripts (e.g., `core:install`, `core:storybook`)

2. **Establish `/core` as Library Package Root**
   * Configure `/core` as the primary build target for library distribution
   * Set up Vite configuration for library building (in addition to Storybook)
   * Create clear export structure in `/core/src/index.ts`

#### Phase 2: Component Migration Strategy

1. **New components**: All new library components must be created in `/core/src/components/`
2. **Existing components**: Gradual migration based on:
   * Components undergoing major updates
   * Components with high reusability
   * Components needed for new library features

3. **Migration process per component**:
   * Move component to `/core/src/components/[category]/[component-name]/`
   * Update imports in main application to reference `/core`
   * Add Storybook stories in `/core/src/stories/`
   * Update library exports in `/core/src/index.ts`
   * Maintain backward compatibility exports in `/app/scripts/libs/index.ts` (temporary)

#### Phase 3: Build System Integration

**Current Library Build Process:**

* Entry: `/app/scripts/libs/index.ts`
* Build: Gulp + Parcel → `/lib/` directory
* Output: `main.js` (CommonJS), `module.js` (ES modules), `index.d.ts`, CSS, assets

**Transition Strategy Options:**

##### Option A: Re-export Strategy

```ts
// /core/src/index.ts (new entry point)
// Re-export from legacy locations during transition
export { PageHero } from '../../app/scripts/components/common/page-hero';
export { CatalogContent } from '../../app/scripts/libs/page-components';

// As components migrate to /core, update to:
export { PageHero } from './components/page-hero'; // migrated
export { CatalogContent } from '../../app/scripts/libs/page-components'; // still legacy
```

##### Option B: Dual Build Strategy

* Maintain current Parcel build from `/app/scripts/libs/index.ts`
* Add parallel Vite build from `/core/src/index.ts`
* Eventually shift package.json to point to Vite output

**Build System Migration:**

1. **Phase 3a**: Set up Vite build alongside Parcel (dual outputs)
2. **Phase 3b**: Update package.json to point to Vite output (when ready!)
3. **Phase 3c**: Deprecate Parcel build once all components migrated

#### Phase 4: Future State

Once all legacy dashboard instances are migrated:

1. **Replace project root** with `/core` directory structure
2. **Deprecate** `/app` directory and Gulp/Parcel build system
3. **Standalone package**: `/core` becomes the complete `@teamimpact/veda-ui` package

### Updated Directory Structure (Target State)

```text
/core/
├── package.json                 # Library dependencies and scripts
├── vite.config.ts              # Unified build configuration
├── .storybook/                 # Storybook configuration
└── src/
    ├── index.ts                # Main library exports
    ├── components/             # All library components
    │   ├── map/
    │   ├── timeline/
    │   ├── mdx/
    │   └── ...
    ├── hooks/                  # Exported hooks
    ├── styles/                 # Component styles (SCSS)
    ├── types/                  # TypeScript definitions
    └── stories/                # Storybook stories
```

### Benefits of This Approach

1. **Clear Component Library Identity**: `/core` clearly indicates the foundational library components
2. **Modern Development Environment**: Vite provides faster builds, better HMR, and modern tooling
3. **Unified Documentation**: Storybook and component development in the same environment
4. **Gradual Migration**: Low-risk transition that can happen incrementally
5. **Future-Proof Architecture**: Clear path toward standalone component library
6. **Improved Developer Experience**: Single location for all library development

### Migration Guidelines

#### For New Components

```ts
// ❌ Old way - Don't do this
/app/scripts/components/new-feature/my-component.tsx

// ✅ New way - Do this
/core/src/components/new-feature/my-component.tsx
```

#### For Component Updates

When updating existing components, prefer migrating them to `/core` if:

* The component is part of the public API
* The component is used across multiple instances
* The update is substantial (major refactor/redesign)

#### Import Strategy During Transition

```ts
// In application code, prefer core imports
import { MyComponent } from '../../../core/src/components/my-component';

// In library exports, re-export from core
export { MyComponent } from '../../core/src/components/my-component';
```

## Consequences

### Positive

* **Clearer architecture** with obvious library boundaries
* **Better developer experience** with modern tooling
* **Simplified maintenance** with unified build system
* **Future flexibility** for standalone library distribution
* **Improved component discoverability** for library consumers

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

## References

* [ADR 002: Application Architecture for Configurability](./002-application-architecture-for-configurability.md)
* [ADR 003: Design System Change](./003-design-system-change.md)
* [VEDA UI Development Documentation](../development/DEVELOPMENT.md)
* [Component Library Registry Documentation](../development/REGISTRY.md)
