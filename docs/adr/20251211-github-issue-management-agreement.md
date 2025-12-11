# Team system for github issue management
* Status: In Progress
* Authors: @ifsimicoded
* Deciders: 
* As of: 

## Context and Problem Statement

### Current Needs
- To have a living body of centralized documentation for any project** that can be referenced during the project and after
- Simplify project progress tracking by PMs, stakeholders and contributors
- Simplify contributor task tracking (especially for ad-hoc contributors)
- Simplify onboarding/rebuilding context on projects as contributors hop around from project to project
- Simplify scanning issues in the Issues view (or any aggregated view) to identify what is relevant to project 
- Prevent orphan tickets / orphaned work / missed issues
- Help folks better understand how an issue should be defined. (Creating guidelines could help folks better understand how to breakdown a body of work)

These needs can be accomplished by agreeing to a structure of organizing information, using issue templates and just trying it out to see how it goes knowing it won't be perfect.

### Is this broadly desired?
Currently I've seen different individuals put effort into implementing and suggesting (Thank you @vitor) systems for managing github issues and a strong desire to have all project work logged. That leads me to believe we need it, and there's appetite to align on one! So hopefully the buy-in is there.

### Constraints?
- The Development Seed team currently organizes sprint work within our [Veda Dashboard Team project space](https://github.com/orgs/NASA-IMPACT/projects/17). Github projects allows us to manage issues in a centralized way that are distributed across repos often having different configs for issue meta data (types, labels, etc). That means we cannot rely on repo level meta data fields.
- Users may already have existing workflows (@aboydnw) that need to be preserved or easily updated.
- We work on projects across organizations and share repos, so this system will need to also be shared out with and work for our collaborators so there's consistency across our shared repo issues.

## Proposed Guidelines

### Epics 
(or maybe PI Objectives, I'm not yet sure @aboydnw how you prefer to organize bodies of work*, but I don't think these bodies of work should be tied to PIs as they can often span more than one PI).

All bodies of work should have a parent epic captured in a GH Issue that will be a **living** document for the project for folks to reference both during and after the project work is completed. It should act as the central hub for documentation for the epic that can be referenced in the final epic repo(s) README.

The epic/objective issue should have 
- as assigned project(s) so it can show up in our [Veda Dashboard Team project space](https://github.com/orgs/NASA-IMPACT/projects/17)
<img width="1156" height="483" alt="Screenshot 2025-12-10 at 11 55 14 AM" src="https://github.com/user-attachments/assets/bde8ecd3-44fa-4c12-94ee-5bd61463a5fb" />

- a title with an acronym and full name (ex. [EIE] Earth Information Explorer)
- a summary of what the work entails / the problem it is solving
- the expected owners of the work
- the expected stakeholders of the work
- if there's an ongoing meeting, when it happens (so users can easily find the invite, gemini notes, and recordings)
- an issue type of epic (with owner org access it would be easy [to add 'epic' as a ticket type](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/managing-issue-types-in-an-organization))
- an estimated start date and estimated delivery date
<img width="1269" height="471" alt="Screenshot 2025-12-11 at 12 22 02 PM" src="https://github.com/user-attachments/assets/2accce9b-d2da-4b35-87f4-9bfc1872ba56" />
- all related milestones (if relevant) where milestone fields have 
  - title 
  - summary
  - due date
- deployed urls
- a resources sections which includes relevant document links (especially those not on GH) like product briefs, repos, adrs, infrastructure docs, weekly sync notes, external google docs, etc.

Keep in mind, this is a living document, so as new documents are created, they should be linked here and as high level project definition changes, that should be reflected here as well.

When an epic is considered complete, any open tickets should be closed or moved to a Project specific Tech Debt epic (ex. [EIE - DEBT] Earth Information Explorer TECH DEBT)

### Milestones
If the epic/objective is a large body of work, sub-issues can be grouped into [milestones](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/about-milestones) for better tracking. Milestones are not issues, they are meta data attached to an issue (like a label) but can have a title, description, due date. Issues can easily be prioritized under a milestone by dragging and dropping.

### Sub Issues
Tasks will be used to breakdown the work needed to complete an epic. Because these will be defined as issues under an epic issue, the heirarchy/relationship to the epic will already be present. We should limit sub-issues to two levels for task visibility.

An Issue should have:
- a parent (unless it is the parent epic or of type bug. Even [Tech Debt] can have it's own epic that can be used to track repo health)
<img width="356" height="202" alt="Screenshot 2025-12-10 at 12 22 24 PM" src="https://github.com/user-attachments/assets/9d3069e1-571d-4eb0-81c4-e55c27feede5" />

- a title prefixed with the epic acronym (ex. [EIE] Initial repo/application scaffolding)
- a subtitle if the issue will contain output that isn't production code, ie. ADR (it's my understanding that ADRs can be RFCs if their status is in progress / in review), Doc, Spike. (ex. [EIE] Spike: globe visualization, [EIE] Doc: deploy process). 
- a description
- as the project progresses, an assignee and a sprint assignment.
<img width="1020" height="554" alt="Screenshot 2025-12-10 at 12 00 55 PM" src="https://github.com/user-attachments/assets/242206a5-9437-4001-b6ed-5dd04456a6b5" />
- as the work is completed, for ADRs, Docs or Spikes or any body of work w/o a linked PR a link should be provided in the comments to the completed work for reference.
- continue to use labels for 'good first issue'

All issues (epics, sub-issues, bugs) should live in their relevant corresponding repo where possible. Otherwise our current practice is to manage issues in the `veda-ui` repo. 

### Pull Requests
- Should be linked to an issue. You can use [GH keywords](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword) like 'closes' or the `#` to bring up issue numbers to link without automations.

**Project is used to mean a body of work. Clarifying as project is a reserved github word that can mean something else.

## Helpful Github Links on using Issues
* https://docs.github.com/en/issues






