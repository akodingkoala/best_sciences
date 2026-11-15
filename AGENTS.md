# AGENTS.md

Shared context for every AI agent (and human) working in this repo.
Read this first. If something here is out of date, fix it in the same commit as your change.

Source of truth for event facts: `HackRx Kickoff (Fall 2026).pdf` in this repo.

## Mission

- **Event:** HackRx 2026 (SacHacks × UC Davis School of Medicine), Sunday Nov 15, 2026, UC Davis Health, Sacramento.
- **Team:** 3 people (max team size is 3). One track per team.
- **Target:** Track 01, **Best Translational Science**, first place.
- **Prize:** Bose QuietComfort SC Headphones, one for every winning team member.
- **Track sponsor:** UC Davis Department of Biomedical Engineering.

## What the track asks for

Track theme: *move discoveries closer to real patients and clinical settings.*

How to qualify (the deck labels these "suggested track fit criteria"):

1. Connect a research insight to a practical healthcare application.
2. Demo the functional tool, interface, or translational workflow.
3. Show a plausible path for validation, feasibility, and adoption.

Every feature should serve one of these three. If it serves none, it is out of scope.

## Hard requirements (confirmed, apply to every team)

"Not just a pitch. A product." The project must have all four:

1. **Functional model** – a working model or solution connected to the use case.
2. **Actual frontend** – a usable interface judges can navigate.
3. **Hosted demo** – live access to the app during judging.
4. **Interactive use case** – one concrete end-to-end scenario judges can try themselves.

## Judging

- Roaming judges visit teams between 7:00 and 9:00 PM.
- **3–4 minutes per demo**: a focused presentation, then judges test the live app.
- Selected track finalists present to the full audience and grand judging panel.
- Judges score what the project does, not what it could do.

## Timeline (Pacific Time, Nov 15)

| Time | Event |
| --- | --- |
| 9:00 AM – 12:00 PM | Hacking session 1 (mentors available) |
| 12:00 – 1:00 PM | Lunch |
| 1:00 – 4:00 PM | Hacking session 2 (mentors available) |
| 4:00 – 6:00 PM | Hacking session 3, final build period |
| 6:00 – 7:00 PM | Dinner |
| **7:00 PM** | **Must be judge-ready** |
| 7:00 – 9:00 PM | Demos and judging |
| 9:00 – 9:15 PM | Awards |

Internal checkpoints (proposed, edit as a team):

- 11:00 AM – idea, user, and demo scenario locked
- 1:00 PM – skeleton app deployed to a public URL
- 4:00 PM – end-to-end scenario works on the hosted app
- 5:30 PM – feature freeze; fixes and polish only
- 6:00 PM – demo rehearsed and timed under 4 minutes

Open question: submission platform and upload cutoff were not announced at kickoff. Ask an organizer and record the answer here.

## Project

Fill these in once decided. Keep each to one or two lines.

- **Name:** TBD
- **Problem:** TBD
- **Research insight we build on (with citation/link):** TBD
- **User:** TBD (clinician, researcher, patient, lab staff?)
- **Demo scenario judges will try:** TBD
- **Validation / feasibility / adoption path:** TBD
- **Stack:** TBD
- **Hosted URL:** TBD
- **Data sources:** TBD

## Team

| Person | GitHub | Owns |
| --- | --- | --- |
| TBD | TBD | TBD |
| TBD | TBD | TBD |
| TBD | TBD | TBD |

## Current state

Update this whenever you finish a chunk of work, so the next agent or teammate can pick up cold.

- **Last updated:** Nov 15, ~10:00 AM
- **Done:** repo created, kickoff deck added, this file written
- **In progress:** choosing the project idea
- **Next:** lock idea and demo scenario, pick stack, deploy skeleton
- **Blocked:** nothing

## Decisions log

Newest first. One line each: time, decision, why.

- 10:00 AM – Targeting Track 01 Best Translational Science (headphones).

## Working rules for agents

- `git pull` before starting work; commit small and push often so other devices stay in sync.
- `main` must always be deployable. The hosted demo is a judging requirement, so never push something that breaks it.
- Do not force-push or rewrite history.
- Update **Current state** and **Decisions log** in the same commit as the work they describe.
- Do not overwrite another person's in-progress section or files without checking the Team table.
- No secrets in the repo: API keys go in `.env` (gitignored) and in the host's environment settings.
- No real patient data. Use public or synthetic datasets only, and record the source under Data sources.
- Any medical or scientific claim shown in the app or pitch needs a source. Do not invent citations, statistics, or validation results.
- Prefer finishing the one end-to-end demo scenario over adding breadth.
- When unsure about scope, check it against the three track criteria above.
