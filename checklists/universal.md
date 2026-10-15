# Universal Cultural Readiness Checklist

Run this checklist **after the first complete draft is written** — not before translation, and not mid-draft. These checks apply regardless of target language.

The goal is to catch content that is locked to one cultural context before it goes to a cultural reviewer. Fixing it at the draft stage costs minutes. Fixing it after production costs a full rewrite.

> **When to run it:** The author completes the draft, then works through this checklist before handing the content to the cultural reviewer. The score is recorded in `localizationFlags.culturalReadinessScore` as part of completing the draft stage.

---

## How to score

Each category is scored **0, 1, or 2**. The criteria for each score are defined in the category itself.

**2 — Clear:** All checkboxes in the category pass. No flags raised.  
**1 — Minor concern:** One checkbox fails, or a flag is present but documented. Proceed with a note.  
**0 — Problem present:** Two or more checkboxes fail, or a single high-impact flag is present (idiom without documentation, humor without review, scenario that cannot transfer). Do not advance to language-specific review without revision.

Sum the five category scores. Maximum total: **10**.

Record the result as `localizationFlags.culturalReadinessScore` in the content item's schema.

> **Note on subjectivity:** Scoring requires judgment. When reviewers disagree, take the lower score and document the disagreement in `content.culturalNotes`. The checklist is a communication tool, not a final verdict.

---

## Category 1 — Examples and Scenarios

- [ ] Examples do not depend on a specific country, city, or region.
- [ ] Scenarios could plausibly happen in the learner's context, not only in the content author's.
- [ ] Names used in examples are either generic ("a student", "a teacher") or explicitly flagged for adaptation.
- [ ] Units of measurement (distance, weight, currency, date format) are either universal or documented in `culturalNotes`.

**Score 2** — All four pass.  
**Score 1** — One checkbox fails, or a culturally specific element is present but documented.  
**Score 0** — Two or more checkboxes fail, or an undocumented local reference is embedded in the core logic of the content (the answer depends on knowing a local institution, currency, or norm).

**Red flags:** Local sports teams, national holidays, specific local foods, prices in one currency only, country-specific institutions as the subject of the question.

---

## Category 2 — Tone and Register

- [ ] The level of formality is intentional and recorded in `meta.formality`.
- [ ] The choice between formal and informal address is explicit — not assumed to match English defaults.
- [ ] Encouragement and correction language does not assume the same emotional response across cultures.
- [ ] Humor, if present, is documented with `localizationFlags.containsHumor: true` and noted in `culturalNotes`.

**Score 2** — All four pass. Formality is set. No undocumented humor.  
**Score 1** — Formality is set but one tone decision is implicit. Or: humor is present and flagged but not yet reviewed for cross-cultural transfer.  
**Score 0** — Formality is not set (`meta.formality` is missing or "neutral" when the content clearly takes a register stance). Or: humor is present and neither flagged nor documented.

**Red flags:** Exclamation points used for enthusiasm without tone documentation (reads as aggressive in some Germanic contexts); very casual first-name-only address; self-deprecating humor; sarcasm; idioms with no flag.

---

## Category 3 — Failure and Correction Messaging

- [ ] Incorrect-answer feedback provides information, not just judgment ("That's wrong" is not sufficient).
- [ ] The tone when showing failure is direct and informative — not shaming. Playful correction may not transfer across cultures.
- [ ] Encouragement phrases that rely on enthusiasm ("You've got this!", "Almost there!") are marked `localizationFlags.highCulturalRisk: true` in the feedback schema.
- [ ] Error messages in the UI are neutral and instructional — not apologetic ("Sorry!") or casual ("Oops!").

**Score 2** — All four pass. Feedback is informative, risk is flagged.  
**Score 1** — One item is borderline (mild enthusiasm phrase, one apologetic UI error). Documented.  
**Score 0** — Feedback is judgmental without being informative. Or: high-cultural-risk tone is present and not flagged.

**Why this matters:** Research by Hanieh Hatefi on multilingual UX found that tone mismatches in trust-sensitive moments (failure, correction, error) are primary drivers of user disengagement — more so than translation errors.

---

## Category 4 — Visual and Structural Assumptions

- [ ] Reading direction is not assumed. Layouts and content sequences are documented as LTR/RTL in `localizationFlags.textDirection` *(lesson schema only — for other content types, document in `content.culturalNotes`)*.
- [ ] Icon meanings are not culturally specific (checkmarks, hand gestures, color signals for right/wrong).
- [ ] Images referenced in content are described in `alt` text and do not carry undocumented cultural specificity.
- [ ] Progress metaphors ("levels", "milestones", "streaks") are understood in the target context or noted as assumptions.

**Score 2** — All four pass.  
**Score 1** — One structural element is culturally specific but documented and adaptable.  
**Score 0** — Multiple unchecked visual assumptions, or a core content structure (like a progress metaphor) that is culturally locked and undocumented.

---

## Category 5 — Content Portability

- [ ] Technical or domain terms that must not be paraphrased are documented *(use `content.keyTerms` in the lesson schema; for other content types, list them in `content.culturalNotes`)*.
- [ ] Idiomatic expressions are flagged with `localizationFlags.containsIdiom: true`.
- [ ] Content requiring full cultural rewrite (not just translation) is marked for specific language codes *(use `localizationFlags.avoidIn` in the feedback schema; for other content types, note the restricted locales in `content.culturalNotes`)*.
- [ ] Fully portable content (pure math, universal concepts, unambiguous instructions) is noted in `culturalNotes` so translators can proceed without a full cultural review.

**Score 2** — All four pass.  
**Score 1** — One term or phrase is not documented but is low-risk. Or: content is mostly portable but one idiom is present and flagged.  
**Score 0** — Multiple undocumented idioms or culturally specific terms. Or: content that clearly cannot transfer to one or more target languages has no documentation of the restricted locales (via `localizationFlags.avoidIn` in the feedback schema, or via `content.culturalNotes` in all other content types).

---

## Score interpretation and gates

| Score | Meaning | Gate |
|---|---|---|
| **9–10** | Highly portable | Proceed to cultural review — reviewer's scope is likely minimal, but review is not skipped |
| **6–8** | Minor adaptation needed | Document flagged items in `culturalNotes`, then proceed to cultural review |
| **3–5** | Significant adaptation needed | Proceed to cultural review — reviewer works from the documented flags. Any individual category scored **0** must be resolved before translation begins (see below). |
| **0–2** | Culturally locked | Full rewrite required. Content does **not** advance to cultural review. |

**Gate rule:** A total score of 3 or above allows the content to enter cultural review. Cultural review is the mechanism for resolving remaining issues — not a reason to delay entry.

**Important:** A high score (9–10) does not skip cultural review. It means the reviewer is likely to approve quickly with few or no changes — not that the stage is unnecessary. Cultural review must complete before content enters translation, regardless of score.

**However:** any individual category scored **0** — regardless of the total — must be resolved before the content moves to translation. The cultural reviewer confirms resolution. Log every zero-scored category in `culturalNotes` so the reviewer knows what to check.

---

## After this checklist

Move to the appropriate language module:

- Italian → [`/checklists/lang/it.md`](./lang/it.md)
- Spanish → [`/checklists/lang/es.md`](./lang/es.md)
- French → [`/checklists/lang/fr.md`](./lang/fr.md)
- German → [`/checklists/lang/de.md`](./lang/de.md)
- Dutch → [`/checklists/lang/nl.md`](./lang/nl.md)
- Swedish → [`/checklists/lang/sv.md`](./lang/sv.md)
