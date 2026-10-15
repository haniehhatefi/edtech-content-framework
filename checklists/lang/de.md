# German Language Module
**Family:** Germanic | **Code:** `de`

Complete the [universal checklist](../universal.md) first.

---

## 1 — Grammatical Gender and Case (`Genus und Kasus`)

German has three grammatical genders (masculine, feminine, neuter) and four cases (nominative, accusative, dative, genitive). This affects articles, adjectives, and pronouns throughout educational content.

- [ ] Generic references to learners use gender-inclusive forms. Options:
  - Gender-neutral noun: *die Person*, *die Lernende* (nominalized participle, works m/f with article change)
  - Gendered split: *der Lernende / die Lernende*
  - Gender star or colon (used in progressive contexts): *Lernende\** or *Lernende:r* — note: not universally accepted and not appropriate for all audiences
- [ ] Adjective endings are checked for correct case and gender agreement throughout.
- [ ] Compound nouns — very common in German — are formed correctly. Educational terms often combine into long compounds: *Lernfortschritt* (learning progress), *Aufgabenstellung* (task description). Do not translate compound meanings word-for-word from English.

---

## 2 — Register: `Sie` vs `du`

German distinguishes formal (*Sie*, capital S, third-person plural form) from informal (*du*).

- [ ] The register is explicitly chosen and consistent.
- [ ] **`Sie` (formal):** Standard for professional training, adult education, corporate EdTech, and any context where the relationship between platform and learner is formal. *Sie haben die Aufgabe abgeschlossen.*
- [ ] **`du` (informal):** Appropriate for youth-oriented platforms, consumer apps, startup culture contexts. *Du hast die Aufgabe abgeschlossen.*
- [ ] The *du-Sie* boundary is never mixed within a single flow or session.
- [ ] Verb conjugation matches the chosen register throughout — this is a frequent error in translated content.

---

## 3 — Tone: Directness as Default

German communication in professional and educational contexts tends toward directness, precision, and explicit reasoning — more so than English or Romance-language equivalents. This is a tendency, not a cultural law: Austrian German, Swiss German, and generational or industry context all introduce variation. The checklist items below reflect safe defaults for a general adult EdTech audience targeting the D-A-CH (Germany, Austria, Switzerland) market.

> **Regional note:** If content is targeted specifically at Austria or Switzerland, revisit this section with a local reviewer. Austrian German is notably warmer in educational tone; Swiss German carries its own formal register conventions.

- [ ] Feedback for incorrect answers is direct and informative: *Das ist nicht korrekt. Der Nenner ist die untere Zahl.* — not *Hmm, almost! Take another look…*
- [ ] Encouragement is specific and factual, not generic: *Du hast 8 von 10 Aufgaben richtig beantwortet.* rather than *You're doing great!*
- [ ] Apology language (*Es tut uns leid*, *Entschuldigung*) is used only for genuine errors, not as softening for incorrect answers or system states.
- [ ] Exclamation marks are used sparingly. Frequent exclamation points (*Super! Weiter so! Toll gemacht!*) can read as condescending in German educational content.

---

## 4 — Compound Nouns and Terminology

- [ ] Technical and educational terms are checked against established German equivalents — do not construct new compounds without verification.
- [ ] `keyTerms` in the schema lists all domain-specific terms that should not be translated creatively.
- [ ] UI labels account for German strings being 25–40% longer than English. *Check my answer* → *Meine Antwort überprüfen* (25 characters vs 16).

---

## 5 — Typography and Formatting

- [ ] *Anführungszeichen* (quotation marks) use lower-upper style: „so" not "so".
- [ ] Decimal separator is a comma: 3,14. Thousand separator is a period: 1.000.
- [ ] Dates follow DD.MM.YYYY format.
- [ ] The *Eszett* (ß) is used correctly: *Straße*, *groß*, *heißen*. In Switzerland and Liechtenstein, ß is replaced by ss — if targeting CH audiences, flag this.
- [ ] `maxLength` in UI labels is set generously to accommodate German expansion.
