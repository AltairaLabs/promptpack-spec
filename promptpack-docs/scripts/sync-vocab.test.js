// Run with: node --test scripts/
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadVocab, toTurtle, toJsonLd, NAMESPACES } = require('./sync-vocab.js');

// The minted terms RFC 0016 publishes, by namespace.
const EXPECTED = {
  hipaa: ['CoveredEntity', 'BusinessAssociate', 'PHI', 'ePHI', 'LimitedDataSet', 'DeIdentified'],
  pp: [
    'Confidential', 'Restricted', 'Public', 'Credentials', 'FinancialAccount',
    'SyntheticMedia',
    'BiasTesting', 'AccuracyReview', 'RedTeaming', 'DataQualityReview', 'HumanOversightReview',
  ],
};

test('publishes exactly the namespaces RFC 0016 mints', () => {
  assert.deepEqual([...NAMESPACES].sort(), Object.keys(EXPECTED).sort());
});

for (const [ns, terms] of Object.entries(EXPECTED)) {
  const vocab = loadVocab(ns);

  test(`${ns}: namespace IRI is https://promptpack.org/vocab/${ns}#`, () => {
    assert.equal(vocab.namespace, `https://promptpack.org/vocab/${ns}#`);
  });

  test(`${ns}: carries exactly the RFC's terms`, () => {
    assert.deepEqual(vocab.terms.map((t) => t.id).sort(), [...terms].sort());
  });

  test(`${ns}: every term has a label and a definition`, () => {
    for (const t of vocab.terms) {
      assert.ok(t.label?.trim(), `${t.id} label`);
      assert.ok(t.definition?.trim(), `${t.id} definition`);
      assert.match(t.id, /^[A-Za-z][A-Za-z0-9]*$/, `${t.id} is a valid local name`);
    }
  });

  test(`${ns}: seeAlso only where an instrument defines the term`, () => {
    for (const t of vocab.terms) {
      if (ns === 'hipaa') {
        assert.match(t.seeAlso ?? '', /^https:\/\/www\.ecfr\.gov\//, `${t.id} cites the CFR`);
        assert.ok(t.source, `${t.id} names its section`);
      } else {
        assert.equal(t.seeAlso, undefined, `${t.id} has no defining instrument`);
      }
    }
  });

  test(`${ns}: JSON-LD parses and declares every term`, () => {
    const doc = JSON.parse(JSON.stringify(toJsonLd(vocab)));
    const ids = doc['@graph'].map((n) => n['@id']);
    assert.ok(ids.includes(vocab.namespace.replace(/#$/, '')), 'ontology node');
    for (const id of terms) assert.ok(ids.includes(`${ns}:${id}`), `${id} node`);
    const withSeeAlso = doc['@graph'].filter((n) => n['rdfs:seeAlso']).length;
    assert.equal(withSeeAlso, ns === 'hipaa' ? terms.length : 0);
  });

  test(`${ns}: Turtle declares the prefix and every term, with balanced quoting`, () => {
    const ttl = toTurtle(vocab);
    assert.match(ttl, new RegExp(`^@prefix ${ns}: <${vocab.namespace}> \\.$`, 'm'));
    for (const id of terms) {
      assert.match(ttl, new RegExp(`^${ns}:${id}\\s`, 'm'), `${id} subject`);
    }
    // Every statement ends with " ." and no string literal is left open.
    const stripped = ttl.replace(/"(?:[^"\\]|\\.)*"/g, '""');
    assert.ok(!stripped.includes('"""') && (stripped.match(/"/g) ?? []).length % 2 === 0);
    assert.equal((ttl.match(/rdfs:seeAlso/g) ?? []).length, ns === 'hipaa' ? terms.length : 0);
  });
}

test('Turtle escapes quotes and backslashes in literals', () => {
  const ttl = toTurtle({
    prefix: 'x', namespace: 'https://example.org/x#', title: 'X', description: 'd',
    terms: [{ id: 'T', label: 'say "hi"', definition: 'a\\b\nc' }],
  });
  assert.ok(ttl.includes('"say \\"hi\\""@en'));
  assert.ok(ttl.includes('"a\\\\b\\nc"@en'));
});
