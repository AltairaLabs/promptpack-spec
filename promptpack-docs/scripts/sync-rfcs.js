#!/usr/bin/env node

/**
 * Sync RFCs from /rfcs/ to /promptpack-docs/docs/rfcs/
 * Adds Docusaurus frontmatter to each RFC file
 */

const fs = require('fs');
const path = require('path');

// Paths
const RFC_SOURCE_DIR = path.join(__dirname, '../../rfcs');
const RFC_DEST_DIR = path.join(__dirname, '../docs/rfcs');

// RFC metadata mapping (extracted from first lines of each RFC)
const RFC_METADATA = {
  '0001-core-schema.md': {
    position: 1,
    title: 'RFC-0001: Core PromptPack Schema',
    description: 'Foundational JSON schema structure for packaging conversational AI systems',
  },
  '0002-yaml-format.md': {
    position: 2,
    title: 'RFC-0002: YAML File Format',
    description: 'Human-friendly YAML authoring format for PromptPack configurations',
  },
  '0003-template-variables.md': {
    position: 3,
    title: 'RFC-0003: Template Variable System',
    description: 'Dynamic template variable substitution for PromptPack',
  },
  '0004-multimodal-support.md': {
    position: 4,
    title: 'RFC-0004: Multimodal Content Support',
    description: 'Image, audio, video, document, and custom media type support for PromptPack',
  },
};

/**
 * Generate Docusaurus frontmatter for an RFC
 */
function generateFrontmatter(metadata) {
  return `---
sidebar_position: ${metadata.position}
title: "${metadata.title}"
description: ${metadata.description}
---

`;
}

/**
 * Sync a single RFC file
 */
function syncRFC(filename) {
  const sourcePath = path.join(RFC_SOURCE_DIR, filename);
  const destPath = path.join(RFC_DEST_DIR, filename);
  
  // Skip if not an RFC file or if it's the template
  if (!filename.match(/^\d{4}-.*\.md$/) || filename === '0000-template.md') {
    console.log(`⏭️  Skipping: ${filename}`);
    return;
  }
  
  // Get metadata
  const metadata = RFC_METADATA[filename];
  if (!metadata) {
    console.warn(`⚠️  No metadata found for ${filename}, skipping`);
    return;
  }
  
  try {
    // Read source file
    const content = fs.readFileSync(sourcePath, 'utf8');
    
    // Generate frontmatter
    const frontmatter = generateFrontmatter(metadata);
    
    // Combine frontmatter + content
    const outputContent = frontmatter + content;
    
    // Write to destination
    fs.writeFileSync(destPath, outputContent, 'utf8');
    console.log(`✅ Synced: ${filename}`);
  } catch (error) {
    console.error(`❌ Error syncing ${filename}:`, error.message);
    process.exit(1);
  }
}

/**
 * Main sync function
 */
function syncAllRFCs() {
  console.log('🔄 Syncing RFCs from /rfcs/ to /promptpack-docs/docs/rfcs/\n');
  
  // Ensure destination directory exists
  if (!fs.existsSync(RFC_DEST_DIR)) {
    fs.mkdirSync(RFC_DEST_DIR, { recursive: true });
    console.log(`📁 Created directory: ${RFC_DEST_DIR}\n`);
  }
  
  // Read all files from source directory
  const files = fs.readdirSync(RFC_SOURCE_DIR);
  
  // Sync each RFC
  let syncedCount = 0;
  files.forEach(filename => {
    if (filename.match(/^\d{4}-.*\.md$/) && filename !== '0000-template.md') {
      syncRFC(filename);
      syncedCount++;
    }
  });
  
  console.log(`\n✨ Successfully synced ${syncedCount} RFC(s)`);
}

// Run if called directly
if (require.main === module) {
  syncAllRFCs();
}

module.exports = { syncAllRFCs };
