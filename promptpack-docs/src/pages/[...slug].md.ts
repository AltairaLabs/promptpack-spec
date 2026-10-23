import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Raw Markdown for every docs page, at the page URL with `.md` appended
 * (/docs/spec/overview/ -> /docs/spec/overview.md, /docs/ -> /docs.md).
 *
 * starlight-page-actions' Copy Markdown button fetches exactly that URL, but
 * its own copier only reads src/content/docs/ and this site's collection lives
 * in ./docs (see src/content.config.ts), so the files are emitted here instead.
 */
export const getStaticPaths = (async () => {
  const entries = await getCollection('docs');
  return entries.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ entry: CollectionEntry<'docs'> }> = ({ props }) => {
  const { title, description } = props.entry.data;
  const parts = [`# ${title}`];
  if (description) parts.push(`> ${description}`);
  parts.push((props.entry.body ?? '').trim());
  return new Response(parts.join('\n\n') + '\n', {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
