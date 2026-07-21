import type {ReactNode} from 'react';

import useSpecVersion from '@site/src/hooks/useSpecVersion';

import styles from './styles.module.css';

/**
 * The standards strip: licence, current draft and status, in mono.
 *
 * Sits between the AltairaLabs family bar and the product masthead, so it is
 * rendered from the Navbar swizzle rather than from the page — page content
 * starts below the masthead and could not reach this slot.
 *
 * The handoff shows it on the marketing home only; the docs shell goes
 * straight from family bar to masthead.
 */

export default function StandardsStrip(): ReactNode {
  const specVersion = useSpecVersion();

  return (
    <div className={styles.strip}>
      <div className={styles.inner}>
        <span className={styles.open}>● open specification</span>
        <span className={styles.sep}>·</span>
        <span>spec cc-by-4.0</span>
        <span className={styles.sep}>·</span>
        <span>code mit</span>
        <span className={styles.sep}>·</span>
        <span>current draft {specVersion}</span>
        <span className={styles.sep}>·</span>
        <span>status: stable</span>
        <span className={styles.from}>an open standard from altairalabs</span>
      </div>
    </div>
  );
}
