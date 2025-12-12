
# ADR 005: Ticket Workflow Governance

- **Status:** Rejected
- **Date:** 2025-11-21
- **Authors:** @vgeorge, @ifsimicoded
- **Superseded by:** [ADR - GitHub project organization and issue management](https://github.com/NASA-IMPACT/veda-ui/pull/1954)

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

## Evolution and New Direction

After this ADR was rejected, the team shifted to a broader approach that acknowledges the project board-driven workflow. See [PR #1927 comments](https://github.com/NASA-IMPACT/veda-ui/pull/1927) (especially from @ifsimicoded) and the new ADR in [PR #1954](https://github.com/NASA-IMPACT/veda-ui/pull/1954) for the updated approach focusing on:

- Epic-driven organization with project fields (not repo-level metadata)
- Cross-repo and cross-org consistency
- Issue templates and formalized guidelines
- GitHub project board integration

The new ADR addresses the original concerns while working within the constraints of the actual project board-driven workflow.

## Consequences

- This ADR is rejected and will not be implemented.
- The existing workflow (GitHub project board driven) remains in place.
- See [PR #1954](https://github.com/NASA-IMPACT/veda-ui/pull/1954) for the new ADR documenting the broader approach to GitHub project organization and issue management.
