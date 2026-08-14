import {useCallback, useEffect, useRef, useState} from 'react';
import type {ReactNode} from 'react';
import clsx from 'clsx';

import styles from './styles.module.css';

/**
 * AltairaLabs masterbrand strip — a 38px band above the product masthead,
 * carrying the working product switcher.
 *
 * Modelled on the shipped implementation at promptarena.altairalabs.ai
 * (its `.fb-menu`), so the bar behaves identically across subsites: panel
 * geometry, the 7px square product dots, the in-house / community grouping
 * and the "all products" footer row all match.
 *
 * The handoff wants this shared verbatim across every AltairaLabs site rather
 * than re-implemented per site. It is not shared yet — Atlas is a private
 * package and this repo is public — so it stays self-contained and
 * dependency-free, ready to be lifted out when that is resolved.
 *
 * Colours are hardcoded rather than tokenised on purpose: the bar is fixed
 * masterbrand ink and does not follow the product's colour mode.
 */

type Product = {
  name: string;
  /** Rendered in muted mono on the right of the row. */
  role: string;
  href: string;
  /** 7px square swatch. Outline rather than filled for the open spec. */
  accent: string;
  outline?: boolean;
  /** This site. Renders as the current row and is not a link. */
  current?: boolean;
};

const IN_HOUSE: Product[] = [
  {
    name: 'Omnia',
    role: 'Platform',
    href: 'https://omnia.altairalabs.ai/',
    accent: '#93C5FD',
  },
  {
    name: 'PromptKit',
    role: 'Runtime',
    href: 'https://promptkit.altairalabs.ai/',
    accent: '#C4B5FD',
  },
  {
    name: 'PromptArena',
    role: 'Studio',
    href: 'https://promptarena.altairalabs.ai/',
    accent: '#67E8F9',
  },
  {
    // codegen.altairalabs.ai is NXDOMAIN; codegen-sandbox is the live host.
    // The Omnia/PromptArena/PromptKit switchers had the dead one and are fixed.
    name: 'CodeGen',
    role: 'Codegen',
    href: 'https://codegen-sandbox.altairalabs.ai/',
    accent: '#7DD3A8',
  },
];

const COMMUNITY: Product[] = [
  {
    name: 'PromptPack',
    role: 'Spec',
    href: 'https://promptpack.org/',
    accent: '#93C5FD',
    outline: true,
    current: true,
  },
];

const PRODUCT_NAME = 'PromptPack';

function StarTile({size = 16}: {size?: number}): ReactNode {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect x="3" y="3" width="58" height="58" rx="16" fill="#E3B341" />
      <polygon
        points="32,9 37.5,26.5 55,32 37.5,37.5 32,55 26.5,37.5 9,32 26.5,26.5"
        fill="#0A1322"
      />
    </svg>
  );
}

function Dot({product}: {product: Product}): ReactNode {
  return (
    <span
      className={styles.dot}
      style={
        product.outline
          ? {borderColor: product.accent}
          : {background: product.accent, borderColor: 'transparent'}
      }
    />
  );
}

function Row({product}: {product: Product}): ReactNode {
  const body = (
    <>
      <Dot product={product} />
      <span className={styles.rowName}>
        {product.name}
        {product.name === 'PromptPack' && <span className={styles.rowOrg}>.org</span>}
      </span>
      <span className={styles.rowRole}>{product.role}</span>
    </>
  );

  if (product.current) {
    return (
      <span className={clsx(styles.row, styles.rowCurrent)} aria-current="page">
        {body}
      </span>
    );
  }

  return (
    <a className={styles.row} href={product.href}>
      {body}
    </a>
  );
}

export default function FamilyBar(): ReactNode {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const onPointerDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        close();
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, close]);

  return (
    <div className={styles.bar}>
      <a className={styles.brand} href="https://altairalabs.ai/" aria-label="AltairaLabs">
        <StarTile />
        <span className={styles.wordmark}>
          ALTAIRA<span className={styles.wordmarkGold}> LABS</span>
        </span>
      </a>

      <div className={styles.right}>
        <div className={styles.switcherWrap} ref={wrapRef}>
          <button
            className={styles.switcher}
            type="button"
            ref={buttonRef}
            aria-expanded={open}
            aria-haspopup="true"
            aria-label={`Switch product — currently ${PRODUCT_NAME}`}
            onClick={() => setOpen((v) => !v)}>
            <span
              className={styles.dot}
              style={{borderColor: '#93C5FD'}}
              aria-hidden="true"
            />
            {PRODUCT_NAME}
            <span className={styles.caret} aria-hidden="true">
              ▾
            </span>
          </button>

          {open && (
            <div className={styles.menu}>
              <div className={styles.menuHead}>
                <div className={styles.menuTitle}>Switch product</div>
              </div>

              <div className={styles.group}>
                In-house <span className={styles.groupNote}>· built &amp; maintained by AltairaLabs</span>
              </div>
              {IN_HOUSE.map((p) => (
                <Row product={p} key={p.name} />
              ))}

              <div className={styles.group}>
                Community <span className={styles.groupNote}>· open governance</span>
              </div>
              {COMMUNITY.map((p) => (
                <Row product={p} key={p.name} />
              ))}

              <a className={styles.menuFoot} href="https://altairalabs.ai/">
                <StarTile size={13} />
                All products at altairalabs.ai
              </a>
            </div>
          )}
        </div>

        <a className={styles.link} href="/docs/spec/overview">
          Docs
        </a>
        <a className={styles.link} href="https://altairalabs.ai/blog">
          Blog
        </a>
      </div>
    </div>
  );
}
