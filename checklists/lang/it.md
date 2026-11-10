# Italian Language Module
**Family:** Italo-Romance | **Code:** `it`

Complete the [universal checklist](../universal.md) first.

---

## 1 — Grammatical Gender (`genere grammaticale`)

Italian nouns and adjectives carry grammatical gender. This affects educational content more than most content types because learners, roles, and outcomes are described in gendered language.

- [ ] Generic references to "the learner" or "the student" are resolved: *lo studente* (m), *la studentessa* (f), or a gender-inclusive alternative (*la persona che studia*, plural *gli studenti/le studentesse*).
- [ ] Past participles in compound tenses follow agreement rules for the specific construction. With *avere* + a postposed direct object noun: **the participio passato does not agree with the subject**. "You completed the lesson" → *Hai completato la lezione* regardless of whether the learner is male or female (the noun *la lezione* is postposed, so no agreement applies). Agreement with *avere* only occurs when a clitic pronoun precedes the verb: *l'hai completata* (with *la* preceding *hai*). With *essere*, the participio passato always agrees with the subject: *Sei arrivata* (f) / *Sei arrivato* (m). Verify the correct construction with a native speaker before publishing.
- [ ] Adjectives describing learner performance agree with gender: *bravo/brava*, *corretto/corretta*.
- [ ] If the product does not collect user gender, decide now: use masculine as default (traditional but increasingly rejected), use plural, or use a gender-neutral construction. Document the decision in `culturalNotes`.

**Note:** The *schwa* (ə) as gender-neutral suffix (*lɘ studentɘ*) is used in some progressive Italian contexts but is not universally understood and is not standard. Do not use it in educational content without explicit audience targeting.

---

## 2 — Register: `Lei` vs `tu`

Italian distinguishes formal third-person address (*Lei*, capital L) from informal second-person (*tu*). Unlike French or German, the formal register in Italian uses the *third* person singular.

- [ ] The register for addressing the learner is explicitly chosen and consistent throughout.
- [ ] **`Lei` (formal):** Use for adult professional learners, corporate training, university contexts. *Lei ha completato il modulo. Vuole continuare?*
- [ ] **`tu` (informal):** Use for school-age learners, consumer apps, informal learning platforms. *Hai completato il modulo. Vuoi continuare?*
- [ ] The choice is documented in the content's `meta.formality` field.
- [ ] Mixed register does not occur within a single content item or user flow.

---

## 3 — Imperative Forms

Button labels and instructions often use imperatives. In Italian, the imperative changes by register:

- [ ] **`tu` (informal):** *Controlla* (Check), *Riprova* (Try again), *Continua* (Continue)
- [ ] **`Lei` (formal):** *Controlli*, *Riprovi*, *Continui* — third-person subjunctive form
- [ ] The correct imperative form is used consistently with the chosen register.
- [ ] Negative imperatives with `tu` use the infinitive: *Non continuare* (not *Non continua*).

---

## 4 — Tone and Cultural Assumptions

- [ ] Enthusiastic feedback ("Great job!", "You're amazing!") is toned down. Italian educational culture tends toward measured praise — *Esatto* (Exactly), *Molto bene* (Very good) — rather than effusive encouragement.
- [ ] Self-deprecating or ironic humor is avoided in instructional text; it can undermine authority and clarity.
- [ ] Error messages do not use *mi dispiace* (I'm sorry) for system errors — this imports English "Sorry" culture. Use *Si è verificato un errore* (An error occurred) or direct instruction instead.
- [ ] Examples referencing Italian life (geography, institutions, currency) use current and accurate references.

---

## 5 — Typography and Formatting

- [ ] Quotation marks use Italian guillemets: «così», not "così".
- [ ] Decimal separator is a comma: 3,14 not 3.14. Thousand separator is a period: 1.000 not 1,000.
- [ ] Dates follow DD/MM/YYYY format.
- [ ] `maxLength` in UI labels accounts for Italian strings being approximately 15–20% longer than English equivalents.
