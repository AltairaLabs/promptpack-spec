import type {ReactNode} from 'react';
import Content from '@theme-original/DocSidebar/Desktop/Content';
import type ContentType from '@theme/DocSidebar/Desktop/Content';
import type {WrapperProps} from '@docusaurus/types';

import useSpecVersion from '@site/src/hooks/useSpecVersion';

import styles from './styles.module.css';

type Props = WrapperProps<typeof ContentType>;

/**
 * Wrapper swizzle: the docs shell's sidebar header — a "Specification" label
 * and the current spec version — sits above the nav tree, per the docs
 * prototype (Atlas design handoff, bundle since removed).
 *
 * The version is read from the schema at build time (useSpecVersion), so this
 * cannot drift on a version bump.
 *
 * Rendered as a static pill rather than the prototype's dropdown: archived
 * versions already have their own sidebar categories, so a second version
 * switcher here would be a competing navigation for the same thing.
 */
export default function ContentWrapper(props: Props): ReactNode {
  const specVersion = useSpecVersion();

  return (
    <>
      <div className={styles.header}>
        <span className={styles.label}>Specification</span>
        <span className={styles.version}>{specVersion}</span>
      </div>
      <Content {...props} />
    </>
  );
}
