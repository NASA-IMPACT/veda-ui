
# ADR 004: Ticket Workflow Governance

- **Status:** Draft
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

Adopt the workflow in `docs/development/ticket-organization-guidelines.md` and enforce it through templates and automation.

1. **Issue Types (required)**
   - Every issue must specify GitHub Issue Type (`Bug`, `Feature`, `Task`).
   - **Bug**: Unexpected problem or broken behavior
   - **Feature**: New functionality or user-facing capability
   - **Task**: Refactors, tech debt, improvements to existing code, or non-user-facing work
   - For epics: Use **Task** for refactors/improvements (e.g., "USWDS Migration"), **Feature** for new capabilities (e.g., "Add CMS Integration")
   - Templates set defaults; reviewers reject issues without a type.
2. **Label Taxonomy**
   - Priority for Bugs: `P1–P3` (optionally `good first issue`).
   - Domain/type labels describe the nature of work (`documentation`, `ui`, `tech debt`, etc.).
   - Lifecycle tracking handled by project board, not labels.
3. **Epics as Parent Issues**
   - Large efforts (Version 7, USWDS) use a parent issue.
   - Sub-issues capture individual work items.
   - Thematic and long-running initiatives rely on epics + labels, not milestones.
4. **Milestones**
   - Previously used inconsistently and often mixed themes with releases.
   - Epics + sub-issues provide clearer structure and better visibility in Projects.
   - Milestones may be used only for explicit, date-bound work (e.g., timed releases).
   - Work without time commitments should avoid milestones to reduce overhead.
5. **Triage Checklist**
   - During triage: confirm issue type, assign priority, add domain labels, link to parent epic if applicable, and move to appropriate project board column.

## Consequences

- Contributors gain predictable metadata and more reliable filtering.
- Dashboards and automation become useful instead of guesswork.
- Triage becomes a repeatable process.
- Removing milestones from general planning simplifies structure.
- Templates and docs must be updated to prevent regressions.
