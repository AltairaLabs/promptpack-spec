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
    title: 'Stop Building the Same Prompts Over and Over',
    Svg: require('@site/static/img/reusable.svg').default,
    description: (
      <>
        Package your customer support, sales, and technical prompts into a single deployable unit.
        Share proven AI solutions across teams, projects, and organizations. 
        <strong> Build once, deploy everywhere.</strong>
      </>
    ),
  },
  {
    title: 'Deploy AI Systems, Not Just Prompts',
    Svg: require('@site/static/img/interoperability.svg').default,
    description: (
      <>
        Everything your AI needs in one JSON file: specialized prompts, external tools, 
        safety guardrails, and shared resources. No more hunting for scattered configurations.
        <strong> One file = Complete AI system.</strong>
      </>
    ),
  },
  {
    title: 'Know Your AI Works Before You Deploy',
    Svg: require('@site/static/img/testable.svg').default,
    description: (
      <>
        Built-in testing shows which models work best, expected costs, and success rates.
        Deploy with confidence knowing your AI performs reliably.
        <strong> No more "works on my machine" surprises.</strong>
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
