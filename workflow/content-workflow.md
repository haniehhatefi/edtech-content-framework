# Content Workflow

A five-stage process for small EdTech teams to take content from idea to published — without requiring developer involvement in content decisions, and without skipping cultural preparation before translation.

---

## The Core Problem This Workflow Solves

Without a structured workflow, small teams tend to:
1. Write content in English, ship it, then discover localization needs
2. Mix content decisions with development decisions (every text change requires a developer)
3. Translate first, review culturally second — producing linguistically correct but contextually wrong content

This workflow inverts that: cultural review happens **before** translation, and content ownership is separated from code ownership.

---

## Roles

| Role | Responsibilities |
|---|---|
| **Content Author** | Writes initial content in source language (usually English). Fills schema fields. Completes universal checklist. |
| **Cultural Reviewer** | Evaluates content against the target language checklist. Flags adaptation needs. Does not translate. |
| **Translator** | Translates content that has passed cultural review. Works from the schema, not from a doc or spreadsheet. |
| **Content QA** | Verifies translated content against schema rules, length constraints, and consistency. |
| **Content Owner** | Final approver. Usually a product manager, lead designer, or team lead. |

In a 5–7 person team, one person can hold multiple roles — but the **author and cultural reviewer should not be the same person** for the same piece of content.

---

## The Five Stages

### Stage 1 — Draft

**Who:** Content Author  
**Entry condition:** Content type is defined (lesson / question / feedback / ui-label)

**Actions:**
1. Create a new content file using the appropriate schema.
2. Set `meta.status` to `draft`.
3. Fill all required fields.
4. Write `content.culturalNotes` — even a single line about tone intent or examples used.
5. Complete the [universal cultural readiness checklist](../checklists/universal.md).
6. Record the `culturalReadinessScore` in `localizationFlags`.

**Exit condition:** All required schema fields are filled. Universal checklist is complete. Score recorded.

**Gate:** Content with `culturalReadinessScore` of 0–2 does not advance — it returns to the author for rewrite.

---

### Stage 2 — Cultural Review

**Who:** Cultural Reviewer (must be familiar with the target language and culture — ideally a native speaker or someone with deep cultural knowledge)  
**Entry condition:** Draft is complete with checklist score ≥ 3

**Actions:**
1. Open the relevant language checklist (`/checklists/lang/<code>.md`).
2. Review the content against each checklist item.
3. Mark each item and add reviewer notes where adaptation is needed.
4. One of three outcomes:
   - **Approved:** Content is ready for translation as written.
   - **Approved with notes:** Content can be translated with documented changes. Add notes to `culturalNotes`.
   - **Returned:** Content requires rewrite before it can be translated. Return to Stage 1 with specific feedback.
5. Update `meta.status` to `cultural-review` (when in progress) or back to `draft` (if returned).

**Exit condition:** Reviewer has documented a clear outcome. Content is either approved or returned with specific notes.

**Gate:** Content is not sent to a translator until the cultural reviewer approves it.

---

### Stage 3 — Translation

**Who:** Translator  
**Entry condition:** Cultural review is complete and approved

**Actions:**
1. Translate the `content` fields. The schema structure and `localizationFlags` do not change.
2. In `meta`, the following fields **must** be updated for the translated file:
   - `meta.language` → set to the target language BCP-47 code (e.g. `it`, `de`, `fr`)
   - `meta.sourceLanguage` → set to the source language code (e.g. `en`)
   - `meta.sourceId` → set to the `id` of the source content item
   - `meta.status` → set to `translation` while in progress, then `qa` when complete
3. In `meta`, the following fields **must not** change:
   - `id` — the stable identifier. For translated content, use a new ID with a language suffix (e.g. `lesson-cv-italy-basics-it`)
   - `owner`, `version`, `formality`, `tags` — carry over unchanged from the source
   - `updatedAt` — update only when the translation itself changes
4. Respect `keyTerms` — translate the definitions if needed, but do not paraphrase the terms themselves.
5. Respect `maxLength` constraints in UI labels. If the translation exceeds the limit, note it — do not truncate on your own.
6. Apply the register (`formal`/`informal`) documented in `meta.formality`.
7. Apply language-specific typography rules from the language checklist.

**Exit condition:** All content fields are translated. Schema is valid. `meta.status` is `qa`.

---

### Stage 4 — Content QA

**Who:** Content QA (can be the cultural reviewer in small teams, but not the translator)  
**Entry condition:** Translation is complete, `meta.status` is `qa`

**QA checklist:**
- [ ] Register is consistent throughout (no mixing of formal/informal).
- [ ] All `keyTerms` are correctly translated and consistent across the content set.
- [ ] `maxLength` constraints are respected in all UI labels.
- [ ] Language-specific typography rules are applied (quotation marks, decimal separators, punctuation spacing).
- [ ] Grammar and agreement (gender, case, number) are correct.
- [ ] Tone matches the `toneIntent` documented in the schema.
- [ ] For feedback content: `highCulturalRisk` items have been culturally adapted, not literally translated.
- [ ] The translated content reads as native — not as translated from English.

**Exit condition:** All QA items pass, or failures are documented and returned for correction.

**Gate:** Content with unresolved `highCulturalRisk` items does not advance to published.

---

### Stage 5 — Publish

**Who:** Content Owner  
**Entry condition:** QA is complete with no open items

**Actions:**
1. Final review of the content in context (ideally in the actual UI, not just the schema file).
2. Set `meta.status` to `published`.
3. Set `meta.updatedAt` to today's date.
4. Increment `meta.version` — minor version for content edits (1.0 → 1.1), major version for structural changes (1.1 → 2.0).

**Post-publish:**
- Content marked `published` can be updated but never deleted — set to `archived` instead.
- Any update to published content restarts from Stage 1 for the changed fields.

---

## The Workflow at a Glance

```
[Content Author]          [Cultural Reviewer]       [Translator]         [QA]              [Owner]
     │                          │                        │                  │                 │
  Draft                         │                        │                  │                 │
  + Universal checklist         │                        │                  │                 │
     │                          │                        │                  │                 │
     ▼                          │                        │                  │                 │
  score ≥ 3? ──No──► Rewrite    │                        │                  │                 │
     │ Yes                      │                        │                  │                 │
     ▼                          ▼                        │                  │                 │
                         Cultural Review                 │                  │                 │
                         + Lang checklist                │                  │                 │
                              │                          │                  │                 │
                         Approved? ──No──► Return        │                  │                 │
                              │ Yes                      │                  │                 │
                              ▼                          ▼                  │                 │
                                                   Translation              │                 │
                                                        │                  │                 │
                                                        ▼                  ▼                 │
                                                                       Content QA            │
                                                                            │                │
                                                                       Pass? ──No──► Return  │
                                                                            │ Yes            │
                                                                            ▼                ▼
                                                                                         Publish
```

---

## What Developers Need From This Workflow

The workflow is designed so that developers are **not involved in content decisions**. What they need:

1. A stable `id` for every content item — it never changes after creation.
2. A clear `status` field — only `published` content appears in production.
3. The schema as a contract — so the frontend can be built against predictable field names and types.
4. `maxLength` constraints respected — so UI components don't break on longer translated strings.

Content changes, register decisions, and cultural adaptation decisions happen **before** the content enters the codebase.
