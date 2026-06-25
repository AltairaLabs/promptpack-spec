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
const RFC_INDEX_PATH = path.join(__dirname, '../docs/rfcs/index.md');

// Hand-maintained mapping of RFC number → spec version that implemented it.
// Update when a new RFC ships in a spec release.
const RFC_SPEC_VERSION = {
  1: 'v1.0',
  2: 'v1.0',
  3: 'v1.0',
  4: 'v1.1',
  5: 'v1.3',
  6: 'v1.2',
  7: 'v1.3',
  8: 'v1.3.1',
  9: 'v1.4',
  10: 'v1.5.0',
  11: 'v1.4.1',
  12: 'v1.5.1',
};

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
  
  // Extract status from metadata line (e.g., "- **Status:** Implemented")
  const statusMatch = content.match(/[-*]\s*\*\*Status[:]?\*\*[:\s]*(.*)/i);
  const status = statusMatch ? statusMatch[1].trim() : 'Draft';

  // Extract Created and Updated dates from metadata block
  const createdMatch = content.match(/[-*]\s*\*\*Created[:]?\*\*[:\s]*(\d{4}-\d{2}-\d{2})/i);
  const updatedMatch = content.match(/[-*]\s*\*\*Updated[:]?\*\*[:\s]*(\d{4}-\d{2}-\d{2})/i);
  const created = createdMatch ? createdMatch[1] : '—';
  const updated = updatedMatch ? updatedMatch[1] : '—';

  return { position, title, description, status, created, updated };
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
 * Map status text to an emoji
 */
const STATUS_EMOJI = {
  'draft': '📝 Draft',
  'review': '🔍 Review',
  'accepted': '✅ Accepted',
  'implemented': '🚀 Implemented',
  'rejected': '❌ Rejected',
  'deferred': '⏸️ Deferred',
};

function formatStatus(status) {
  return STATUS_EMOJI[status.toLowerCase()] || `📝 ${status}`;
}

/**
 * Update the RFC index table in rfc-index.md
 */
function updateRfcIndex(rfcEntries) {
  if (!fs.existsSync(RFC_INDEX_PATH)) {
    console.log('⚠️  rfcs/index.md not found, skipping index update');
    return;
  }

  const indexContent = fs.readFileSync(RFC_INDEX_PATH, 'utf8');

  // Build the table
  const header = '| # | Title | Status | Spec | Created | Updated |\n|---|-------|--------|------|---------|---------|';
  const sorted = rfcEntries.sort((a, b) => a.position - b.position);
  const rows = sorted.map(e => {
    const slug = e.filename.replace(/^\d{4}-/, '').replace(/\.md$/, '');
    const rfcNum = String(e.position).padStart(4, '0');
    const shortTitle = e.title.replace(/^RFC\s+\d{4}:\s*/, '');
    const spec = RFC_SPEC_VERSION[e.position] || '—';
    return `| [RFC-${rfcNum}](/docs/rfcs/${slug}) | ${shortTitle} | ${formatStatus(e.status)} | ${spec} | ${e.created} | ${e.updated} |`;
  });

  const table = [header, ...rows].join('\n');
  let newContent = indexContent.replace(
    /<!-- RFC_TABLE_START -->[\s\S]*?<!-- RFC_TABLE_END -->/,
    `<!-- RFC_TABLE_START -->\n${table}\n<!-- RFC_TABLE_END -->`
  );

  // Also refresh the At-a-Glance counts
  const total = sorted.length;
  const implemented = sorted.filter(e => /implemented/i.test(e.status)).length;
  const draft = sorted.filter(e => /draft/i.test(e.status)).length;
  const review = sorted.filter(e => /review/i.test(e.status)).length;
  const rejected = sorted.filter(e => /rejected/i.test(e.status)).length;
  const countsBlock =
    `<!-- RFC_COUNTS_START -->\n` +
    `| | Count |\n|---|---|\n` +
    `| Total RFCs | ${total} |\n` +
    `| Implemented | ${implemented} |\n` +
    `| Draft | ${draft} |\n` +
    `| In Review | ${review} |\n` +
    `| Rejected | ${rejected} |\n` +
    `<!-- RFC_COUNTS_END -->`;
  newContent = newContent.replace(
    /<!-- RFC_COUNTS_START -->[\s\S]*?<!-- RFC_COUNTS_END -->/,
    countsBlock
  );

  fs.writeFileSync(RFC_INDEX_PATH, newContent, 'utf8');
  console.log(`📋 Updated RFC index table with ${rfcEntries.length} entries\n`);
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

  // Sync each RFC and collect metadata for index
  const rfcPattern = /^\d{4}-.*\.md$/;
  const rfcEntries = [];
  let syncedCount = 0;

  for (const filename of files) {
    if (rfcPattern.test(filename) && filename !== '0000-template.md') {
      syncRFC(filename);

      // Read source content to collect metadata for the index
      const content = fs.readFileSync(path.join(RFC_SOURCE_DIR, filename), 'utf8');
      const metadata = extractMetadata(filename, content);
      rfcEntries.push({ filename, ...metadata });

      syncedCount++;
    }
  }

  // Update the RFC index table
  updateRfcIndex(rfcEntries);

  console.log(`✨ Successfully synced ${syncedCount} RFC(s)`);
}

// Run if called directly
if (require.main === module) {
  syncAllRFCs();
}

module.exports = { syncAllRFCs };
