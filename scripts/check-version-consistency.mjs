#!/usr/bin/env node
/**
 * Asserts that the spec version is consistent across:
 *   - schema/promptpack.schema.json   (the source of truth)
 *   - README.md badge                 ("Spec-vX.Y.Z-blue")
 *   - README.md versioned schema URL  ("schema/vX.Y.Z/promptpack.schema.json")
 *
 * Exists because RFC-0009 was marked "Implemented" while the schema fields
 * weren't added — drift that no automated check caught. This script is the
 * automated check.
 *
 * Usage:
 *   node scripts/check-version-consistency.mjs
 *
 * Exits 0 on success, 1 on any drift.
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

const schema = JSON.parse(
  readFileSync(resolve(repoRoot, "schema/promptpack.schema.json"), "utf-8")
);
const readme = readFileSync(resolve(repoRoot, "README.md"), "utf-8");

const schemaVersion = schema.version;

const badgeMatch = readme.match(/Spec-v([0-9]+\.[0-9]+\.[0-9]+)-blue/);
const urlMatch = readme.match(
  /schema\/v([0-9]+\.[0-9]+\.[0-9]+)\/promptpack\.schema\.json/
);

const errors = [];

if (!schemaVersion) {
  errors.push("schema/promptpack.schema.json is missing a top-level `version` field.");
}

if (!badgeMatch) {
  errors.push(
    "README.md is missing the `Spec-vX.Y.Z-blue` shields.io badge — can't verify badge version."
  );
} else if (badgeMatch[1] !== schemaVersion) {
  errors.push(
    `README badge version (v${badgeMatch[1]}) does not match schema version (v${schemaVersion}). ` +
      `Update the [![Spec Version](...)] line in README.md.`
  );
}

if (!urlMatch) {
  errors.push(
    "README.md is missing the versioned schema URL (`schema/vX.Y.Z/promptpack.schema.json`) — can't verify."
  );
} else if (urlMatch[1] !== schemaVersion) {
  errors.push(
    `README versioned schema URL (v${urlMatch[1]}) does not match schema version (v${schemaVersion}). ` +
      `Update the "Versioned:" line in README.md's JSON Schema section.`
  );
}

if (errors.length > 0) {
  console.error("[check-version-consistency] FAIL\n");
  for (const e of errors) console.error("  - " + e);
  console.error(
    "\nFix the drift above. Schema is the source of truth; README must follow."
  );
  process.exit(1);
}

console.log(
  `[check-version-consistency] ok — schema, badge, and versioned URL all at v${schemaVersion}.`
);
