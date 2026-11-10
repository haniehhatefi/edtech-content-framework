#!/usr/bin/env node
/**
 * CMF Validator v2
 * ----------------
 * JSON Schema validation (AJV v8, strict mode) + semantic checks:
 *   - Placeholder consistency between source and translated strings
 *   - Per-locale maxLength compliance (integer or object form)
 *   - Text expansion warnings when single-limit may be too tight
 *   - Staleness detection: sourceVersion mismatch against source file version
 *   - Glossary consistency: keyTerm translations checked against glossary/[lang].json
 *   - Translator-query enforcement: status=translator-query requires a translatorQuery entry
 *   - At-most-one correct answer per multiple-choice question
 *   - Locale-readiness entry required on translated content
 *   - Frozen + translation-ready alignment
 *
 * Usage:
 *   node validate.js [files...]        — validate specified JSON files
 *   node validate.js                   — validate all JSON files in examples/
 *
 * Errors (❌) are hard failures. Warnings (⚠) flag issues worth fixing but don't fail the run.
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const Ajv  = require('ajv');
const addFormats = require('ajv-formats');

// ─── Schema loader ───────────────────────────────────────────────────────────

const SCHEMA_DIR = path.join(__dirname, 'schemas');
const SCHEMAS = {
  lesson:    JSON.parse(fs.readFileSync(path.join(SCHEMA_DIR, 'lesson.schema.json'),   'utf8')),
  question:  JSON.parse(fs.readFileSync(path.join(SCHEMA_DIR, 'question.schema.json'), 'utf8')),
  feedback:  JSON.parse(fs.readFileSync(path.join(SCHEMA_DIR, 'feedback.schema.json'), 'utf8')),
  'ui-label':JSON.parse(fs.readFileSync(path.join(SCHEMA_DIR, 'ui-label.schema.json'), 'utf8')),
};

const ajv = new Ajv({ strict: true, allErrors: true });
addFormats(ajv);

// Remove $id before adding to avoid AJV URI resolution issues with relative IDs
const compiledSchemas = {};
for (const [type, schema] of Object.entries(SCHEMAS)) {
  const copy = { ...schema };
  delete copy.$id;
  compiledSchemas[type] = ajv.compile(copy);
}

// ─── CMF config loader ────────────────────────────────────────────────────────

function loadConfig() {
  const configPath = path.join(__dirname, 'cmf.config.json');
  if (!fs.existsSync(configPath)) return {};
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch {
    return {};
  }
}

const CONFIG = loadConfig();

// ─── Glossary loader ──────────────────────────────────────────────────────────

function loadGlossaries() {
  const glossaryDir = path.join(__dirname, 'glossary');
  if (!fs.existsSync(glossaryDir)) return {};

  const glossaries = {};
  for (const file of fs.readdirSync(glossaryDir)) {
    if (!file.endsWith('.json')) continue;
    try {
      const data = JSON.parse(fs.readFileSync(path.join(glossaryDir, file), 'utf8'));
      if (data.language && Array.isArray(data.terms)) {
        // Index by sourceTerm for fast lookup
        glossaries[data.language] = {};
        for (const term of data.terms) {
          if (term.sourceTerm) {
            glossaries[data.language][term.sourceTerm] = term;
          }
        }
      }
    } catch (e) {
      console.warn(`  [warn] could not parse glossary/${file}: ${e.message}`);
    }
  }
  return glossaries;
}

const GLOSSARIES = loadGlossaries();

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Extract all placeholder tokens from a string.
 * Recognises {name}, {{name}}, %{n}, {0} patterns.
 */
function extractPlaceholders(str) {
  if (typeof str !== 'string') return new Set();
  const tokens = new Set();
  // {word}, {{word}}, %{word}
  const re = /(%?\{+\w+\}+)/g;
  let m;
  while ((m = re.exec(str)) !== null) tokens.add(m[1]);
  return tokens;
}

function setsEqual(a, b) {
  if (a.size !== b.size) return false;
  for (const v of a) if (!b.has(v)) return false;
  return true;
}

/**
 * Resolve the maxLength limit for a given locale.
 * Returns undefined if maxLength is not set.
 */
function resolveMaxLength(maxLength, locale) {
  if (maxLength === undefined || maxLength === null) return undefined;
  if (typeof maxLength === 'number') return maxLength;
  if (typeof maxLength === 'object') {
    if (locale && maxLength[locale] !== undefined) return maxLength[locale];
    return maxLength.default;
  }
  return undefined;
}

// ─── Per-type semantic checks ─────────────────────────────────────────────────

/**
 * Check UI label: placeholder consistency + maxLength compliance + expansion warnings.
 */
function checkUiLabel(item) {
  const errors = [];
  const { content, meta } = item;
  if (!content || typeof content.value !== 'string') return errors;

  const { value, variables, maxLength } = content;
  const locale = meta?.language;

  // 1. Placeholder consistency: tokens in value must match tokens in variables list
  const tokensInString = extractPlaceholders(value);
  if (tokensInString.size > 0 && (!Array.isArray(variables) || variables.length === 0)) {
    errors.push(
      `❌ content.value contains placeholder(s) ${[...tokensInString].join(', ')} but content.variables is missing or empty`
    );
  } else if (Array.isArray(variables) && variables.length > 0) {
    const documented = new Set(variables.map(v => v.name));
    for (const tok of tokensInString) {
      if (!documented.has(tok)) {
        errors.push(`❌ placeholder ${tok} in content.value is not documented in content.variables`);
      }
    }
    for (const v of variables) {
      if (!tokensInString.has(v.name)) {
        errors.push(`⚠  content.variables documents "${v.name}" but it does not appear in content.value`);
      }
    }
  }

  // 2. Static maxLength compliance
  if (maxLength !== undefined) {
    const limit = resolveMaxLength(maxLength, locale);
    if (typeof limit === 'number' && value.length > limit) {
      const form = typeof maxLength === 'object' ? ` (locale "${locale}" per-locale limit)` : '';
      errors.push(
        `❌ content.value length ${value.length} chars exceeds maxLength ${limit}${form}`
      );
    }

    // 3. Expansion warning: single integer limit and locale has expansion factor
    if (typeof maxLength === 'number' && locale) {
      const factor = CONFIG?.textExpansion?.multipliers?.[locale];
      const threshold = CONFIG?.textExpansion?.warningThreshold ?? 0.95;
      if (factor) {
        const estimated = Math.floor(value.length * factor);
        if (estimated >= Math.floor(maxLength * threshold)) {
          errors.push(
            `⚠  single maxLength ${maxLength} may be tight for locale "${locale}" ` +
            `(expansion factor ${factor}× → estimated ${estimated} chars). ` +
            `Consider using per-locale maxLength object form.`
          );
        }
      }
    }
  }

  return errors;
}

/**
 * Check question: at most one correct answer per multiple-choice item.
 */
function checkQuestion(item) {
  const errors = [];
  const { content } = item;
  if (!content) return errors;

  const { questionType, correctAnswer, options } = content;

  if (questionType === 'multiple-choice' && Array.isArray(correctAnswer) && correctAnswer.length > 1) {
    errors.push(`❌ multiple-choice question has ${correctAnswer.length} correct answers — only 1 is permitted`);
  }

  if (typeof correctAnswer === 'string' && Array.isArray(options)) {
    const ids = options.map(o => o.id);
    if (!ids.includes(correctAnswer)) {
      errors.push(`❌ correctAnswer "${correctAnswer}" does not match any option id: [${ids.join(', ')}]`);
    }
  }

  return errors;
}

/**
 * Check feedback: if highCulturalRisk is true, culturalNotes must be present.
 * (Also enforced by JSON Schema if/then, but we emit a cleaner message here.)
 */
function checkFeedback(item) {
  const errors = [];
  const { content } = item;
  if (!content) return errors;

  if (content.highCulturalRisk === true && !content.culturalNotes) {
    errors.push(`❌ content.highCulturalRisk is true but content.culturalNotes is missing`);
  }

  return errors;
}

/**
 * Check localeReadiness: translated content (non-source language) must have
 * a localeReadiness entry for its own locale.
 */
function checkLocaleReadiness(item) {
  const errors = [];
  const sourceLanguage = CONFIG?.source?.language ?? 'en';
  const lang = item?.meta?.language;

  if (!lang || lang === sourceLanguage) return errors;

  const lr = item?.localizationFlags?.localeReadiness;
  if (!Array.isArray(lr) || lr.length === 0) {
    errors.push(
      `❌ translated content (language: "${lang}") has no localizationFlags.localeReadiness entries. ` +
      `Add an entry for locale "${lang}".`
    );
    return errors;
  }

  const hasMatchingEntry = lr.some(e => e.locale === lang);
  if (!hasMatchingEntry) {
    errors.push(
      `❌ no localeReadiness entry found for locale "${lang}". ` +
      `Available entries: [${lr.map(e => e.locale).join(', ')}]`
    );
  }

  return errors;
}

/**
 * Check staleness: if a localeReadiness entry has sourceVersion, compare it
 * against the source file's meta.version (looked up from allItems).
 */
function checkStaleness(item, allItems) {
  const errors = [];
  const sourceId = item?.meta?.sourceId;
  if (!sourceId) return errors;

  const sourceItem = allItems.find(i => i.id === sourceId);
  if (!sourceItem) return errors; // source not in this batch — skip

  const sourceVersion = sourceItem?.meta?.version;
  const lr = item?.localizationFlags?.localeReadiness;
  if (!Array.isArray(lr) || !sourceVersion) return errors;

  for (const entry of lr) {
    if (entry.sourceVersion && entry.sourceVersion !== sourceVersion) {
      errors.push(
        `⚠  localeReadiness["${entry.locale}"].sourceVersion "${entry.sourceVersion}" is behind ` +
        `source "${sourceId}" current version "${sourceVersion}" — translation may need re-review`
      );
    }
  }

  return errors;
}

/**
 * Check translator-query enforcement:
 * If meta.status is "translator-query", at least one localeReadiness entry
 * must have a translatorQuery.query field.
 */
function checkTranslatorQuery(item) {
  const errors = [];
  if (item?.meta?.status !== 'translator-query') return errors;

  const lr = item?.localizationFlags?.localeReadiness;
  if (!Array.isArray(lr) || lr.length === 0) {
    errors.push(
      `❌ meta.status is "translator-query" but localizationFlags.localeReadiness is empty. ` +
      `Add a localeReadiness entry with a translatorQuery.query field.`
    );
    return errors;
  }

  const hasQuery = lr.some(e => e.translatorQuery && typeof e.translatorQuery.query === 'string');
  if (!hasQuery) {
    errors.push(
      `❌ meta.status is "translator-query" but no localeReadiness entry has a translatorQuery.query field. ` +
      `Populate translatorQuery in the entry for the locale that raised the query.`
    );
  }

  return errors;
}

/**
 * Check frozen/translation-ready alignment:
 * If meta.status is "translation-ready", meta.frozen should be true.
 */
function checkFrozenAlignment(item) {
  const errors = [];
  if (item?.meta?.status === 'translation-ready' && item?.meta?.frozen !== true) {
    errors.push(
      `⚠  meta.status is "translation-ready" but meta.frozen is not set to true. ` +
      `Set meta.frozen: true to signal that the source is locked before translators begin.`
    );
  }
  return errors;
}

/**
 * Check glossary consistency:
 * For translated lesson keyTerms that have a sourceTerm field,
 * verify that the term matches the approved translation in glossary/[lang].json.
 */
function checkGlossaryConsistency(item) {
  const errors = [];
  const sourceLanguage = CONFIG?.source?.language ?? 'en';
  const lang = item?.meta?.language;

  if (!lang || lang === sourceLanguage) return errors;
  if (item?.type !== 'lesson') return errors;

  const keyTerms = item?.content?.keyTerms;
  if (!Array.isArray(keyTerms) || keyTerms.length === 0) return errors;

  const glossary = GLOSSARIES[lang];
  if (!glossary) return errors; // no glossary for this language — skip silently

  const enforced = CONFIG?.glossary?.enforced !== false;
  const level = enforced ? '❌' : '⚠ ';

  for (const kt of keyTerms) {
    if (!kt.sourceTerm) continue; // no sourceTerm → can't look up → skip

    const entry = glossary[kt.sourceTerm];
    if (!entry) continue; // source term not in glossary — might be intentional

    if (entry.translation && kt.term !== entry.translation) {
      errors.push(
        `${level} keyTerm "${kt.sourceTerm}" → "${kt.term}" ` +
        `does not match glossary/${lang}.json approved translation "${entry.translation}"`
      );
    }

    // Check against forbidden translations
    if (Array.isArray(entry.forbidden) && entry.forbidden.includes(kt.term)) {
      errors.push(
        `❌ keyTerm "${kt.sourceTerm}" → "${kt.term}" is in the forbidden list for ${lang}: ` +
        `[${entry.forbidden.join(', ')}]`
      );
    }
  }

  return errors;
}

// ─── Main validator ───────────────────────────────────────────────────────────

function validateItem(item, filePath, allItems) {
  const errors = [];
  const type = item?.type;

  // 1. JSON Schema validation
  const validate = compiledSchemas[type];
  if (!validate) {
    errors.push(`❌ unknown type "${type}" — expected one of: ${Object.keys(compiledSchemas).join(', ')}`);
    return errors;
  }

  const valid = validate(item);
  if (!valid) {
    for (const err of validate.errors) {
      errors.push(`❌ [schema] ${err.instancePath || '(root)'} ${err.message}`);
    }
  }

  // 2. Semantic checks
  errors.push(...checkLocaleReadiness(item));
  errors.push(...checkTranslatorQuery(item));
  errors.push(...checkFrozenAlignment(item));
  errors.push(...checkStaleness(item, allItems));
  errors.push(...checkGlossaryConsistency(item));

  if (type === 'ui-label')  errors.push(...checkUiLabel(item));
  if (type === 'question')  errors.push(...checkQuestion(item));
  if (type === 'feedback')  errors.push(...checkFeedback(item));

  return errors;
}

function validateFile(filePath, allItems) {
  let raw;
  try {
    raw = fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    return { file: filePath, errors: [`❌ could not read file: ${e.message}`], warnings: [] };
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return { file: filePath, errors: [`❌ invalid JSON: ${e.message}`], warnings: [] };
  }

  // Support both single-item objects and arrays of items
  const items = Array.isArray(parsed) ? parsed : [parsed];

  const allErrors   = [];
  const allWarnings = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const prefix = items.length > 1 ? `[${i}] ` : '';
    const all = validateItem(item, filePath, allItems);
    for (const msg of all) {
      if (msg.startsWith('❌')) allErrors.push(prefix + msg);
      else allWarnings.push(prefix + msg);
    }
  }

  return { file: filePath, errors: allErrors, warnings: allWarnings };
}

// ─── Entry point ──────────────────────────────────────────────────────────────

function main() {
  let filePaths = process.argv.slice(2);

  if (filePaths.length === 0) {
    // Default: validate all .json files in examples/
    const examplesDir = path.join(__dirname, 'examples');
    if (!fs.existsSync(examplesDir)) {
      console.error('No files specified and no examples/ directory found.');
      process.exit(1);
    }
    filePaths = fs.readdirSync(examplesDir)
      .filter(f => f.endsWith('.json'))
      .map(f => path.join(examplesDir, f));
  }

  if (filePaths.length === 0) {
    console.error('No JSON files found to validate.');
    process.exit(1);
  }

  // First pass: load all items for cross-file checks (staleness)
  const allItems = [];
  for (const fp of filePaths) {
    try {
      const parsed = JSON.parse(fs.readFileSync(fp, 'utf8'));
      if (Array.isArray(parsed)) {
        allItems.push(...parsed.filter(i => i && typeof i === 'object'));
      } else if (parsed && typeof parsed === 'object') {
        allItems.push(parsed);
      }
    } catch {}
  }

  // Second pass: validate
  let totalErrors = 0;
  let totalWarnings = 0;
  const results = [];

  for (const fp of filePaths) {
    const result = validateFile(fp, allItems);
    results.push(result);
    totalErrors   += result.errors.length;
    totalWarnings += result.warnings.length;
  }

  // Output
  const maxWidth = Math.max(...results.map(r => path.basename(r.file).length));

  for (const result of results) {
    const name = path.basename(result.file).padEnd(maxWidth);
    const hasErrors   = result.errors.length   > 0;
    const hasWarnings = result.warnings.length > 0;

    if (!hasErrors && !hasWarnings) {
      console.log(`✓  ${name}`);
    } else {
      const prefix = hasErrors ? '✗ ' : '⚠ ';
      console.log(`${prefix} ${name}`);
      for (const e of result.errors)   console.log(`      ${e}`);
      for (const w of result.warnings) console.log(`      ${w}`);
    }
  }

  console.log('');
  const passCount = results.filter(r => r.errors.length === 0).length;
  const failCount = results.filter(r => r.errors.length  >  0).length;
  const warnCount = results.filter(r => r.warnings.length > 0 && r.errors.length === 0).length;

  let summary = `${results.length} file(s) checked. ${passCount} passed`;
  if (failCount > 0)  summary += `, ${failCount} failed`;
  if (warnCount > 0)  summary += `, ${warnCount} passed with warnings`;
  if (totalWarnings > 0) summary += ` (${totalWarnings} warning(s) total)`;
  console.log(summary + '.');

  if (totalErrors > 0) process.exit(1);
}

main();
