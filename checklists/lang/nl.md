# Dutch Language Module
**Family:** Germanic | **Code:** `nl`

Complete the [universal checklist](../universal.md) first.

---

## 1 — Register: `u` vs `jij/je`

Dutch distinguishes formal (*u*) from informal (*jij/je*). The formal *u* uses third-person singular verb forms.

- [ ] The register is explicitly chosen and consistent.
- [ ] **`u` (formal):** Used in professional, institutional, and formal contexts. Increasingly less common in consumer-facing Dutch software — many Dutch products default to informal even with adults.
- [ ] **`jij/je` (informal):** Standard in most Dutch EdTech, consumer apps, and startup-culture products. Dutch culture has a strong tradition of informality in professional contexts — the barrier to *jij* is lower than in German or French.
- [ ] **Important:** In Belgian Dutch (*nl-BE*, Flemish), *u* is used more frequently than in Netherlands Dutch (*nl-NL*), even in contexts where Dutch speakers would use *je*. If targeting Belgium, default to *u* unless the platform is explicitly casual.
- [ ] The register decision is documented and applied consistently to imperative forms, feedback, and UI labels.

---

## 2 — Directness as Default

Dutch communication is among the most direct in European languages. This is a cultural norm, not rudeness.

- [ ] Feedback for incorrect answers is direct and informative: *Dat is niet correct. De noemer is het onderste getal.* — not softened with *Bijna! Probeer het nog eens!*
- [ ] Generic encouragement phrases (*Je doet het geweldig!*, *Super gedaan!*) are used sparingly. Dutch learners generally prefer concrete, factual feedback.
- [ ] Error messages do not use *Sorry* as a generic softener — it reads as hollow. Use *Er is een fout opgetreden* (An error has occurred) or direct instruction.
- [ ] Avoid over-explaining. Dutch educational content is typically concise — unnecessary scaffolding or over-reassurance can feel condescending.

---

## 3 — Diminutives (`verkleinwoorden`)

Dutch uses diminutives extensively and productively — they carry nuance that is difficult to translate from English.

- [ ] Diminutives are not used in formal educational content where they would undermine authority: *het lesje* (the little lesson) sounds dismissive; *de les* is correct.
- [ ] In informal contexts, diminutives can convey friendliness: *even een vraagje* — but this requires a native Dutch reviewer to apply correctly.
- [ ] Translators should not apply diminutives based on English source text — they must be added based on Dutch contextual judgment.

---

## 4 — Grammatical Gender

Modern Dutch has effectively reduced to two genders in standard usage: common gender (*de*-words) and neuter (*het*-words). This is simpler than German but still affects article and pronoun use.

- [ ] Nouns are assigned the correct article (*de* or *het*). This cannot be predicted from rules — it must be verified by a native speaker or dictionary. Common errors: *het antwoord* (neuter, correct) vs *de vraag* (common, correct).
- [ ] Generic references to learners: *de leerling* (common gender, covers all), *de student/de studente*. The masculine default is less contentious than in French but should still be addressed explicitly.

---

## 5 — Typography and Formatting

- [ ] Quotation marks: „zo" (lower-upper) or 'zo' (single) — both are used; choose one and be consistent.
- [ ] Decimal separator: comma (*3,14*). Thousand separator: period (*1.000*) in Netherlands Dutch; sometimes a space in Belgium.
- [ ] Dates: DD-MM-YYYY (Netherlands); DD/MM/YYYY also acceptable.
- [ ] `maxLength` in UI labels should allow for 20–35% expansion from English. Dutch UI labels tend to be notably longer.
