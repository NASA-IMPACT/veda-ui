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
- Have defined owners of work
- Prevent orphan tickets / orphaned work / missed issues
- Help folks better understand how an issue should be defined. Creating guidelines could help folks better understand how to breakdown a body of work. (TBD - who own issue generation at different stages of a project)

These needs can be accomplished by agreeing to a structure of organizing information, using issue templates and just trying it out to see how it goes knowing it won't be perfect. Hopefully this can be a stepping stone to defining some project processes to facilitate better team alignment on work.

**Project is used to mean a body of work. Clarifying as project is a reserved github word that can mean something else.

### Is this broadly desired?
Currently I've seen different individuals put effort into implementing and suggesting (Thank you @vitor) systems for managing github issues and a strong desire to have all project work logged. That leads me to believe we need it, and there's appetite to align on one! So hopefully the buy-in is there.

### Constraints?
- The Development Seed and stakeholder teams currently organize work within Github project spaces (ex. [Veda Dashboard Team sprint board](https://github.com/orgs/NASA-IMPACT/projects/17)). Github projects allow us to manage issues distributed across repos in a centralized way. Repositories can have different settings for issue meta data (types, labels, etc) which require extra overhead to align across all repositories that not all team members will have access to do so. **That means we cannot rely on repo level meta data fields to organize our work**.
- IMPACT stakeholders need visibility into PI Objectives as issues that can be viewed on [this project board](https://github.com/orgs/NASA-IMPACT/projects/39/views/8)
- Users may already have existing workflows (@aboydnw) that need to be preserved or easily updated.
- We work on projects across organizations and share repos, so this system will need to also be shared out with and work for our collaborators so there's consistency across our shared repo issues.

## Proposed Guidelines

### Initiatives
All bodies of work should have a parent initiative captured in a GH Issue that will be a **living** document for the project for team members to reference both during and after the project work is completed. It should act as the central hub for documentation for the epic that can be referenced in the repo(s) README that results from the initiative.

The initiative issue should have: 
- an assigned project(s) of [Veda Dashboard Team](https://github.com/orgs/NASA-IMPACT/projects/17)
- a project issue type of initiative 
- an estimated start date and estimated delivery date (these could be as rough as quarters / PIs)
<img width="1259" height="779" alt="github issue project settings" src="https://github.com/user-attachments/assets/bcf25d27-d931-416b-a821-b8c7d0b560fe" />

- a title with an acronym, the word Initiative and a full name (ex. [EIE] Initiative - Earth Information Explorer)
- a summary of what the work entails / the problem it is solving
- the expected owners of the work
- the expected stakeholders of the work
- if there's an ongoing meeting, when it happens (so users can easily find the invite, gemini notes, and recordings)
- risks
- scope of work / what we have agreed to do and not to do 
(TBD - when this shows up in our project workflow, but it must be defined)
- deployed urls
- github repositories
- a resources sections which includes relevant document links (especially those not on GH) 
  - our contract,
  - product briefs, 
  - weekly sync notes, 
  - figmas
  - infrastructure docs that do not live within a github repository, 
  - external google docs, etc.

An issue template will be provided to assist in Initiative issue creation.

Keep in mind, this is a living document, so as new documents are created, they should be linked here and as high level project definition changes, that should be reflected here as well.

When an initiative is considered complete, if there are open tickets, a new Tech Debt issue should be created (ex. [Tech Debt] - EIE) under the parent initiative. All open tickets should be moved to sub-issues of this parent Tech Debt issue (or they may be closed as unplanned). [Tech Debt] issues can be used to track repo health.

### PI Objectives
An initiative will be broken down into sub-issues labeled PI Objectives to fulfill stakeholder progress tracking. 
The PI Objective issue should have:
- a parent issue of type initiative
- an assigned project(s) of [IMPACT Project Board](https://github.com/orgs/NASA-IMPACT/projects/39/views/8)
- a project name of VEDA
- a program increment that corresponds to the PI 
<img width="299" height="244" alt="github issue project settings" src="https://github.com/user-attachments/assets/cdb6421f-173d-4f02-ac58-d90fd314d3c8" />

- a title prefixed with the initiative acronym, year and quarter, (ex. [EIE] - 26.1 Objective 1: Prototype EIE)
- details not included in the parent initiative about the scope of work

An issue template will be provided to assist in PI Objective issue creation.

### Sub Issues
Tasks will be used to breakdown the work needed to complete an initiative. As timelines become more clear, these sub-issues can be moved under the appropriate Initiative's sub PI Objective ticket. Because these will be defined as issues under an initiative issue or a PI Objective issue, the hierarchy/relationship to the initiative or PI Objective will already be present. We should limit sub-issues to two levels beyond this for task visibility.

An Issue should have:
- a parent (unless it is the parent initiative or of type bug)
- a title prefixed with the epic acronym (ex. [EIE] Initial repo/application scaffolding)
- a subtitle if the issue will contain output that isn't production code, ie. ADR (it's my understanding that ADRs can be RFCs if their status is in progress / in review), Doc, Spike. (ex. [EIE] Spike: globe visualization, [EIE] Doc: deploy process). 
- a description
- as the project progresses, an assignee and a sprint assignment.
<img width="1020" height="554" alt="Screenshot 2025-12-10 at 12 00 55 PM" src="https://github.com/user-attachments/assets/242206a5-9437-4001-b6ed-5dd04456a6b5" />
- as the work is completed, for ADRs, Docs or Spikes or any body of work w/o a linked PR a link should be provided in the comments to the completed work for reference.
- continue to use labels for 'good first issue'

All issues (initiatives, Tech Debt, PI Objectives, sub-issues, bugs) should live in their relevant corresponding repo where possible. Otherwise our current practice is to manage issues in the `veda-ui` repo. 

### Bug Tickets

Bug tickets are operational issues that require immediate attention and are exempt from the hierarchical structure.

Bug tickets should:
- Not have a parent issue (unless the bug is directly tied to an Initiative implementation)
- Live in the repo where the bug occurs
- Use the existing bug template, including context, priority (P1/P2/P3), and reproduction steps
- Include an acronym prefix when Initiative-specific (e.g. `[EIE] Bug: Map not loading in Safari`)
- Link to relevant PI Objectives in the comments for visibility

Bug categorization:
- Initiative bugs: scoped to a specific Initiative implementation
- Infrastructure bugs: affect multiple repos or shared infrastructure
- Production bugs: live site issues requiring immediate fixes
### Pull Requests
- Should be linked to an issue. You can use [GH keywords](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword) like 'closes' or the `#` to bring up issue numbers to link without automations.
- PR title should follow [conventional commit](https://www.conventionalcommits.org) and include Initiative acronym for traceability (e.g., "fix: [EIE] Add globe component")    
- Required reviews: at least 1 technical reviewer
- Turnaround time: Review requests are expected to be addressed within 2 business days, unless other time is specific by the team maintaining the repository

## Helpful Github links on using Issues to manage projects including views to track progress
* https://docs.github.com/en/issues
* https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/changing-the-layout-of-a-view
* https://docs.github.com/en/issues/planning-and-tracking-with-projects/viewing-insights-from-your-project/about-insights-for-projects






