# Spanish Language Module
**Family:** Ibero-Romance | **Code:** `es`

Complete the [universal checklist](../universal.md) first.

---

## 1 — Regional Variation

Spanish is the primary language of 20+ countries. EdTech content targeting "Spanish speakers" must make an explicit regional decision because vocabulary, register norms, and even grammar differ significantly.

- [ ] The target region is explicitly defined: Spain (*es-ES*), Latin America broadly (*es-419*), or a specific country (*es-MX*, *es-AR*, etc.).
- [ ] Vocabulary choices reflect the target region. Key educational terms differ: *ordenador* (Spain) vs *computadora/computador* (LatAm) vs *computer* (some LatAm contexts). *Coche* (Spain) vs *carro/auto* (LatAm).
- [ ] The content does not use Spain-specific slang or idioms when targeting LatAm audiences, and vice versa.
- [ ] If targeting multiple Spanish-speaking regions, a neutral international Spanish (*español neutro*) strategy is documented and consistently applied.

---

## 2 — Register: `vosotros`, `ustedes`, `vos`

- [ ] The second-person plural form is resolved:
  - *vosotros/as* is used only in Spain. Do not use in LatAm content.
  - *ustedes* is used in LatAm (and formally in Spain).
- [ ] In Argentina, Uruguay, and some Central American countries, *vos* replaces *tú* for informal second-person singular. If targeting these markets, *vos* conjugations are used: *vos tenés*, not *tú tienes*.
- [ ] The register (formal *usted* vs informal *tú/vos*) is explicitly chosen and consistent.
  - **Formal (*usted*):** Corporate training, professional adult education, formal institutional contexts.
  - **Informal (*tú/vos*):** Consumer apps, youth education, informal learning platforms.

---

## 3 — Grammatical Gender

- [ ] Generic references to learners resolve gender: *el estudiante / la estudiante*, or use inclusive forms.
- [ ] Gender-neutral language in Spanish is evolving. The *-e* suffix (*les estudiantes*, *todxs*, *tod@s*) is used in some progressive contexts but is not standard. Use it only with explicit audience awareness.
- [ ] Adjective agreement with learner gender is checked in feedback and encouragement messages: *Estás listo/lista*, *Bien hecho/hecha*.
- [ ] If the product does not collect gender, document the fallback strategy (masculine default, plural, or gender-neutral construction).

---

## 4 — Tone

- [ ] Spanish educational tone — particularly in LatAm — tends to be warm, relational, and moderately encouraging. Flat or overly clinical feedback can feel cold.
- [ ] Excessive familiarity or overly casual slang in formal educational contexts reads as unprofessional.
- [ ] Feedback for error states avoids *¡Lo siento!* (I'm sorry) as a generic softener — use direct instructional language.
- [ ] Exclamation marks are used in pairs in Spanish: *¡Correcto!* not *Correcto!*. This is a typographic rule, not stylistic — confirm translators follow it.

---

## 5 — Typography and Formatting

- [ ] Inverted punctuation is used: *¿Cuál es el denominador?* and *¡Correcto!*
- [ ] Quotation marks vary by region: guillemets «así» in Spain; standard marks "así" more common in LatAm. Define the convention.
- [ ] Decimal separator: comma in Spain and most of LatAm (*3,14*), but period in Mexico (*3.14*) — verify for target region.
- [ ] Dates: DD/MM/YYYY in Spain; varies in LatAm — Mexico often uses DD/MM/YYYY, some countries use MM/DD/YYYY. Specify.
- [ ] `maxLength` in UI labels should allow for 20–30% expansion from English.
