import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

/**
 * The current spec version, e.g. "v1.5.1".
 *
 * Derived from schema/promptpack.schema.json at build time (see
 * docusaurus.config.ts). Use this anywhere the site displays the spec version
 * — never hardcode it, or it goes stale on the next bump with nothing to catch
 * it: version-check only compares the schema against the README.
 */
export default function useSpecVersion(): string {
  const {siteConfig} = useDocusaurusContext();
  return `v${siteConfig.customFields?.specVersion as string}`;
}
