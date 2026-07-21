import type {ReactNode} from 'react';

import styles from './styles.module.css';

/**
 * AltairaLabs masterbrand strip — a 38px band above the product masthead.
 *
 * The handoff is emphatic about two things:
 *
 *  1. This is the ONLY place antique gold appears on promptpack.org. Below the
 *     bar the site is fully starlight.
 *  2. It is meant to be shared verbatim across every AltairaLabs subsite
 *     (Omnia, PromptKit, PromptArena, …) rather than re-implemented per site.
 *
 * Point 2 is not yet true: Atlas ships as a private package and this repo is
 * public, so there is nowhere shared to import it from. Kept self-contained and
 * dependency-free so it can be lifted out wholesale when that is resolved.
 *
 * Colours are hardcoded rather than tokenised on purpose — the bar is fixed
 * masterbrand ink and does not follow the product's colour mode.
 */

const PRODUCT = 'PromptPack';

export default function FamilyBar(): ReactNode {
  return (
    <div className={styles.bar}>
      <a
        className={styles.brand}
        href="https://altairalabs.ai"
        aria-label="AltairaLabs">
        <svg width="16" height="16" viewBox="0 0 64 64" aria-hidden="true">
          <rect x="3" y="3" width="58" height="58" rx="16" fill="#E3B341" />
          <polygon
            points="32,9 37.5,26.5 55,32 37.5,37.5 32,55 26.5,37.5 9,32 26.5,26.5"
            fill="#0A1322"
          />
        </svg>
        <span className={styles.wordmark}>
          ALTAIRA<span className={styles.wordmarkGold}> LABS</span>
        </span>
      </a>

      <div className={styles.right}>
        {/* Outline dot, matching PromptPack's no-fill mark. Each subsite shows
            its own product here. */}
        <span className={styles.switcher}>
          <span className={styles.switcherDot} />
          {PRODUCT} <span className={styles.switcherCaret}>▾</span>
        </span>
        <a className={styles.link} href="https://altairalabs.ai/products">
          Products
        </a>
        <a className={styles.link} href="https://altairalabs.ai/blog">
          Blog
        </a>
      </div>
    </div>
  );
}
