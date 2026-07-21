import type {ReactNode} from 'react';
import Navbar from '@theme-original/Navbar';
import type NavbarType from '@theme/Navbar';
import type {WrapperProps} from '@docusaurus/types';
import {useLocation} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';

import FamilyBar from '@site/src/components/FamilyBar';
import StandardsStrip from '@site/src/components/StandardsStrip';

type Props = WrapperProps<typeof NavbarType>;

/**
 * Wrapper swizzle assembling the head of every page, in design order:
 * family bar → standards strip → masthead.
 *
 * The strip has to live here rather than on the homepage: page content begins
 * below the masthead, so a strip rendered from the page would sit under it.
 * Per the handoff it belongs to the marketing home only — the docs shell goes
 * straight from family bar to masthead.
 *
 * Only the masthead is sticky; the bars above it scroll away.
 */
export default function NavbarWrapper(props: Props): ReactNode {
  const {pathname} = useLocation();
  const home = useBaseUrl('/');
  const isHome = pathname === home;

  return (
    <>
      <FamilyBar />
      {isHome && <StandardsStrip />}
      <Navbar {...props} />
    </>
  );
}
