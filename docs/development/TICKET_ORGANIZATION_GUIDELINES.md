# Ticket Organization Guidelines

_See [ADR 005](../adr/005-ticket-workflow-governance.md) for rationale and decision record._

## Issue Types (Required)

Every issue must specify: **Bug**, **Feature**, or **Task**.

- **Bug**: Unexpected problem or broken behavior
- **Feature**: New functionality or user-facing capability
- **Task**: Refactors, tech debt, improvements to existing code, or non-user-facing work

_For epics: Use **Task** for refactors/improvements (e.g., "USWDS Migration"), **Feature** for new capabilities (e.g., "Add CMS Integration")._

## Labels

- **Priority (Bugs only):** Exactly one of `P1`, `P2`, or `P3`. Add `good first issue` for low-effort fixes.
- **Domain/Type:** `documentation`, `tech debt`, `testing`, `ui design`, `mdx-publication-tool`, `stac-integration` etc.

_Note: Lifecycle tracking is handled by the project board, not labels._

## Epics

Use parent issues with linked sub-issues. Avoid milestones for thematic work.

## Milestones

Only for explicit, date-bound releases. Close immediately after delivery.

## Triage Checklist

1. Set issue type (Bug/Feature/Task)
2. For bugs: assign priority (`P1/P2/P3`, optionally `good first issue`)
3. Add domain/type labels
4. Link to parent epic if applicable
5. Move to appropriate column in project board
