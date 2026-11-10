# French Language Module
**Family:** Gallo-Romance | **Code:** `fr`

Complete the [universal checklist](../universal.md) first.

---

## 1 — Register: `tu` vs `vous`

French distinguishes informal (*tu*) from formal or plural (*vous*). Unlike Italian, *vous* in French uses the second-person plural form (not third-person like Italian *Lei*).

- [ ] The register is explicitly chosen and consistent throughout all content and UI.
- [ ] **`vous` (formal):** Standard for adult professional education, corporate training, institutional EdTech, and any context where the relationship is professional or the audience age/status is uncertain. *Vous avez complété le module.*
- [ ] **`tu` (informal):** Appropriate for youth platforms, consumer apps, or platforms with an explicitly casual brand voice. *Tu as complété le module.*
- [ ] French learners are particularly sensitive to register mismatches. An unexpected *tu* in a formal context reads as disrespectful; an unexpected *vous* in a casual context reads as stiff.
- [ ] The register decision is documented in `meta.formality` in the content schema.

---

## 2 — Grammatical Gender

- [ ] Generic references to learners resolve gender. French uses masculine as the grammatical default, but inclusive writing (*l'étudiant·e*, *les étudiant·e·s*) is increasingly expected, especially in educational contexts in France.
- [ ] The inclusivity approach is a product decision, not a translator's decision — document it explicitly.
- [ ] Past participle agreement: in compound tenses with *avoir*, the past participle agrees with a preceding direct object. This is a grammatical rule, not stylistic — verify with a native reviewer.
- [ ] Adjective agreement in feedback messages: *Vous êtes prêt/prête*, *C'est correct/correcte*.

---

## 3 — Regional Variation (France vs Quebec vs Belgium vs Switzerland)

- [ ] If targeting Quebec (*fr-CA*), note significant vocabulary differences: *courriel* (email) vs *e-mail*, *fin de semaine* vs *weekend*, *magasiner* vs *faire du shopping*.
- [ ] Quebec French has a distinct register system — formal *vous* contexts overlap, but informal registers differ in vocabulary and idiom.
- [ ] Swiss French (*fr-CH*) and Belgian French (*fr-BE*) have specific number words: *septante* (70) instead of *soixante-dix*, *nonante* (90) instead of *quatre-vingt-dix*. Flag if numeric content is present.
- [ ] Content targeting France does not assume Parisian references are universally relatable in other French-speaking regions.

---

## 4 — Tone and Formality Expectations

- [ ] French educational and professional culture values precision and measured tone. Generic enthusiasm (*Super! Fantastique!*) can read as superficial.
- [ ] Feedback for incorrect answers should be informative and direct: *Ce n'est pas correct. Le dénominateur est le nombre du bas.* — not *Presque ! Réessaie !*
- [ ] Error messages avoid *Désolé/Désolée* as a generic softener for system errors. Use *Une erreur s'est produite* (An error occurred).
- [ ] Imperative tone in instructions is standard and not perceived as aggressive when used appropriately: *Sélectionnez*, *Vérifiez*, *Continuez*.

---

## 5 — Typography and Formatting (critical in French)

French typography has strict rules that are different from English and are frequently violated in translations.

- [ ] **Non-breaking spaces before double punctuation:** A non-breaking space is required before `:`, `;`, `!`, `?`, `»`. *Êtes-vous prêt·e ?* (space before `?`) not *Êtes-vous prêt·e?*
- [ ] **Guillemets with spaces:** « ainsi » — spaces inside the guillemets. Not "ainsi" or «ainsi».
- [ ] Decimal separator: comma (*3,14*). Thousand separator: non-breaking space (*1 000*).
- [ ] Dates: DD/MM/YYYY in France; *le 15 octobre 2026* in long form (lowercase month).
- [ ] `maxLength` in UI labels should allow 15–25% expansion from English.
- [ ] Apostrophes in elision: *l'étudiant*, *j'ai*, *c'est* — not *le étudiant*.
