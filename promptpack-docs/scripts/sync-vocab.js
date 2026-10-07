#!/usr/bin/env node

/**
 * Generate the minted RFC 0016 vocabularies from vocab/<ns>.json:
 *   static/vocab/<ns>.ttl     Turtle
 *   static/vocab/<ns>.jsonld  JSON-LD
 * The human-readable page at /vocab/<ns>/ is rendered from the same JSON by
 * src/pages/vocab/[ns].astro.
 *
 * GitHub Pages cannot content-negotiate, so a namespace IRI such as
 * https://promptpack.org/vocab/hipaa#PHI dereferences to the HTML page, which
 * embeds the JSON-LD and links both files with rel="alternate".
 */

const fs = require('node:fs');
const path = require('node:path');

// Paths are resolved on call, not at load: the Astro page imports this module
// into an ES-module bundle where __dirname does not exist.
const vocabDir = () => path.join(__dirname, '../vocab');
const outDir = () => path.join(__dirname, '../static/vocab');
const NAMESPACES = ['hipaa', 'pp'];

const PREFIXES = {
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
  owl: 'http://www.w3.org/2002/07/owl#',
  skos: 'http://www.w3.org/2004/02/skos/core#',
  dcterms: 'http://purl.org/dc/terms/',
};

function loadVocab(ns) {
  return JSON.parse(fs.readFileSync(path.join(vocabDir(), `${ns}.json`), 'utf8'));
}

/** The namespace IRI without its trailing '#', which names the ontology itself. */
const ontologyIri = (vocab) => vocab.namespace.replace(/#$/, '');

function literal(s) {
  const escaped = s
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
  return `"${escaped}"@en`;
}

function toTurtle(vocab) {
  const p = vocab.prefix;
  const lines = [
    ...Object.entries(PREFIXES).map(([k, v]) => `@prefix ${k}: <${v}> .`),
    `@prefix ${p}: <${vocab.namespace}> .`,
    '',
    `<${ontologyIri(vocab)}> a owl:Ontology ;`,
    `    dcterms:title ${literal(vocab.title)} ;`,
    `    dcterms:description ${literal(vocab.description)} .`,
  ];
  for (const t of vocab.terms) {
    const props = [
      `rdfs:label ${literal(t.label)}`,
      `skos:definition ${literal(t.definition)}`,
      `rdfs:isDefinedBy <${ontologyIri(vocab)}>`,
    ];
    if (t.source) props.push(`dcterms:source ${literal(t.source)}`);
    if (t.seeAlso) props.push(`rdfs:seeAlso <${t.seeAlso}>`);
    lines.push('', `${p}:${t.id} a rdfs:Class, skos:Concept ;`);
    lines.push(props.map((x) => `    ${x}`).join(' ;\n') + ' .');
  }
  return lines.join('\n') + '\n';
}

function toJsonLd(vocab) {
  const p = vocab.prefix;
  return {
    '@context': {
      ...PREFIXES,
      [p]: vocab.namespace,
      'rdfs:seeAlso': { '@type': '@id' },
      'rdfs:isDefinedBy': { '@type': '@id' },
    },
    '@graph': [
      {
        '@id': ontologyIri(vocab),
        '@type': 'owl:Ontology',
        'dcterms:title': { '@value': vocab.title, '@language': 'en' },
        'dcterms:description': { '@value': vocab.description, '@language': 'en' },
      },
      ...vocab.terms.map((t) => ({
        '@id': `${p}:${t.id}`,
        '@type': ['rdfs:Class', 'skos:Concept'],
        'rdfs:label': { '@value': t.label, '@language': 'en' },
        'skos:definition': { '@value': t.definition, '@language': 'en' },
        'rdfs:isDefinedBy': ontologyIri(vocab),
        ...(t.source && { 'dcterms:source': { '@value': t.source, '@language': 'en' } }),
        ...(t.seeAlso && { 'rdfs:seeAlso': t.seeAlso }),
      })),
    ],
  };
}

function main() {
  const out = outDir();
  fs.mkdirSync(out, { recursive: true });
  for (const ns of NAMESPACES) {
    const vocab = loadVocab(ns);
    fs.writeFileSync(path.join(out, `${ns}.ttl`), toTurtle(vocab));
    fs.writeFileSync(path.join(out, `${ns}.jsonld`), JSON.stringify(toJsonLd(vocab), null, 2) + '\n');
    console.log(`✓ vocab ${ns}: ${vocab.terms.length} terms`);
  }
}

if (require.main === module) main();

module.exports = { loadVocab, toTurtle, toJsonLd, NAMESPACES };
