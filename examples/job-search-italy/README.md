# Example: "Finding Work in Italy" — End-to-End Localization Walkthrough

This worked example traces a single content set through the full CMF workflow: from English source content to Italian translation, for a module targeting job seekers (ages 25–40) preparing for the Italian labour market.

**Persona:** Marco / Fatima / Andrzej — immigrant professional, mid-career, seeking work in Italy. Unfamiliar with Italian bureaucracy and workplace norms. Uses the platform on mobile.

**Platform register:** Informal (`tu`). The platform is consumer-facing, not institutional.

---

## Files in this example

| File | Content type | Status |
|---|---|---|
| `lesson-en.json` | Lesson (English source) | published |
| `lesson-it.json` | Lesson (Italian translation) | published |
| `question-en.json` | Question (English source) | published |
| `question-it.json` | Question (Italian translation) | published |
| `feedback-en.json` | Feedback set (English source) | published |
| `feedback-it.json` | Feedback set (Italian translation) | published |
| `labels-en.json` | UI labels (English source) | published |
| `labels-it.json` | UI labels (Italian translation) | published |

---

## What this example demonstrates

1. **The `formality` field in `meta`** — set to `"informal"` consistently across all four content types, driving `tu` register throughout.

2. **The `culturalReadinessScore` gate** — the English lesson scores 7/10. The pizza example in the lesson is flagged as locally appropriate for Italian but noted for German/Dutch adaptation. Content advanced to cultural review because score ≥ 3.

3. **`highCulturalRisk` in feedback** — the "Not quite!" incorrect-answer message is marked `highCulturalRisk: true` with `avoidIn: ["de", "nl", "sv"]`. The Italian version is approved with a mild rewrite (exclamation removed, tone made slightly more direct).

4. **Correct Italian participio passato agreement** — the Italian lesson correctly uses *Hai completato la lezione* (not *completata*). The `culturalNotes` entry explains that with `avere` and a postposed noun, the past participle is invariable (no gender agreement with the subject). Agreement with `avere` only occurs when a clitic precedes the verb: *l'hai completata*. The example *ha iniziato a ricevere* is also explained: `a ricevere` is an infinitive complement, not a direct object, so the past participle *iniziato* is invariable.

5. **`sourceId` / `sourceLanguage` chain** — all Italian files point back to their English source via `meta.sourceId` and `meta.sourceLanguage: "en"`.

6. **`localeReadiness` in `localizationFlags`** — each Italian file includes a reviewer entry confirming the locale-specific review was completed.

7. **`variables` in UI labels** — the welcome label uses `{firstName}` with a `variables` array documenting the placeholder.

---

## The cultural review outcome for Italian

The cultural reviewer (native Italian speaker) approved the content with the following notes:

- **Pizza example:** Retained as-is. Appropriate for the Italian job-seekers audience.
- **Tone:** The `"informal"` (tu) register was confirmed correct for this platform type.
- **Feedback tone:** The encouraging feedback was revised to remove the exclamation mark. The Italian version uses *Non del tutto.* rather than *Non del tutto!* — a small but meaningful change in Italian educational register.
- **CV photo / DOB / marital status:** The lesson was updated from presenting these as "standard practice" to presenting them as context-dependent norms (more common in Italy than in the UK/US, but not universally required). The question uses a comparative framing ("more common") rather than an absolute, which is more accurate and transfers safely to other contexts.

---

## Reading order

Start with `lesson-en.json` to see the source content and its readiness flags. Then open `lesson-it.json` to see how the translation reflects those flags. Repeat for question, feedback, and labels.
