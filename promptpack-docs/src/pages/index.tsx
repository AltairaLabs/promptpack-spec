import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          An Open Specification for Prompt Engineering
        </Heading>
        <p className="hero__subtitle">
          Define, test, and manage conversational AI systems in a framework-agnostic format—portable across any provider or runtime.
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/spec/overview">
            Read the Spec
          </Link>
          <Link
            className="button button--outline button--lg"
            to="/docs/spec/examples"
            style={{marginLeft: '1rem'}}>
            View Examples
          </Link>
        </div>
      </div>
    </header>
  );
}

function ProblemSolutionSection() {
  return (
    <section className={styles.problemSolution}>
      <div className="container">
        <div className="row">
          <div className="col col--4">
            <Heading as="h3">The Problem</Heading>
            <p>
              AI prompt development is fragmented. Each framework has its own format for prompts, tools, 
              multi-turn conversations, and test scenarios.
            </p>
            <p>
              When you need to change frameworks or providers, you rebuild from scratch. 
              Prompt logic—now critical business logic—lacks engineering discipline.
            </p>
          </div>
          <div className="col col--4">
            <Heading as="h3">The Solution</Heading>
            <p>
              PromptPack provides a <strong>vendor-neutral JSON format</strong> for packaging conversational AI systems:
            </p>
            <ul>
              <li>Framework-agnostic prompt definitions</li>
              <li>Reusable tool specifications</li>
              <li>Multi-turn scenario testing</li>
              <li>Version-controlled prompt logic</li>
              <li>Works with ANY runtime or provider</li>
            </ul>
          </div>
          <div className="col col--4">
            <Heading as="h3">Key Capabilities</Heading>
            <ul>
              <li><strong>Multi-Prompt Architecture</strong>: Specialized prompts for different scenarios</li>
              <li><strong>Complete Packaging</strong>: Everything in one portable JSON file</li>
              <li><strong>Tool Integration</strong>: Define tools once, use across all prompts</li>
              <li><strong>Built-in Testing</strong>: Test metadata and validation built in</li>
              <li><strong>Template System</strong>: Variables, fragments, and reusable components</li>
              <li><strong>Multimodal Support</strong>: Text, images, audio, and video (v1.1)</li>
            </ul>
          </div>
        </div>
        <div className="row" style={{marginTop: '2rem', textAlign: 'center'}}>
          <div className="col">
            <Link
              className="button button--primary button--lg"
              to="/docs/why-promptpack">
              Learn Why PromptPack Matters →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - Open Specification for Conversational AI`}
      description="PromptPack is the open specification for packaging, testing, and running multi-prompt conversational systems. Framework-agnostic, portable, and production-ready.">
      <HomepageHeader />
      <main>
        <ProblemSolutionSection />
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
