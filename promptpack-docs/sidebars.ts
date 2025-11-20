import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    'getting-started',
    'why-promptpack',
    {
      type: 'category',
      label: 'Specification',
      items: [
        'spec/versions',
        'spec/overview',
        'spec/examples',
        'spec/file-format',
        'spec/schema-reference',
        'spec/schema-guide',
        {
          type: 'category',
          label: 'v1.0 (Archived)',
          collapsed: true,
          items: [
            'spec/v1.0/overview',
            'spec/v1.0/examples',
            'spec/v1.0/file-format',
            'spec/v1.0/schema-reference',
            'spec/v1.0/schema-guide',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Processes',
      items: [
        'processes/rfc-index',
        'processes/rfc-process',
        'processes/governance',
        'processes/contributing',
      ],
    },
    {
      type: 'category',
      label: 'RFCs',
      items: [
        'rfcs/core-schema',
        'rfcs/yaml-format',
        'rfcs/template-variables',
        'rfcs/multimodal-support',
        'rfcs/workflow-extension',
      ],
    },
    {
      type: 'category',
      label: 'Ecosystem',
      items: [
        'ecosystem/promptkit-runtime',
        'ecosystem/arena-testing',
        'ecosystem/integrations',
        'ecosystem/community-tools',
      ],
    },
    'adopters',
  ],
};

export default sidebars;
