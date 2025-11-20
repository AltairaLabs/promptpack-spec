#!/usr/bin/env node

/**
 * Sync RFCs from /rfcs/ to /promptpack-docs/docs/rfcs/
 * Adds Docusaurus frontmatter to each RFC file
 * 
 * Automatically extracts RFC metadata from the file content:
 * - RFC number from filename
 * - Title from the first heading (# RFC XXXX: Title)
 * - Description from the Summary section
 */

const fs = require('fs');
const path = require('path');

// Paths
const RFC_SOURCE_DIR = path.join(__dirname, '../../rfcs');
const RFC_DEST_DIR = path.join(__dirname, '../docs/rfcs');

/**
 * Extract RFC metadata from file content
 */
function extractMetadata(filename, content) {
  // Extract RFC number from filename (e.g., "0001-core-schema.md" -> 1)
  const rfcNumberMatch = filename.match(/^(\d{4})-/);
  const position = rfcNumberMatch ? parseInt(rfcNumberMatch[1], 10) : 999;
  
  // Extract title from first heading (# RFC XXXX: Title)
  const titleMatch = content.match(/^#\s+(RFC\s+\d{4}:\s+.*?)$/m);
  const titleFromHeading = titleMatch ? titleMatch[1] : null;
  
  // Fallback: extract from filename if heading not found
  const titleFromFilename = filename
    .replace(/\.md$/, '')
    .replace(/^(\d{4})-/, 'RFC-$1: ')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  const title = titleFromHeading || titleFromFilename;
  
  // Extract description from Summary section
  let description = '';
  const summaryMatch = content.match(/##\s+Summary\s*\n\s*\n(.*?)(?=\n\n##|\n##|$)/s);
  if (summaryMatch) {
    // Take first sentence or first line of summary
    description = summaryMatch[1]
      .trim()
      .split(/\.\s+|\n/)[0]
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove markdown links
      .replace(/[*_`]/g, '') // Remove markdown formatting
      .trim();
    
    // Truncate if too long
    if (description.length > 120) {
      description = description.substring(0, 117) + '...';
    }
  }
  
  // Fallback description
  if (!description) {
    description = `RFC ${String(position).padStart(4, '0')} specification document`;
  }
  
  return { position, title, description };
}

/**
 * Generate Docusaurus frontmatter for an RFC
 */
function generateFrontmatter(metadata, filename) {
  // Generate clean slug without RFC number prefix (e.g., "0001-core-schema.md" -> "core-schema")
  const slug = filename.replace(/^\d{4}-/, '').replace(/\.md$/, '');
  
  return `---
sidebar_position: ${metadata.position}
title: "${metadata.title}"
description: ${metadata.description}
slug: ${slug}
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
  const rfcPattern = /^\d{4}-.*\.md$/;
  if (!rfcPattern.test(filename) || filename === '0000-template.md') {
    console.log(`⏭️  Skipping: ${filename}`);
    return;
  }
  
  try {
    // Read source file
    const content = fs.readFileSync(sourcePath, 'utf8');
    
    // Extract metadata from content
    const metadata = extractMetadata(filename, content);
    
    // Generate frontmatter
    const frontmatter = generateFrontmatter(metadata, filename);
    
    // Combine frontmatter + content
    const outputContent = frontmatter + content;
    
    // Write to destination
    fs.writeFileSync(destPath, outputContent, 'utf8');
    console.log(`✅ Synced: ${filename} (position: ${metadata.position})`);
    console.log(`   Title: ${metadata.title}`);
    console.log(`   Description: ${metadata.description}\n`);
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
  const rfcPattern = /^\d{4}-.*\.md$/;
  let syncedCount = 0;
  
  for (const filename of files) {
    if (rfcPattern.test(filename) && filename !== '0000-template.md') {
      syncRFC(filename);
      syncedCount++;
    }
  }
  
  console.log(`✨ Successfully synced ${syncedCount} RFC(s)`);
}

// Run if called directly
if (require.main === module) {
  syncAllRFCs();
}

module.exports = { syncAllRFCs };
