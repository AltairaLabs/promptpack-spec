import type {ReactNode} from 'react';
import React from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: React.ReactElement;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Universal Interoperability',
    Svg: require('@site/static/img/interoperability.svg').default,
    description: (
      <>
        PromptPack enables seamless integration across different conversational AI platforms,
        tools, and frameworks. Share prompts between OpenAI, Anthropic, local models, and more
        with standardized packaging.
      </>
    ),
  },
  {
    title: 'Reusable Components',
    Svg: require('@site/static/img/reusable.svg').default,
    description: (
      <>
        Build once, use everywhere. Package your prompts, tools, and workflows into
        reusable components that can be shared, versioned, and distributed across
        teams and organizations.
      </>
    ),
  },
  {
    title: 'Testable & Reliable',
    Svg: require('@site/static/img/testable.svg').default,
    description: (
      <>
        Define comprehensive test suites for your prompts and conversational flows.
        Ensure reliability with automated testing, performance benchmarks, and
        quality assurance workflows.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
