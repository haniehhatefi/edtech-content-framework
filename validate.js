#!/usr/bin/env node
/**
 * CMF Content Validator
 *
 * Validates JSON content files against their schemas, then runs semantic
 * checks that JSON Schema cannot express.
 *
 * Run:  node validate.js [file-or-directory]
 *       Defaults to the ./examples directory when no argument is given.
 *
 * Requires: npm install ajv ajv-formats
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ─── Load AJV + ajv-formats ────────────────────────────────────────────────────
let Ajv, addFormats;
try {
  Ajv        = require('ajv');
  addFormats = require('ajv-formats');
} catch {
  console.error('Missing dependencies. Run: npm install ajv ajv-formats');
  process.exit(1);
}

const ajv = new Ajv({ allErrors: true });
addFormats(ajv); // enables format: "date" enforcement

// ─── Load schemas ──────────────────────────────────────────────────────────────
const SCHEMA_DIR = path.join(__dirname, 'schemas');
const validators = {};

for (const file of fs.readdirSync(SCHEMA_DIR)) {
  if (!file.endsWith('.schema.json')) continue;
  const schema = JSON.parse(fs.readFileSync(path.join(SCHEMA_DIR, file), 'utf8'));
  const type   = file.replace('.schema.json', ''); // "lesson", "question", etc.
  validators[type] = ajv.compile(schema);
}

// ─── Semantic checks (what JSON Schema can't enforce) ─────────────────────────

/**
 * Extract all {placeholder} names from a string.
 * @param {string} str
 * @returns {string[]} e.g. ["name", "count"]
 */
function extractPlaceholders(str) {
  const found = [];
  const re = /\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g;
  let m;
  while ((m = re.exec(str)) !== null) found.push(m[1]);
  return found;
}

/**
 * Semantic checks for ui-label items.
 * Returns array of error strings.
 */
function checkUiLabel(item) {
  const errors = [];
  const { content } = item;
  if (!content) return errors;

  const { value, variables } = content;

  if (typeof value === 'string') {
    const inValue    = extractPlaceholders(value);
    const inVarNames = (variables || []).map(v => v.name);

    // Every {placeholder} in value must have a matching entry in variables
    for (const ph of inValue) {
      if (!inVarNames.includes(ph)) {
        errors.push(`content.value contains {${ph}} but variables has no entry with name "${ph}"`);
      }
    }
    // Every variable entry must have a corresponding {placeholder} in value
    for (const name of inVarNames) {
      if (!inValue.includes(name)) {
        errors.push(`variables declares "${name}" but {${name}} does not appear in content.value`);
      }
    }
    // Duplicate variable names
    const dupeVars = inVarNames.filter((n, i) => inVarNames.indexOf(n) !== i);
    if (dupeVars.length > 0) {
      errors.push(
        `variables contains duplicate name(s): ${[...new Set(dupeVars)].join(', ')}`
      );
    }
    // maxLength is checked against the static string (including placeholder tokens).
    // Note: this does not reflect runtime length after variable substitution —
    // runtime enforcement requires UI-level testing.
    if (typeof content.maxLength === 'number' && value.length > content.maxLength) {
      errors.push(
        `content.value static length ${value.length} exceeds maxLength ${content.maxLength} ` +
        `(checked against raw string including {placeholder} tokens, not runtime values)`
      );
    }
  }

  return errors;
}

/**
 * Semantic checks for question items.
 * Returns array of error strings.
 */
function checkQuestion(item) {
  const errors = [];
  const qType   = item?.meta?.questionType;
  const options  = item?.content?.options;

  if (qType === 'multiple-choice' && Array.isArray(options)) {
    // At most one correct answer (zero is caught by schema "contains")
    const correctCount = options.filter(o => o.correct === true).length;
    if (correctCount > 1) {
      errors.push(
        `content.options has ${correctCount} items with correct: true — ` +
        `multiple-choice questions must have exactly one correct answer`
      );
    }

    // Duplicate option IDs
    const ids   = options.map(o => o.id).filter(Boolean);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    if (dupes.length > 0) {
      errors.push(
        `content.options contains duplicate id(s): ${[...new Set(dupes)].join(', ')}`
      );
    }
  }

  return errors;
}

/**
 * Semantic checks for localizationFlags.localeReadiness.
 * For translated items (meta.sourceLanguage present):
 *   1. localizationFlags.localeReadiness must exist and be a non-empty array.
 *   2. The array must contain an entry whose locale matches meta.language.
 * Returns array of error strings.
 */
function checkLocaleReadiness(item) {
  const errors = [];
  const lang   = item?.meta?.language;
  const source = item?.meta?.sourceLanguage; // present only on translations

  if (!source || !lang) return errors; // not a translation — skip

  const lr = item?.localizationFlags?.localeReadiness;

  if (!Array.isArray(lr) || lr.length === 0) {
    errors.push(
      `localizationFlags.localeReadiness is missing or empty — ` +
      `translated content (meta.sourceLanguage is set) must include a localeReadiness entry for "${lang}"`
    );
    return errors; // nothing more to check without the array
  }

  const hasMatchingEntry = lr.some(entry => entry.locale === lang);
  if (!hasMatchingEntry) {
    errors.push(
      `localizationFlags.localeReadiness has no entry for locale "${lang}" ` +
      `(required for translated content — meta.sourceLanguage is set)`
    );
  }

  return errors;
}

// ─── Per-type semantic dispatch ────────────────────────────────────────────────
function semanticChecks(item) {
  const errors = [];

  // Type-specific checks
  switch (item.type) {
    case 'ui-label': errors.push(...checkUiLabel(item)); break;
    case 'question': errors.push(...checkQuestion(item)); break;
  }

  // Cross-type checks (apply to all content types)
  errors.push(...checkLocaleReadiness(item));

  return errors;
}

// ─── Validate a single file ────────────────────────────────────────────────────
function validateFile(filePath) {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    return { file: filePath, valid: false, errors: [`JSON parse error: ${e.message}`] };
  }

  const items     = Array.isArray(data) ? data : [data];
  const allErrors = [];

  for (const item of items) {
    const label = item.id || item.type || '(unknown)';

    // 1. Schema validation
    const { type } = item;
    if (!type) {
      allErrors.push(`[${label}] Missing "type" field`);
      continue;
    }
    const validate = validators[type];
    if (!validate) {
      allErrors.push(
        `[${label}] No schema for type "${type}" — expected one of: ${Object.keys(validators).join(', ')}`
      );
      continue;
    }
    const schemaValid = validate(item);
    if (!schemaValid) {
      for (const err of validate.errors) {
        allErrors.push(`[${label}] ${err.instancePath || '(root)'} ${err.message}`);
      }
    }

    // 2. Semantic checks (run even when schema passes — catches things schema can't)
    for (const msg of semanticChecks(item)) {
      allErrors.push(`[${label}] ${msg}`);
    }
  }

  return { file: filePath, valid: allErrors.length === 0, errors: allErrors };
}

// ─── Collect JSON files recursively ───────────────────────────────────────────
function collectJsonFiles(target) {
  const stat = fs.statSync(target);
  if (stat.isFile()) return [target];
  const files = [];
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    const full = path.join(target, entry.name);
    if (entry.isDirectory()) files.push(...collectJsonFiles(full));
    else if (entry.name.endsWith('.json') && !entry.name.endsWith('.schema.json')) {
      files.push(full);
    }
  }
  return files;
}

// ─── Main ──────────────────────────────────────────────────────────────────────
const target = process.argv[2] || path.join(__dirname, 'examples');
let files;
try {
  files = collectJsonFiles(target);
} catch (e) {
  console.error(`Cannot read target: ${e.message}`);
  process.exit(1);
}

if (files.length === 0) {
  console.log('No JSON files found.');
  process.exit(0);
}

let passed = 0;
let failed = 0;

for (const file of files) {
  const result = validateFile(file);
  const label  = path.relative(__dirname, file);
  if (result.valid) {
    console.log(`  ✓  ${label}`);
    passed++;
  } else {
    console.log(`  ✗  ${label}`);
    for (const err of result.errors) {
      console.log(`       ${err}`);
    }
    failed++;
  }
}

console.log(`\n${passed + failed} file(s) checked. ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
