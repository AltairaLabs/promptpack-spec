#!/usr/bin/env node

/**
 * Sync schema from root to static/schema folders
 * Copies schema/promptpack.schema.json to:
 * - static/schema/latest/
 * - static/schema/v1.1/ (or whatever version is in the schema)
 */

const fs = require('node:fs');
const path = require('node:path');

const ROOT_SCHEMA = path.join(__dirname, '../../schema/promptpack.schema.json');
const STATIC_SCHEMA_DIR = path.join(__dirname, '../static/schema');

function main() {
  // Read the source schema
  const schemaContent = fs.readFileSync(ROOT_SCHEMA, 'utf8');
  const schema = JSON.parse(schemaContent);
  
  // Extract version from schema
  const version = schema.version;
  if (!version) {
    console.error('Error: Schema does not have a version field');
    process.exit(1);
  }
  
  console.log(`Syncing schema version ${version}...`);
  
  // Create version-specific directory (e.g., v1.1)
  const versionDir = path.join(STATIC_SCHEMA_DIR, `v${version}`);
  if (!fs.existsSync(versionDir)) {
    fs.mkdirSync(versionDir, { recursive: true });
    console.log(`Created directory: ${versionDir}`);
  }
  
  // Create latest directory
  const latestDir = path.join(STATIC_SCHEMA_DIR, 'latest');
  if (!fs.existsSync(latestDir)) {
    fs.mkdirSync(latestDir, { recursive: true });
    console.log(`Created directory: ${latestDir}`);
  }
  
  // Copy to version-specific folder
  const versionTarget = path.join(versionDir, 'promptpack.schema.json');
  fs.copyFileSync(ROOT_SCHEMA, versionTarget);
  console.log(`✓ Copied to ${versionTarget}`);
  
  // Copy to latest folder
  const latestTarget = path.join(latestDir, 'promptpack.schema.json');
  fs.copyFileSync(ROOT_SCHEMA, latestTarget);
  console.log(`✓ Copied to ${latestTarget}`);
  
  console.log(`\nSchema sync complete! Version ${version} is now available at:`);
  console.log(`  - /schema/latest/promptpack.schema.json`);
  console.log(`  - /schema/v${version}/promptpack.schema.json`);
}

main();
