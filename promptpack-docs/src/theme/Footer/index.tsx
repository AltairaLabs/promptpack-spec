import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {useThemeConfig} from '@docusaurus/theme-common';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import useSpecVersion from '@site/src/hooks/useSpecVersion';

import styles from './styles.module.css';

/**
 * Footer, rebuilt to the Atlas handoff: a brand column beside the configured
 * link columns, then a mono legal row.
 *
 * Link columns still come from themeConfig.footer.links so the config stays
 * the single source of truth — the design's three columns are whatever is
 * configured, plus the brand block.
 */

type FooterLink = {
  label: string;
  to?: string;
  href?: string;
};

type FooterColumn = {
  title?: string;
  items: FooterLink[];
};

function FooterItem({item}: {item: FooterLink}): ReactNode {
  const toUrl = useBaseUrl(item.to);
  return (
    <Link
      className={styles.link}
      {...(item.href ? {href: item.href} : {to: toUrl})}>
      {item.label}
    </Link>
  );
}

export default function Footer(): ReactNode {
  const {footer} = useThemeConfig();
  const specVersion = useSpecVersion();
  const {siteConfig} = useDocusaurusContext();
  const logoUrl = useBaseUrl('img/logo.svg');
  const logoDarkUrl = useBaseUrl('img/logo-dark.svg');

  if (!footer) {
    return null;
  }

  const columns = (footer.links ?? []) as FooterColumn[];

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.brandCol}>
          <div className={styles.brand}>
            <img
              className={styles.markLight}
              src={logoUrl}
              alt=""
              width={26}
              height={26}
            />
            <img
              className={styles.markDark}
              src={logoDarkUrl}
              alt=""
              width={26}
              height={26}
            />
            <span className={styles.brandName}>{siteConfig.title}</span>
          </div>
          <p className={styles.brandBlurb}>
            An open specification for packaging, testing, and running AI agent
            behavior.
          </p>
          {/* The AltairaLabs masterbrand tagline. Per
              planning/strategy/site-heroes.md it rides on every property, but
              on promptpack.org the footer only — the .org keeps a neutral,
              open-standard register above the fold. */}
          <p className={styles.tagline}>
            Own the agent layer. The model is the easy part.
          </p>
        </div>

        {columns.map((column, i) => (
          <div key={column.title ?? i}>
            <div className={styles.colTitle}>{column.title}</div>
            <div className={styles.colLinks}>
              {column.items.map((item) => (
                <FooterItem item={item} key={item.label} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.legal}>
        <span className={styles.legalText}>
          PromptPack is an open specification by AltairaLabs · Spec CC-BY-4.0 ·
          code &amp; reference implementations MIT
        </span>
        <span className={styles.legalVersion}>{specVersion} · stable</span>
      </div>
    </footer>
  );
}
