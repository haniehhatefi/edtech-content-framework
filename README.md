# EdTech Content Management Framework (CMF)

**A localization-readiness framework for structured educational content.**

CMF helps small EdTech teams (5–7 people) create, manage, and localize educational content without requiring a dedicated localization agency. It combines structured content schemas, cultural readiness checklists, a defined content workflow, and automated validation.

**Current version:** v2.0.0  
**License:** MIT  
**Status:** Open-source design and implementation framework.

[Project Website](https://haniehhatefi.it/content-framework/) · [GitHub Repository](https://github.com/haniehhatefi/edtech-content-framework)

---

## The Problem

Small EdTech teams typically build content in one language and consider localization later. Without a structured system, this can lead to:

- Full rewrites after production because content was not designed for adaptation.
- Unclear ownership of content review, approval, and maintenance.
- Translations that are linguistically correct but culturally misaligned.
- Inconsistent terminology across languages.
- Developer involvement in routine content changes.
- Localization defects that only become visible during translation or quality assurance.

CMF addresses these challenges by integrating localization considerations into the content lifecycle, rather than treating translation as a final production step.

## Research Foundation

This framework builds on research by Hanieh Hatefi on [English-default interfaces](https://haniehhatefi.it/multilingual-ux/), examining how multilingual users perceive interfaces designed primarily around English.

The framework translates some of these research considerations into a practical content-management and localization workflow.

## Framework Structure

```text
edtech-content-framework/
├── schemas/
│   ├── lesson.schema.json
│   ├── question.schema.json
│   ├── feedback.schema.json
│   ├── ui-label.schema.json
│   └── glossary.schema.json
├── checklists/
│   ├── universal.md
│   └── lang/
├── examples/
│   └── job-search-italy/
├── glossary/
│   └── it.json
├── workflow/
├── cmf.config.json
├── validate.js
├── package.json
├── package-lock.json
├── LICENSE
└── README.md
```

## Three Core Components

### 1. Content Architecture (`/schemas`)

CMF provides structured JSON Schema definitions for four core content types used in educational software:

| Schema | Purpose |
|---|---|
| `lesson.schema.json` | Instructional content units |
| `question.schema.json` | Assessment and quiz items |
| `feedback.schema.json` | Correct, incorrect, and hint messages |
| `ui-label.schema.json` | Interface strings and microcopy |
| `glossary.schema.json` | Approved terminology definitions |

These schemas establish a consistent structure for content creation, review, and localization.

### 2. Cultural Readiness Checklists (`/checklists`)

The framework uses a two-layer checklist system.

**Universal checklist**

`checklists/universal.md`

Provides language-independent cultural readiness checks to be completed before localization.

**Language-specific checklists**

The language-specific checklists address linguistic and cultural considerations that may require additional review:

- Italian (`it`): grammatical gender, Lei/tu register, and formality.
- Spanish (`es`): vosotros/ustedes, regional variation, and tone.
- French (`fr`): tu/vous, register sensitivity, and cultural context.
- German (`de`): Sie/du, compound nouns, and formality expectations.
- Dutch (`nl`): je/u, directness, and diminutives.
- Swedish (`sv`): du-reform, hierarchy norms, and informality.

These checklists support human review and do not replace professional linguistic assessment.

### 3. Content Workflow (`/workflow`)

The framework defines a five-stage content lifecycle:

**Draft → Cultural Review → Translation → QA → Publish**

The workflow also supports feedback from translators.

When an issue cannot be resolved through translation alone, a translator can raise a query that triggers clarification or revision of the original source content.

---

## What's New in v2.0.0

Version 2.0 extends the original framework with seven improvements.

### 1. Per-locale character limits

The `maxLength` property in the UI-label schema supports both a single integer and an object containing a default limit and locale-specific overrides.

Example:

```json
{
  "maxLength": {
    "default": 20,
    "de": 28,
    "fi": 36
  }
}
```

This allows character constraints to reflect differences between languages rather than relying exclusively on source-language limits.

### 2. Text expansion warnings

The validator reads locale-specific text expansion multipliers from `cmf.config.json`.

It uses these values to identify potentially restrictive character limits and generate warnings when a single-integer `maxLength` may not accommodate a target locale.

These warnings are indicators for further review, not definitive runtime layout checks.

### 3. Translator-query status

The `translator-query` status is available across all four content schemas.

When an item uses this status, the validator requires at least one `localeReadiness` entry containing a `translatorQuery.query` field.

This creates a structured mechanism for documenting translation questions and requesting source clarification.

### 4. Translation-ready status

The `translation-ready` status identifies content that has completed its preparation for translation.

The validator generates a warning when an item with this status does not have `meta.frozen` set to `true`.

### 5. Source freezing and ICU metadata

Two optional metadata fields are available across all four content schemas:

- `meta.frozen`: indicates whether the source content is locked.
- `meta.icu`: identifies content using ICU MessageFormat syntax.

**Limitation:** ICU metadata is currently supported, but automated ICU syntax and grammatical variation validation have not yet been implemented. This is planned for v3.

### 6. Translation staleness detection

The `sourceVersion` field in `localeReadiness` records the source version associated with a translation.

The validator compares this value against the current source item's `meta.version` and generates a warning when the versions do not match.

This helps identify translations that may need updating after source revisions.

### 7. Glossary consistency

Version 2 introduces:

- `schemas/glossary.schema.json`
- `glossary/it.json`
- `cmf.config.json`

The Italian glossary contains nine approved terms covering mathematics and the job-search domain.

The validator checks translated lesson `keyTerms` containing a `sourceTerm` field against the approved glossary translations.

This supports terminology consistency across translated educational content.

---

## Languages Covered

The framework currently includes the following language considerations:

| Language | Locale codes | Key considerations |
|---|---|---|
| English | `en` | Baseline / source language |
| Italian | `it` | Grammatical gender, Lei/tu |
| Spanish | `es`, `es-419` | Vosotros/ustedes, regional variation |
| French | `fr`, `fr-CA` | Tu/vous, regional variation |
| German | `de` | Grammatical gender, case, Sie/du |
| Dutch | `nl`, `nl-BE` | Je/u, regional variation |
| Swedish | `sv` | Du-reform, informality |

Language coverage in the framework refers to the availability of relevant localization considerations and checklists, not complete translations of every resource.

---

## Quick Start

### Requirements

- Node.js
- npm

### Step 1 — Clone the repository

```bash
git clone https://github.com/haniehhatefi/edtech-content-framework.git

cd edtech-content-framework
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Create a content item

Choose one of the four content types and use its corresponding schema and example as a starting point:

- `schemas/lesson.schema.json`
- `schemas/question.schema.json`
- `schemas/feedback.schema.json`
- `schemas/ui-label.schema.json`

Set `meta.status` to `"draft"` and complete the required fields.

### Step 4 — Review cultural readiness

Start with:

`checklists/universal.md`

Then select the relevant language-specific checklist.

For example:

`checklists/lang/it.md`

Record the cultural readiness assessment in the content item's `localizationFlags`.

### Step 5 — Translate and manage feedback

Translate using the structured content schema as the source of reference.

When a translation issue requires source clarification, use the `translator-query` status and provide the required query information in `localeReadiness`.

Review source versions when translations are updated.

### Step 6 — Validate content

Run the validator against the example directory:

```bash
node validate.js examples/
```

You can also validate an individual JSON file:

```bash
node validate.js path/to/content.json
```

The validator checks JSON files against their corresponding schemas and performs additional semantic checks.

### Validation output

The validator reports:

- Schema validation errors.
- Missing or inconsistent placeholders.
- Duplicate variable names.
- Static UI-label character-limit violations.
- Multiple-choice answer inconsistencies.
- Missing locale-readiness information.
- Text expansion warnings.
- Translation source-version mismatches.
- Glossary inconsistencies.
- Missing translator-query information where required.

All eight example files have been migrated to the v2 schema structure and passed the v2 validation run.

---

## Who Is This For?

CMF is designed primarily for:

- Small EdTech product teams (5–7 people).
- Teams developing educational content in one language before expanding internationally.
- Teams without a dedicated localization agency.
- Content designers and instructional designers working alongside developers.
- Product teams looking to introduce structured content management and localization checks.

### Single-reviewer teams

In smaller teams, one person may perform multiple roles.

The main recommendation is that the person who writes a content item should not also be its sole cultural reviewer.

Other responsibilities, such as translation, QA, and content ownership, can be combined depending on the team's capacity.

---

## Limitations and Future Development

CMF is an evolving design and implementation framework. Its schemas and validator provide structural and semantic checks, but they do not replace professional linguistic review, cultural assessment, or in-context localization testing.

Current limitations include:

- ICU MessageFormat syntax and grammatical variation are not yet automatically validated.
- Text expansion warnings rely on configured multipliers and do not guarantee that translated strings will fit in the interface.
- Static character-limit checks do not account for runtime variable substitution.
- Glossary validation currently focuses on translated lesson key terms with a `sourceTerm` field.
- Cultural readiness checklists require human assessment and contextual interpretation.

Further development is needed to evaluate the framework's effectiveness in real-world EdTech localization workflows.

### Planned development

Future work may include:

- Automated ICU MessageFormat validation.
- Plural and gender variation checks.
- More extensive locale-specific validation.
- Expanded glossary support.
- Further testing with real-world EdTech content workflows.

These are development directions, not features currently implemented in v2.0.0.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Author

**Hanieh Hatefi**

UX Researcher | Multilingual UX | Content Design

[Portfolio](https://haniehhatefi.it/) · [LinkedIn](https://www.linkedin.com/) · [GitHub](https://github.com/haniehhatefi)

---

**Project website:** https://haniehhatefi.it/content-framework/  
**Repository:** https://github.com/haniehhatefi/edtech-content-framework
