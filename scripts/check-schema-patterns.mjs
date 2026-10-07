#!/usr/bin/env node
/**
 * Every `pattern` and `patternProperties` key in the schema must use only the
 * regex subset that every mainstream validator supports. JSON Schema says
 * patterns are ECMA-262, but Go's regexp (RE2) — which PromptKit's validator
 * uses — rejects lookaround and backreferences, and refuses to load the whole
 * schema when it meets one. v1.8.0 shipped a lookahead in reviews[].cadence
 * and every pack failed validation in PromptKit until v1.8.1.
 *
 * Usage: node scripts/check-schema-patterns.mjs [schema.json]
 */
import { readFileSync } from 'node:fs';

// Constructs RE2 does not support.
const UNSUPPORTED = [
  [/\(\?[=!]/, 'lookahead'],
  [/\(\?<[=!]/, 'lookbehind'],
  [/\\[1-9]/, 'backreference'],
  [/\\k</, 'named backreference'],
  [/\(\?>/, 'atomic group'],
  [/[*+?}]\+/, 'possessive quantifier'],
];

export function findUnsupported(schema) {
  const problems = [];
  const visit = (node, path) => {
    if (Array.isArray(node)) return node.forEach((v, i) => visit(v, `${path}/${i}`));
    if (!node || typeof node !== 'object') return;
    for (const [key, value] of Object.entries(node)) {
      const here = `${path}/${key}`;
      const patterns = key === 'pattern' && typeof value === 'string' ? [value]
        : key === 'patternProperties' && value && typeof value === 'object' ? Object.keys(value)
        : [];
      for (const p of patterns) {
        for (const [re, what] of UNSUPPORTED) {
          if (re.test(p)) problems.push(`${here}: ${what} in ${JSON.stringify(p)}`);
        }
      }
      visit(value, here);
    }
  };
  visit(schema, '#');
  return problems;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const file = process.argv[2] ?? 'schema/promptpack.schema.json';
  const problems = findUnsupported(JSON.parse(readFileSync(file, 'utf8')));
  if (problems.length) {
    console.error('[check-schema-patterns] patterns RE2 (Go) cannot compile:');
    for (const p of problems) console.error(`  ${p}`);
    process.exit(1);
  }
  console.log('[check-schema-patterns] ok — every pattern is RE2-compatible.');
}
