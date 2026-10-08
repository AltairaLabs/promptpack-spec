// JS: ajv 2020 with its default strict settings (what users get), with only the documented workaround applied —
// `version` registered as a keyword. Any *other* unknown keyword or strict
// error fails the check, so a new non-standard keyword cannot slip in. The
// JSON fixtures are also validated with `unicodeRegExp` on (ajv's default).
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const [schemaPath, dir] = process.argv.slice(2);
const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));
let ok = true;
let validate;
try {
  const ajv = new Ajv2020({ allErrors: true, logger: false }); // ajv's default strictness
  addFormats(ajv);
  ajv.addKeyword('version');
  validate = ajv.compile(schema);
} catch (e) {
  console.log(`FAIL ajv: compile: ${e.message}`);
  process.exit(1);
}
for (const f of readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
  const valid = validate(JSON.parse(readFileSync(join(dir, f), 'utf8')));
  const good = valid === f.startsWith('valid');
  ok &&= good;
  console.log(`${good ? 'PASS' : 'FAIL'} ajv ${f}${good ? '' : ' ' + JSON.stringify(validate.errors?.slice(0, 2))}`);
}
process.exit(ok ? 0 : 1);
