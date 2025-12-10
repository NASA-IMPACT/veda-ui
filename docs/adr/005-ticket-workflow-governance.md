
# ADR 005: Ticket Workflow Governance

- **Status:** Rejected
- **Date:** 2025-11-21
- **Authors:** @vgeorge

## Context

`NASA-IMPACT/veda-ui` shows low metadata consistency:

- <10% of the last 200 issues have labels.
- Only 25% of the last 100 issues use `issueType`.
- Parent/sub-issue links are rarely used, so large efforts lack structure.
- Label usage is uneven, making filtering and automation unreliable.

A clear workflow is needed so contributors and automation can rely on predictable metadata.

## Decision

**Rejected** - Following discussion on December 9, 2025 with Anthony Boyd, it was clarified that labels are not actually used to determine workflows in this project. Workflows are handled by the GitHub project board, not through label-based automation.

The proposed workflow governance in this ADR was based on incorrect assumptions about how the project manages its workflow processes. The original proposal included:

- Required issue types (Bug/Feature/Task) with templates and enforcement
- Label taxonomy for priorities and domain categorization
- Epic/sub-issue structure using parent issues
- Elimination of milestones in favor of project board tracking
- Triage checklist for consistent metadata application

However, this label-driven approach doesn't align with the actual project workflow where the GitHub project board handles workflow determination.

## Consequences

- This ADR is rejected and will not be implemented.
- The existing workflow (GitHub project board driven) remains in place.
- Future workflow documentation should focus on the actual project board processes rather than label-driven automation.
- A new ADR may be created in the future to document the current workflow when there is clarity on the project board processes.
