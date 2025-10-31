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
    {
      type: 'category',
      label: 'Specification',
      items: [
        'spec/overview',
        'spec/examples',
        'spec/file-format',
        'spec/schema-reference',
        'spec/schema-guide',
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
      label: 'Ecosystem',
      items: [
        'ecosystem/promptkit-runtime',
        'ecosystem/arena-testing',
        'ecosystem/community-tools',
      ],
    },
    'adopters',
  ],
};

export default sidebars;
