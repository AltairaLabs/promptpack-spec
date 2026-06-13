import React, {useEffect, useRef} from 'react';
import OriginalFooter from '@theme-original/DocItem/Footer';
import type FooterType from '@theme/DocItem/Footer';
import type {WrapperProps} from '@docusaurus/types';
import {useLocation} from '@docusaurus/router';
import {useColorMode} from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import BrowserOnly from '@docusaurus/BrowserOnly';

type Props = WrapperProps<typeof FooterType>;

type GiscusConfig = {
  repo?: string;
  repoId?: string;
  category?: string;
  categoryId?: string;
  mapping?: string;
};

const GISCUS_THEME = (mode: string) => (mode === 'dark' ? 'dark' : 'light');

/**
 * Injects the giscus comment widget (https://giscus.app) via its client script.
 * Script embed is used instead of @giscus/react so the docs site gains no npm
 * dependency (keeps `npm ci` / the lockfile untouched). Backed by GitHub
 * Discussions; one discussion per page (mapping: pathname).
 */
function GiscusComments({cfg, mode}: {cfg: GiscusConfig; mode: string}): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);

  // Inject the giscus script once per mount.
  useEffect(() => {
    const container = ref.current;
    if (!container || container.querySelector('script')) {
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-repo', cfg.repo ?? '');
    script.setAttribute('data-repo-id', cfg.repoId ?? '');
    script.setAttribute('data-category', cfg.category ?? '');
    script.setAttribute('data-category-id', cfg.categoryId ?? '');
    script.setAttribute('data-mapping', cfg.mapping ?? 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', GISCUS_THEME(mode));
    script.setAttribute('data-lang', 'en');
    script.setAttribute('data-loading', 'lazy');
    container.appendChild(script);
  }, [cfg]);

  // Re-theme the existing iframe on light/dark toggle without a reload.
  useEffect(() => {
    const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    iframe?.contentWindow?.postMessage(
      {giscus: {setConfig: {theme: GISCUS_THEME(mode)}}},
      'https://giscus.app',
    );
  }, [mode]);

  return <div ref={ref} className="giscus" style={{marginTop: '3rem'}} />;
}

export default function FooterWrapper(props: Props): React.ReactElement {
  const {pathname} = useLocation();
  const {colorMode} = useColorMode();
  const {siteConfig} = useDocusaurusContext();
  const cfg = (siteConfig.customFields?.giscus ?? {}) as GiscusConfig;

  // Only on individual RFC pages (/docs/rfcs/<slug>), never the index.
  const isRfcPage = /\/docs\/rfcs\/.+/.test(pathname);
  // No-op until the giscus IDs are configured (see SETUP-giscus.md).
  const isConfigured = Boolean(cfg.repoId && cfg.categoryId);

  return (
    <>
      <OriginalFooter {...props} />
      {isRfcPage && isConfigured && (
        <BrowserOnly>{() => <GiscusComments cfg={cfg} mode={colorMode} />}</BrowserOnly>
      )}
    </>
  );
}
