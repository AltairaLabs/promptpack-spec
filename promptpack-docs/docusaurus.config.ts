import {readFileSync} from 'node:fs';
import path from 'node:path';
import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * The spec version, read from the schema — the single source of truth.
 *
 * Surfaced to components via customFields so the standards strip, homepage and
 * footer cannot drift from the schema on a version bump. version-check only
 * guards the schema against README, so anything hardcoded in the site would go
 * stale silently; this removes that class of drift rather than adding another
 * checklist item.
 */
const SPEC_VERSION: string = JSON.parse(
  readFileSync(path.join(__dirname, '../schema/promptpack.schema.json'), 'utf8'),
).version;

const config: Config = {
  title: 'PromptPack',
  tagline: 'One open spec to define, package, and ship an agent.',
  favicon: 'img/favicon.svg',
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://promptpack.org',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'altairalabs', // Usually your GitHub org/user name.
  projectName: 'promptpack-spec', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'warn',

  // giscus comment widget config, consumed by src/theme/DocItem/Footer.
  // Renders a comment box on individual RFC pages (/docs/rfcs/<slug>), backed
  // by GitHub Discussions. The footer no-ops until repoId + categoryId are set.
  // One-time setup: see promptpack-docs/src/theme/DocItem/Footer/SETUP-giscus.md
  customFields: {
    // Read from schema/promptpack.schema.json at build time — never hardcode.
    specVersion: SPEC_VERSION,
    giscus: {
      repo: 'altairalabs/promptpack-spec',
      repoId: 'R_kgDOQMvRhA',
      category: 'RFC Comments',
      categoryId: 'DIC_kwDOQMvRhM4C_FUh',
      mapping: 'pathname',
    },
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/altairalabs/promptpack-spec/tree/main/promptpack-docs/',
        },
        blog: false, // Disable blog functionality
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Social card for sharing
    image: 'img/promptpack-social-card.svg',
    metadata: [
      {name: 'description', content: 'PromptPack is the declarative format for a production agent — the models it requires, its prompts, tools, workflows, guardrails, and the quality checks it must pass — in a single portable, versioned artifact.'},
      {name: 'keywords', content: 'promptpack, prompts, ai agents, agent loops, llm, specification, json, workflows, testing, packaging, deployment'},
      {property: 'og:title', content: 'PromptPack — One open spec to define, package, and ship an agent'},
      {property: 'og:description', content: 'The open, vendor-neutral format for a production agent — prompts, tools, workflows, guardrails and quality checks in one portable, versioned artifact.'},
      {property: 'og:image', content: 'https://promptpack.org/img/promptpack-social-card.svg'},
      {property: 'og:url', content: 'https://promptpack.org'},
      {property: 'og:type', content: 'website'},
      {name: 'twitter:card', content: 'summary_large_image'},
      {name: 'twitter:title', content: 'PromptPack — One open spec to define, package, and ship an agent'},
      {name: 'twitter:description', content: 'The open, vendor-neutral format for a production agent — prompts, tools, workflows, guardrails and quality checks in one portable, versioned artifact.'},
      {name: 'twitter:image', content: 'https://promptpack.org/img/promptpack-social-card.svg'},
    ],
    colorMode: {
      // Atlas ships dark as its base ramp, but promptpack.org leads light —
      // "the printed star chart" register for a standards document.
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'PromptPack',
      logo: {
        alt: 'PromptPack',
        src: 'img/logo.svg',
        // The Atlas mark is outline-only, so its strokes have to change with
        // the ramp — one file cannot serve both grounds.
        srcDark: 'img/logo-dark.svg',
      },
      items: [
        // The .org pill sits immediately after the wordmark, per the handoff
        // masthead. Navbar titles cannot carry markup, so it rides as the
        // first left-hand item.
        {type: 'html', position: 'left', value: '<span class="navbarOrgPill">.org</span>'},
        {to: '/docs/spec/overview', label: 'Spec', position: 'left'},
        {to: '/docs/processes/rfc-process', label: 'Processes', position: 'left'},
        {to: '/docs/rfcs', label: 'RFCs', position: 'left'},
        {to: '/docs/ecosystem/promptkit-runtime', label: 'Ecosystem', position: 'left'},
        {
          href: 'https://github.com/altairalabs/promptpack-spec',
          label: 'GitHub',
          position: 'right',
        },
        {
          to: '/docs/spec/overview',
          label: 'Read the spec',
          position: 'right',
          className: 'navbarCta',
        },
      ],
    },
    footer: {
      // No 'dark' style: Infima's .footer--dark pins a fixed #303846 that beats
      // the Atlas mapping. The footer now follows --ink-void in both modes.
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started',
            },
            {
              label: 'Why PromptPack?',
              to: '/docs/why-promptpack',
            },
            {
              label: 'Specification',
              to: '/docs/spec/overview',
            },
            {
              label: 'Examples',
              to: '/docs/spec/examples',
            },
          ],
        },
        {
          title: 'Ecosystem',
          items: [
            {
              label: 'PromptKit Runtime',
              to: '/docs/ecosystem/promptkit-runtime',
            },
            {
              label: 'PromptArena Testing',
              to: '/docs/ecosystem/arena-testing',
            },
            {
              label: 'Community Tools',
              to: '/docs/ecosystem/community-tools',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/altairalabs/promptpack-spec',
            },
            {
              label: 'Discussions',
              href: 'https://github.com/altairalabs/promptpack-spec/discussions',
            },
            {
              label: 'RFC Process',
              to: '/docs/processes/rfc-process',
            },
            {
              label: 'Contributing',
              to: '/docs/processes/contributing',
            },
          ],
        },
        {
          title: 'About',
          items: [
            {
              label: 'Governance',
              to: '/docs/processes/governance',
            },
            {
              label: 'Code of Conduct',
              href: 'https://github.com/altairalabs/promptpack-spec/blob/main/CODE_OF_CONDUCT.md',
            },
            {
              label: 'AltairaLabs',
              href: 'https://altairalabs.ai',
            },
          ],
        },
      ],
      copyright: `PromptPack is an open specification by AltairaLabs. The specification is licensed CC-BY-4.0; code and reference implementations are MIT.`,
    },
    prism: {
      theme: prismThemes.github,
      // Night Owl's navy ground sits with the Atlas ink ramp; Dracula's
      // purple fought it.
      darkTheme: prismThemes.nightOwl,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
