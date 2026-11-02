# EdTech Content Management Framework (CMF)

A practical framework for small EdTech teams (5–7 people) to create, manage, and localize educational content without a dedicated localization agency.

## The Problem

Small EdTech teams typically build content in one language, then discover they need to localize it. They may also lack the budget to work with localization agencies or hire dedicated localization specialists. Without a structured system, this leads to:

- Full rewrites after production because content was never designed for adaptation.
- No clear ownership of who reviews, approves, or updates content.
- Translations that are linguistically correct but culturally misaligned.
- Developer involvement in routine content changes.

This framework addresses these challenges before production, rather than after localization becomes necessary.

## Research Foundation

This framework builds on Hanieh Hatefi's research on [English-default interfaces in multilingual UX](https://haniehhatefi.it/multilingual-ux/), which examines how interfaces designed primarily for English-speaking audiences can affect multilingual users' trust and perceptions of digital products.

The framework applies this perspective to educational content architecture and localization workflows.

## Framework Structure

```text
edtech-content-framework/
├── schemas/              # Content type definitions (JSON Schema)
├── checklists/           # Cultural readiness checklists per language
├── workflow/             # Content lifecycle process
└── examples/             # Annotated usage examples
```

## Three Pillars

### 1. Content Architecture (`/schemas`)

Structured definitions for four core content types in educational software:

- `lesson.schema.json` — instructional content units.
- `question.schema.json` — assessment and quiz items.
- `feedback.schema.json` — response messages (correct, incorrect, hint).
- `ui-label.schema.json` — interface strings and microcopy.

Each content type includes structured metadata to support content management, review, and localization.

### 2. Cultural Readiness Checklists (`/checklists`)

A two-layer system for evaluating content before translation.

**Universal checklist**

`universal.md` covers language-independent considerations, including scenario specificity, idiomatic content, cultural references, text direction, and localization infrastructure.

**Language-specific checklists**

- `it.md` — Italian: grammatical gender, Lei/tu register, formality.
- `es.md` — Spanish: vosotros/ustedes, regional variation, tone.
- `fr.md` — French: tu/vous, register sensitivity, cultural context.
- `de.md` — German: Sie/du, compound nouns, formality expectations.
- `nl.md` — Dutch: je/u, directness, diminutives.
- `sv.md` — Swedish: du-reform, hierarchy norms, informality.

Checklist items are intended to support contextual review rather than impose universal rules for every language or market.

### 3. Content Workflow (`/workflow`)

A five-stage process designed to separate content decisions from routine developer workflows:

```text
Draft → Cultural Review → Translation → QA → Publish
```

An additional archived status is available for retired content.

The workflow separates authoring, cultural review, translation, and quality assurance into distinct stages. One core rule is that the person who authored an item cannot serve as its own cultural reviewer.

## Who This Is For

- EdTech product teams of 5–7 people.
- Teams currently working in one language with plans to expand.
- Small teams without the budget for a dedicated localization agency.
- Content designers and writers working alongside developers.
- Educational product teams that want to introduce localization considerations earlier in content production.

## Languages Covered

| Language | Code | Notes |
|---|---|---|
| English | `en` | Baseline / source language |
| Italian | `it` | Grammatical gender, Lei/tu register |
| Spanish | `es`, `es-419` | Vosotros/ustedes, regional variation |
| French | `fr`, `fr-CA` | Tu/vous, regional variation |
| German | `de` | Grammatical gender and case, Sie/du register |
| Dutch | `nl`, `nl-BE` | Je/u register, regional variation |
| Swedish | `sv` | Du-reform, formality and informality |

## Quick Start

### Step 1 — Write your first content item

Choose a content type and use the corresponding schema as your starting point:

- `schemas/lesson.schema.json` — a lesson.
- `schemas/question.schema.json` — a quiz question.
- `schemas/feedback.schema.json` — a correct/incorrect message.
- `schemas/ui-label.schema.json` — a button or interface string.

Set `meta.status` to `"draft"` and complete all required fields.

### Step 2 — Run the universal checklist

Open [`checklists/universal.md`](./checklists/universal.md).

Score each category from 0–2 and record the total in `localizationFlags.culturalReadinessScore`.

Content scoring 0–2 should be revised before proceeding to language-specific review.

### Step 3 — Run the language-specific checklist

Open the checklist for your target language, such as [`checklists/lang/it.md`](./checklists/lang/it.md).

Review each section with someone familiar with the target language and cultural context.

### Step 4 — Translate

Translation should be performed directly from the structured content files rather than from an independently extracted document or spreadsheet.

The schema fields identify the content to translate and the metadata that should remain unchanged.

### Step 5 — Validate

Install dependencies and run the validator:

```bash
npm install
node validate.js examples/
```

See the worked example in [`examples/job-search-italy/`](./examples/job-search-italy/).

## Single-Reviewer Teams

In a team of 5–7 people, one person often fills multiple roles. The one hard rule is that the person who wrote the content should not serve as its own cultural reviewer for the same item.

Other roles can be combined according to team capacity. For example, the cultural reviewer and translator may be the same person, as may the QA reviewer and content owner.

## Limitations

The framework is a practical design artifact and has not undergone empirical validation.

Its cultural readiness scoring thresholds are based on design judgment rather than empirical calibration. Inter-rater reliability has not been tested.

The current implementation focuses on seven European languages and an illustrative Italian job-search education scenario. Its applicability to other languages, scripts, educational domains, and localization environments requires further development and evaluation.

The framework also does not currently provide automated validation for every language-specific grammatical variation, including pluralization and grammatical gender.

It should therefore be treated as an adaptable starting point rather than an empirically validated method for reducing localization costs or improving learning outcomes.

## Future Development

Potential improvements include:

- **Per-locale character limits:** Support for locale-specific `maxLength` overrides rather than relying on a single source-language limit.
- **ICU MessageFormat-aware validation:** Improved handling of plural forms and gender-related message variations.
- **Translator-query workflow:** A status allowing translation-stage issues to trigger revisions to source content.
- **Expanded language coverage:** Additional language-specific checklists and regional variations.
- **Further examples:** Worked examples from additional EdTech domains and educational contexts.

These are proposed development directions and should not be interpreted as features already implemented in the current version.

## License

MIT — see [LICENSE](./LICENSE).

## Author

**Hanieh Hatefi**

Independent Researcher in Multilingual UX and Content Design.

Website: [haniehhatefi.it](https://haniehhatefi.it)
