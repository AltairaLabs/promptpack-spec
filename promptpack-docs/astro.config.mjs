// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';

/**
 * promptpack.org — Astro + Starlight.
 *
 * THE URLS ARE THE CONTRACT. This is the public specification site, and two
 * classes of URL must not move:
 *
 *   1. /schema/**\/promptpack.schema.json — ten versioned files, referenced
 *      from `$schema` fields in real packs and from 46 files in this repo.
 *      They are an API, not documentation.
 *   2. The 85 routes under /docs/. Inbound links to a specification are
 *      long-lived and expensive to break.
 *
 * Everything odd in this file exists to keep those fixed, so the migration
 * needed no redirects at all:
 *
 *   outDir: 'build'    — deploy.yml uploads ./promptpack-docs/build
 *   publicDir: 'static'— publish-schema.yml writes static/schema/vX/, and CNAME
 *                        and robots.txt already live there
 *
 * The docs collection reads from ./docs (see src/content.config.ts) rather than
 * the Starlight default, so sync-rfcs.js and generate-schema-docs.yml keep
 * writing where they always did.
 */
export default defineConfig({
  site: 'https://promptpack.org',
  outDir: './build',
  publicDir: './static',
  integrations: [
    sitemap(),
    starlight({
      title: 'PromptPack',
      description:
        'An open specification for the behavioural contract of an AI agent: prompts, tools, policies and evaluations in one portable, versioned artefact.',
      // PromptPack's mark is OUTLINE-ONLY, so unlike the solid product tiles it
      // needs a cut per theme — the same pair the deleted Docusaurus navbar
      // used. A single file renders invisible on one of the two grounds.
      logo: {
        light: './src/assets/logo-promptpack-light.svg',
        dark: './src/assets/logo-promptpack-dark.svg',
        alt: 'PromptPack',
      },
      favicon: '/img/logo.svg',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/AltairaLabs/promptpack-spec' },
      ],
      customCss: [
        '@altairalabs/atlas-tokens/index.css',
        '@altairalabs/brand/starlight-atlas.css',
        // Reserves header height for the family bar strip. The package ships
        // it precisely so this number cannot drift from the bar's own height —
        // family-bar-height.test.ts fails if they disagree.
        '@altairalabs/brand/family-bar-starlight.css',
        './src/styles/site.css',
      ],
      components: {
        Header: './src/components/Header.astro',
      },
      // Mirrors sidebars.ts. Slugs carry the `docs/` prefix because the loader
      // adds it — see src/content.config.ts.
      sidebar: [
        { slug: 'docs/getting-started' },
        { slug: 'docs/why-promptpack' },
        { slug: 'docs/regulated-environments' },
        {
          label: 'Specification',
          items: [
            { slug: 'docs/spec/versions' },
            { slug: 'docs/spec/overview' },
            { slug: 'docs/spec/structure' },
            { slug: 'docs/spec/architecture-patterns' },
            { slug: 'docs/spec/examples' },
            { slug: 'docs/spec/file-format' },
            { slug: 'docs/spec/schema-reference' },
            { slug: 'docs/spec/schema-guide' },
            {
              // Superseded versions live here rather than as seven sibling
              // categories beside the current spec pages. Labels drop
              // '(Archived)' since the parent already says it.
              label: 'Archive',
              collapsed: true,
              items: [
                archive('v1.4.1'),
                archive('v1.4.0'),
                archive('v1.3.1'),
                archive('v1.3'),
                archive('v1.2', ['overview', 'structure', 'examples', 'file-format', 'schema-reference', 'schema-guide']),
                archive('v1.1', ['overview', 'structure', 'examples', 'file-format', 'schema-reference', 'schema-guide']),
                archive('v1.0', ['overview', 'examples', 'file-format', 'schema-reference', 'schema-guide']),
              ],
            },
          ],
        },
        {
          label: 'Guides',
          items: [
            { slug: 'docs/guides/add-workflow' },
            { slug: 'docs/guides/add-composition' },
            { slug: 'docs/guides/setup-agents' },
            { slug: 'docs/guides/add-skills' },
            { slug: 'docs/guides/add-evals' },
          ],
        },
        {
          label: 'Processes',
          items: [
            { slug: 'docs/processes/rfc-process' },
            { slug: 'docs/processes/governance' },
            { slug: 'docs/processes/contributing' },
          ],
        },
        { label: 'RFCs', items: [{ autogenerate: { directory: 'docs/rfcs' } }] },
        {
          label: 'Ecosystem',
          items: [
            { slug: 'docs/ecosystem/promptkit-runtime' },
            { slug: 'docs/ecosystem/arena-testing' },
            { slug: 'docs/ecosystem/integrations' },
            { slug: 'docs/ecosystem/community-tools' },
          ],
        },
        { slug: 'docs/adopters' },
      ],
      head: [
        { tag: 'script', attrs: { type: 'module', src: '/mermaid-init.js' } },
      ],
    }),
  ],
});

/** One archived spec version. Defaults to the full seven-page set. */
function archive(
  version,
  pages = [
    'overview',
    'structure',
    'architecture-patterns',
    'examples',
    'file-format',
    'schema-reference',
    'schema-guide',
  ],
) {
  return {
    label: version,
    collapsed: true,
    items: pages.map((page) => ({ slug: `docs/spec/${version}/${page}` })),
  };
}
