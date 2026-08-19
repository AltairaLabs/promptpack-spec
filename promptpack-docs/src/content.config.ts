import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

/**
 * Astro's `glob()` loader, not Starlight's `docsLoader()`.
 *
 * `docsLoader()` hardcodes `src/content/docs/`. Two things need the content to
 * stay at `./docs/` instead:
 *
 *   - `scripts/sync-rfcs.js` copies the RFCs there before every build, and
 *     `generate-schema-docs.yml` regenerates `docs/spec/schema-reference.md`
 *     on a schedule. Both would need editing to chase a moved directory.
 *   - The live URLs are `/docs/...` and must not move. `generateId` puts the
 *     prefix back, so the Docusaurus routes survive verbatim and the migration
 *     needs no redirects.
 *
 * `glob()` takes a base, so the directory stays where every other tool in this
 * repo already expects it.
 */
export const collections = {
  docs: defineCollection({
    loader: glob({
      base: './docs',
      // Leading-underscore files are partials, matching Starlight's own rule.
      pattern: '**/[^_]*.{md,mdx}',
      generateId: ({ entry }) =>
        'docs/' + entry.replace(/\.mdx?$/, '').replace(/(^|\/)index$/, ''),
    }),
    schema: docsSchema(),
  }),
};
