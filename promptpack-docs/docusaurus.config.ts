import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'PromptPack',
  tagline: 'Stop building AI systems from scratch. Package, share, and deploy production-ready conversational AI.',
  favicon: 'img/favicon.svg',

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
      {name: 'description', content: 'Stop building AI systems from scratch. PromptPack lets you package, share, and deploy production-ready conversational AI with everything included: specialized prompts, tools, and safety guardrails.'},
      {name: 'keywords', content: 'promptpack, prompts, conversational ai, llm, specification, json, testing, packaging, deployment, production ai'},
      {property: 'og:title', content: 'PromptPack - Deploy Production-Ready AI Systems'},
      {property: 'og:description', content: 'Stop building AI systems from scratch. Package, share, and deploy production-ready conversational AI with everything included.'},
      {property: 'og:image', content: 'https://promptpack.org/img/promptpack-social-card.svg'},
      {property: 'og:url', content: 'https://promptpack.org'},
      {property: 'og:type', content: 'website'},
      {name: 'twitter:card', content: 'summary_large_image'},
      {name: 'twitter:title', content: 'PromptPack - Deploy Production-Ready AI Systems'},
      {name: 'twitter:description', content: 'Stop building AI systems from scratch. Package, share, and deploy production-ready conversational AI with everything included.'},
      {name: 'twitter:image', content: 'https://promptpack.org/img/promptpack-social-card.svg'},
    ],
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'PromptPack',
      logo: {
        alt: 'PromptPack Logo',
        src: 'img/logo.svg',
      },
      items: [
        {to: '/docs/spec/overview', label: 'Spec', position: 'left'},
        {to: '/docs/processes/rfc-process', label: 'Processes', position: 'left'},
        {to: '/docs/ecosystem/promptkit-runtime', label: 'Ecosystem', position: 'left'},
        {
          href: 'https://github.com/altairalabs/promptpack-spec',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Specification',
              to: '/docs/spec/overview',
            },
            {
              label: 'Getting Started',
              to: '/docs/getting-started',
            },
            {
              label: 'Examples',
              to: '/docs/spec/examples',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub Discussions',
              href: 'https://github.com/altairalabs/promptpack-spec/discussions',
            },
            {
              label: 'RFC Process',
              to: '/docs/processes/rfc-process',
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
              label: 'Arena Testing',
              to: '/docs/ecosystem/arena-testing',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/altairalabs/promptpack-spec',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} AltairaLabs. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
