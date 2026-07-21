import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import useSpecVersion from '@site/src/hooks/useSpecVersion';
import Layout from '@theme/Layout';

import styles from './index.module.css';

/**
 * Homepage, rebuilt from the Atlas design handoff (bundle since removed).
 *
 * The prototype carried its own masthead, AltairaLabs family bar, standards
 * strip and footer. Those are site chrome and live in the Navbar/Footer
 * swizzles; everything between them lives here.
 */

const MANIFEST_ROWS: [string, string, boolean][] = [
  ['id · name · version', 'identity & semver', false],
  ['template_engine', 'variable syntax', false],
  ['tools', 'define once, reuse', false],
  ['fragments', 'shared text blocks', false],
  ['prompts', 'specialized, per scenario', false],
  ['evals', 'quality checks travel along', false],
  ['workflow · agents', 'orchestration', true],
  ['skills · requires', 'knowledge & providers', true],
];

function Hero() {
  return (
    <section className={styles.section}>
      <div className={clsx(styles.container, styles.hero)}>
        <div className={styles.heroAtmosphere} aria-hidden="true" />
        <div>
          {/* The four-verb journey spine, per planning/strategy/site-heroes.md:
              every property shows the spine and highlights its own stage. */}
          <div className={styles.eyebrow}>
            where every agent starts:&nbsp;
            <span className={styles.eyebrowNum}>define</span>
            &nbsp;→ prove → run → operate
          </div>
          <h1 className={styles.heroTitle}>
            One open spec to define, package, and{' '}
            <span className={styles.heroAccent}>ship&nbsp;an&nbsp;agent.</span>
          </h1>
          <p className={styles.heroSub}>
            PromptPack is the declarative format for a production agent — the
            models it requires, its prompts, tools, workflows, guardrails, and
            the quality checks it must pass — in a single portable, versioned
            artifact. Author once, run it on any PromptPack-compatible runtime.
          </p>
          <div className={styles.heroMeta}>
            <span>one file</span>
            <span className={styles.heroMetaSep}>·</span>
            <span>every provider</span>
            <span className={styles.heroMetaSep}>·</span>
            <span>versioned</span>
            <span className={styles.heroMetaSep}>·</span>
            <span>open</span>
          </div>
          <div className={styles.heroActions}>
            <Link className={styles.btnPrimary} to="/docs/spec/overview">
              Read the spec
            </Link>
            <Link className={styles.btnGhost} to="/docs/spec/examples">
              See an example
            </Link>
            <Link
              className={styles.btnBare}
              to="https://github.com/altairalabs/promptpack-spec">
              git clone ↗
            </Link>
          </div>
        </div>

        <div className={styles.manifest}>
          <div className={styles.manifestCard}>
            <div className={styles.manifestBar}>
              <span className={styles.manifestFile}>
                customer-support.promptpack.json
              </span>
              <span className={styles.manifestPill}>1 file</span>
            </div>
            <div className={styles.manifestBody}>
              <div className={styles.manifestComment}>
                // everything the agent needs, declared once
              </div>
              {MANIFEST_ROWS.map(([key, note, muted]) => (
                <div className={styles.manifestRow} key={key}>
                  <span
                    className={muted ? styles.manifestKeyMuted : styles.manifestKey}>
                    {key}
                  </span>
                  <span className={styles.manifestNote}>{note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroVideoSection() {
  return (
    <section className={clsx(styles.section, styles.videoSection)}>
      <div className={styles.container}>
        <div className={styles.eyebrow}>the format in motion</div>
        <div className={styles.videoFrame}>
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/img/hero.jpg">
            <source src="/img/hero.webm" type="video/webm" />
            <source src="/img/hero.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}

function ProblemSolution() {
  return (
    <section className={clsx(styles.section, styles.band)}>
      <div className={clsx(styles.container, styles.split)}>
        <div className={styles.splitLeft}>
          <div className={styles.eyebrow}>§ 01 — the problem</div>
          <h2 className={styles.splitTitle}>AI agent development is fragmented.</h2>
          <p className={styles.splitBody}>
            Each framework has its own format for prompts, tools, workflows, and
            test scenarios. When you change frameworks or providers, you rebuild
            from scratch.
          </p>
          <p className={styles.splitBody}>
            Agent logic — now critical business logic — lacks engineering
            discipline.
          </p>
        </div>
        <div className={styles.splitRight}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowNum}>§ 02</span>&nbsp;— the solution
          </div>
          <h2 className={styles.splitTitle}>A vendor-neutral JSON format.</h2>
          <p className={styles.splitBody}>
            PromptPack packages AI agent behavior into one portable file:
          </p>
          <ul className={styles.checkList}>
            <li>Framework-agnostic prompt definitions</li>
            <li>Reusable tool specifications</li>
            <li>Workflow and agent-loop orchestration</li>
            <li>Version-controlled agent logic</li>
            <li>Works with any runtime or provider</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

const ANNOTATIONS: [string, string, string][] = [
  [
    '01',
    'id · name · version',
    'Identity and semantic version — required, alongside template_engine and prompts.',
  ],
  ['02', 'tools', 'External functions defined once, referenced by any prompt.'],
  [
    '03',
    'fragments',
    'Reusable text blocks interpolated into templates for consistency.',
  ],
  [
    '04',
    'prompts',
    'Specialized, templated system prompts with typed variables and tool bindings.',
  ],
  [
    '05',
    'evals',
    'Automated quality checks with Prometheus metrics — shipped alongside the prompts.',
  ],
];

function Anatomy() {
  const specVersion = useSpecVersion();

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowNum}>§ 03</span>&nbsp;— anatomy of a
            promptpack
          </div>
          <h2 className={styles.sectionTitle}>One file describes the whole agent.</h2>
          <p className={styles.sectionLead}>
            A promptpack is plain JSON validated against a published schema. A
            valid pack needs only identity, a template engine and one prompt —
            everything beyond that is optional, so you can grow into full
            multi-agent orchestration without changing format.
          </p>
        </div>

        <div className={styles.anatomyGrid}>
          <div className={styles.codeCard}>
            <div className={styles.codeBar}>
              <span className={styles.codeDot} />
              <span className={styles.manifestFile}>
                customer-support.promptpack.json
              </span>
              <span className={styles.codeValid}>
                validated · schema {specVersion}
              </span>
            </div>
            {/* Hand-coloured rather than Prism: the design calls for a muted
                key/value read, not full syntax highlighting. */}
            <pre className={styles.code}>
              <span className={styles.punc}>{'{'}</span>
              {'\n  '}
              <span className={styles.punc}>"</span>
              <span className={styles.keyMinor}>$schema</span>
              <span className={styles.punc}>": "</span>
              <span className={styles.strDim}>
                https://promptpack.org/schema/latest/…
              </span>
              <span className={styles.punc}>",</span>
              {'\n  '}
              <span className={styles.key}>"id"</span>
              <span className={styles.punc}>: "</span>
              <span className={styles.str}>customer-support</span>
              <span className={styles.punc}>",</span>
              {'\n  '}
              <span className={styles.key}>"name"</span>
              <span className={styles.punc}>: "</span>
              <span className={styles.str}>Customer Support Pack</span>
              <span className={styles.punc}>",</span>
              {'\n  '}
              <span className={styles.key}>"version"</span>
              <span className={styles.punc}>: "</span>
              <span className={styles.str}>1.0.0</span>
              <span className={styles.punc}>",</span>
              {'\n  '}
              <span className={styles.key}>"template_engine"</span>
              <span className={styles.punc}>: {'{ "'}</span>
              <span className={styles.keyMinor}>syntax</span>
              <span className={styles.punc}>": "</span>
              <span className={styles.str}>{'{{variable}}'}</span>
              <span className={styles.punc}>" {'}'},</span>
              {'\n  '}
              <span className={styles.key}>"tools"</span>
              <span className={styles.punc}>: {'{'}</span>
              {'\n    '}
              <span className={styles.punc}>"</span>
              <span className={styles.keyMinor}>lookup_order</span>
              <span className={styles.punc}>": {'{ "type": "'}</span>
              <span className={styles.str}>function</span>
              <span className={styles.punc}>" {'}'}</span>
              {'\n  '}
              <span className={styles.punc}>{'},'}</span>
              {'\n  '}
              <span className={styles.key}>"fragments"</span>
              <span className={styles.punc}>: {'{'}</span>
              {'\n    '}
              <span className={styles.punc}>"</span>
              <span className={styles.keyMinor}>brand_voice</span>
              <span className={styles.punc}>": "</span>
              <span className={styles.str}>Friendly, professional tone.</span>
              <span className={styles.punc}>"</span>
              {'\n  '}
              <span className={styles.punc}>{'},'}</span>
              {'\n  '}
              <span className={styles.key}>"prompts"</span>
              <span className={styles.punc}>: {'{'}</span>
              {'\n    '}
              <span className={styles.punc}>"</span>
              <span className={styles.keyMinor}>support</span>
              <span className={styles.punc}>": {'{'}</span>
              {'\n      '}
              <span className={styles.punc}>"system_template": "</span>
              <span className={styles.str}>You are a {'{{role}}'}. </span>
              <span className={styles.str}>{'{{fragments.brand_voice}}'}</span>
              <span className={styles.punc}>",</span>
              {'\n      '}
              <span className={styles.punc}>"tools": ["</span>
              <span className={styles.str}>lookup_order</span>
              <span className={styles.punc}>"]</span>
              {'\n    '}
              <span className={styles.punc}>{'}'}</span>
              {'\n  '}
              <span className={styles.punc}>{'},'}</span>
              {'\n  '}
              <span className={styles.key}>"evals"</span>
              <span className={styles.punc}>: [</span>
              {'\n    '}
              <span className={styles.punc}>{'{ "id": "'}</span>
              <span className={styles.str}>tone-check</span>
              <span className={styles.punc}>", "type": "</span>
              <span className={styles.str}>llm_judge</span>
              <span className={styles.punc}>" {'}'}</span>
              {'\n  '}
              <span className={styles.punc}>]</span>
              {'\n'}
              <span className={styles.punc}>{'}'}</span>
            </pre>
          </div>

          <div className={styles.annList}>
            {ANNOTATIONS.map(([num, field, body]) => (
              <div className={styles.ann} key={num}>
                <span className={styles.annNum}>{num}</span>
                <div>
                  <div className={styles.annField}>{field}</div>
                  <div className={styles.annBody}>{body}</div>
                </div>
              </div>
            ))}
            <div className={clsx(styles.ann, styles.annMore)}>
              <span className={styles.annNum}>+</span>
              <div>
                <div className={styles.annBody}>
                  Add <span className={styles.annCode}>workflow</span>,{' '}
                  <span className={styles.annCode}>agents</span>,{' '}
                  <span className={styles.annCode}>skills</span> and{' '}
                  <span className={styles.annCode}>requires</span> as the pack
                  grows.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const CAPABILITIES: [string, string, string][] = [
  ['Agent Loops', 'v1.4', 'Terminal states, retry budgets, replayable artifacts.'],
  [
    'Workflows & Multi-Agent',
    'v1.3',
    'State-machine orchestration with A2A definitions.',
  ],
  [
    'Multi-Prompt Architecture',
    'core',
    'Specialized prompts per scenario or workflow stage.',
  ],
  [
    'Tool Integration',
    'core',
    'Define tools once, reference them across all prompts.',
  ],
  ['Evals & Guardrails', 'v1.2', 'Quality policy and safety travel with the pack.'],
  [
    'Provider Requirements',
    'v1.5.1',
    'Declare needed providers for coverage and parity.',
  ],
];

function Capabilities() {
  const specVersion = useSpecVersion();

  return (
    <section className={clsx(styles.section, styles.band)}>
      <div className={styles.container}>
        <div className={styles.capsHead}>
          <div className={styles.capsHeadText}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowNum}>§ 04</span>&nbsp;— capabilities
            </div>
            <h2 className={styles.sectionTitle}>
              New capabilities arrive as optional sections.
            </h2>
          </div>
          <div className={styles.capsVersions}>
            spec versions
            <br />
            <span className={styles.capsVersionsValue}>v1.0 → {specVersion}</span>
          </div>
        </div>
        <div className={styles.capsGrid}>
          {CAPABILITIES.map(([title, version, body]) => (
            <div className={styles.cap} key={title}>
              <div className={styles.capTop}>
                <span className={styles.capDot} />
                <span className={styles.capVersion}>{version}</span>
              </div>
              <div className={styles.capTitle}>{title}</div>
              <div className={styles.capBody}>{body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const VALUES: [string, string, string][] = [
  [
    '01 / reuse',
    'Stop building the same agents over and over.',
    'Package prompts, tools, workflows, and agent loops into one deployable unit. Share proven behavior across teams and organizations.',
  ],
  [
    '02 / package',
    'Deploy agents, not just prompts.',
    'Specialized prompts, external tools, workflow state machines, and guardrails — all in one file. No more scattered configuration.',
  ],
  [
    '03 / verify',
    'Know your agent works before you deploy.',
    'Built-in evals and testing metadata show which models perform best and how reliably — no "works on my machine" surprises.',
  ],
];

function ValueProps() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.valueGrid}>
          {VALUES.map(([num, title, body]) => (
            <div className={styles.value} key={num}>
              <div className={styles.valueNum}>{num}</div>
              <h3 className={styles.valueTitle}>{title}</h3>
              <p className={styles.valueBody}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * The real product marks from the Atlas logo set, not generic swatches.
 *
 * PromptPack's mark is outline-only, so it needs the light/dark pair the
 * navbar already uses. The three commercial marks are self-contained tiles
 * (dark ink ground + coloured glyph) and read correctly on either ramp, so
 * they ship as a single file each.
 *
 * Altaira's own mark is deliberately absent: the constellation shows the
 * products, and gold belongs to the masterbrand bar alone.
 */
type FamilyMember = {
  name: string;
  role: string;
  mark: string;
  markDark?: string;
  /** Canonical product site. Omitted for PromptPack — this is that site. */
  href?: string;
  active?: boolean;
};

const FAMILY: FamilyMember[] = [
  {
    name: 'PromptPack',
    role: 'the spec',
    mark: 'img/logo.svg',
    markDark: 'img/logo-dark.svg',
    active: true,
  },
  {
    name: 'PromptKit',
    role: 'the runtime',
    mark: 'img/atlas/logos/logo-promptkit.svg',
    href: 'https://promptkit.altairalabs.ai/',
  },
  {
    name: 'PromptArena',
    role: 'the studio',
    mark: 'img/atlas/logos/logo-promptarena.svg',
    href: 'https://promptarena.altairalabs.ai/',
  },
  {
    name: 'Omnia',
    role: 'the platform',
    mark: 'img/atlas/logos/logo-omnia.svg',
    href: 'https://omnia.altairalabs.ai/',
  },
];

function FamilyMark({member}: {member: FamilyMember}): ReactNode {
  const src = useBaseUrl(member.mark);
  const srcDark = useBaseUrl(member.markDark ?? member.mark);

  if (!member.markDark) {
    return <img className={styles.familyMark} src={src} alt="" width={28} height={28} />;
  }

  return (
    <>
      <img
        className={clsx(styles.familyMark, styles.markLight)}
        src={src}
        alt=""
        width={28}
        height={28}
      />
      <img
        className={clsx(styles.familyMark, styles.markDark)}
        src={srcDark}
        alt=""
        width={28}
        height={28}
      />
    </>
  );
}

function Constellation() {
  return (
    <section className={clsx(styles.section, styles.band)}>
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <div className={styles.eyebrow}>§ 05 — the constellation</div>
          <h2 className={styles.sectionTitle}>
            The open spec at the base of the family.
          </h2>
          <p className={styles.sectionLead}>
            PromptPack is neutral by design — the community standard everything
            else builds on. The commercial products in the AltairaLabs
            constellation each add their own layer on top of the same file.
          </p>
        </div>
        <div className={styles.familyGrid}>
          {FAMILY.map((member) => {
            const body = (
              <>
                <FamilyMark member={member} />
                <div className={styles.familyName}>{member.name}</div>
                <div className={styles.familyRole}>{member.role}</div>
                {member.active && (
                  <div className={styles.familyHere}>you are here</div>
                )}
              </>
            );
            const className = clsx(
              styles.family,
              member.active && styles.familyActive,
              member.href && styles.familyLink,
            );

            // PromptPack has no href — linking a "you are here" card to the
            // page you are on is a dead end.
            return member.href ? (
              <Link className={className} href={member.href} key={member.name}>
                {body}
              </Link>
            ) : (
              <div className={className} key={member.name}>
                {body}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - Open Specification for AI Agents`}
      description="PromptPack is the open specification for packaging, testing, and running AI agent behavior — from multi-prompt routers to autonomous agent loops. Framework-agnostic, portable, and production-ready.">
      <div className={styles.page}>
        <main>
          <Hero />
          <HeroVideoSection />
          <ProblemSolution />
          <Anatomy />
          <Capabilities />
          <ValueProps />
          <Constellation />
        </main>
      </div>
    </Layout>
  );
}
