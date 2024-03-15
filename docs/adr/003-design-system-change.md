# Change of Design system

* Status: In Review, **In Progress**, Done
* Authors: @j08lue, @sandrahoang686, @faustoperez
* Deciders: @sandrahoang686, @hanbyul-here, @faustoperez, @j08lue
* As of: 2024/03

## Context and Problem Statement

When we started work on VEDA UI as an evolution of the [COVID-19 Dashboard](https://github.com/NASA-IMPACT/covid-dashboard), we chose a design system that the team was familiar with and that worked well for building responsive, mobile-first data-centric applications, the [DevSeed UI Library](https://github.com/developmentseed/ui-library-seed), developed and used at Development Seed.

Since then, the project has grown and especially in the adaptation of VEDA UI for the U.S. Greenhouse Gas Center and Earth Information Center, more needs for custom pages and feature additions have come up.

For the development of VEDA UI and adaptation for projects, the current UI library has become an obstacle:
1. The library does not include some standard components we have been needing, which means we have to re-invent wheels
1. The components are not optimized for accessibility (e.g. selected state), which is a requirement for NASA sites
1. The library is no longer actively maintained or used in new projects, such that implementing new components or features means a large overhead for a single project
1. Documentation is rudimentary - fine if you are familiar but lacking for external teams (VEDA's open-source commitment)
1. Community-maintained libraries have a great maturity, completeness with standard components, and good documentation


## Decision Drivers

- Cost-efficient
- Developer and designer velocity
- Ease of adaptation for external teams
- Ease of support for existing and new instances


## Considered Options

- [1] Keep current design system
- [2] Introduce new design system


## Decision Outcome

✔️ [2] Introduce new design system

We decided to Replace the existing custom design system with a well-maintained, widely adopted community-supported design system. This ensures built-in accessibility standards and eliminates the need for designers and developers to invest time in ongoing maintenance.

The preliminary systems we are considering are:
  * [Chakra UI](https://chakra-ui.com/). Built on React, it has a large component library, built-in accessibility and theming options. It is designed with responsive and mobile-first principles and has a strong community and documentation.
  * The [U.S. Web Design System (USWDS)](https://github.com/uswds/uswds) is tailored for government projects. It's designed to meet the specific needs of U.S. federal websites, offering components that are accessible, secure, and in line with U.S. digital standards.

Any option we choose will have to be extended for data visualization components (charts, maps, widgets, etc.) and themed for the 3 current VEDA instances: VEDA Dashboard, U.S. GHG Center, Earth.gov.


## Pros and Cons of the Options

### [1] Keep current design system
- 💚 No refactor costs
- 🚩 Maintenance costs carried by single project
- 🚩 Slower design and development for new components
- 🚩 Obstacle to external implementation and adaptation of VEDA UI

### [2] Introduce new design system
- 💚 Access to communty-developed features - more components we need, docs
- 💚 Improved accessibility out of the box
- 💚 Easier onboarding / external adaptation because of better documentation and community support
- 🚩 Larger investment into refactor and onboarding