# EdTech Localization Framework | Structured Learning Content

A practical framework for small EdTech teams (5–7 people) to create, manage, and localize educational content without a dedicated localization agency.

## The Problem

Small EdTech teams typically build content in one language — then discover they need to localize. Without a system, this leads to:
- Full rewrites after production because content was never designed for adaptation
- No clear ownership of who reviews, approves, or updates content
- Translations that are linguistically correct but culturally misaligned
- Developer involvement in every content change

This framework addresses the problem **before** production, not after.

## Research Foundation

This framework builds on Hanieh Hatefi's research on [English-default interfaces](https://haniehhatefi.it/multilingual-ux/), which found that content not designed for a multilingual audience causes trust erosion — not just comprehension failure.

## Framework Structure

```
edtech-content-framework/
├── schemas/              # Content type definitions (JSON Schema)
├── checklists/           # Cultural readiness checklists per language
├── workflow/             # Content lifecycle process
└── examples/             # Annotated real-world usage examples
```

## Three Pillars

### 1. Content Architecture (`/schemas`)
Structured definitions for the four core content types in educational software:
- `lesson.schema.json` — instructional content units
- `question.schema.json` — assessment and quiz items
- `feedback.schema.json` — response messages (correct, incorrect, hint)
- `ui-label.schema.json` — interface strings and microcopy

### 2. Cultural Readiness Checklists (`/checklists`)
Two-layer system:
- `universal.md` — language-agnostic cultural checks (run first, always)
- `/lang/it.md` — Italian: grammatical gender, Lei/tu register, formality
- `/lang/es.md` — Spanish: vosotros/ustedes, regional variation, tone
- `/lang/fr.md` — French: tu/vous, register sensitivity, cultural context
- `/lang/de.md` — German: Sie/du, compound nouns, formality expectations
- `/lang/nl.md` — Dutch: je/u, directness, diminutives
- `/lang/sv.md` — Swedish: du-reform, flat hierarchy norms, informality

### 3. Content Workflow (`/workflow`)
A five-stage process designed to keep developers out of content decisions:
```
Draft → Cultural Review → Translation → QA → Publish
```

## Who This Is For

- EdTech product teams of 5–7 people
- Teams with one language today and plans to expand
- Teams without budget for a localization agency
- Content designers and writers working alongside developers

## Languages Covered

| Language | Code | Notes |
|---|---|---|
| English | `en` | Baseline / source language |
| Italian | `it` | Grammatical gender, Lei/tu register |
| Spanish | `es`, `es-419` | Vosotros/ustedes, regional variation (Spain/Latin America) |
| French | `fr`, `fr-CA` | Tu/vous, regional variation (France/Quebec) |
| German | `de` | Grammatical gender and case, Sie/du register |
| Dutch | `nl`, `nl-BE` | Je/u register, nl-NL vs nl-BE variation |
| Swedish | `sv` | Du-reform, flat hierarchy norms |

## Quick Start

**Step 1 — Write your first content item**

Pick a content type. Copy the `examples` block from the relevant schema as your starting point:
- `schemas/lesson.schema.json` — a lesson
- `schemas/question.schema.json` — a quiz question
- `schemas/feedback.schema.json` — a correct/incorrect message
- `schemas/ui-label.schema.json` — a button or UI string

Set `meta.status: "draft"` and fill all required fields.

**Step 2 — Run the universal checklist**

Open [`checklists/universal.md`](./checklists/universal.md). Score each category 0–2 and record the total as `localizationFlags.culturalReadinessScore`. If the score is 0–2, revise the content before continuing.

**Step 3 — Run the language-specific checklist**

Open the checklist for your target language (e.g. [`checklists/lang/it.md`](./checklists/lang/it.md)). Work through each section with a reviewer who knows that language and culture.

**Step 4 — Translate**

Have a translator work from the schema file, not from a doc or spreadsheet. The schema fields define exactly what to translate and what to leave alone.

**Step 5 — Validate**

```bash
npm install
node validate.js examples/
```

See a worked end-to-end example in [`examples/job-search-italy/`](./examples/job-search-italy/).

---

## Single-reviewer teams

In a team of 5–7 people, one person often fills multiple roles. The one hard rule: **the person who wrote the content should not be their own cultural reviewer** for the same item. Everything else can be combined — the cultural reviewer and translator can be the same person, the QA and content owner can be the same person.

---

## License

MIT — see [LICENSE](./LICENSE).
