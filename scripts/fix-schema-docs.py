#!/usr/bin/env python3
"""Post-process generated schema-reference.md for the docs site.

Fixes three classes of issue that json-schema-for-humans output creates:
1. Missing frontmatter — the generator emits none, and Astro's content
   collection rejects an entry without a title
2. Unescaped {{variable}} patterns outside code blocks that MDX interprets as JSX
3. Orphaned [](#...additionalProperties) links with no corresponding heading target
"""

import re
import sys


def fix_mdx_curly_braces(content: str) -> str:
    """Wrap brace expressions in inline backticks when outside code fences.

    MDX treats a bare ``{...}`` as a JSX expression. Schema descriptions contain
    two flavours that must be shown literally, not evaluated:
    - ``{{variable}}`` template placeholders, and
    - ``${stepId.output.X}`` composition reference bindings (RFC 0010) — these can
      even contain angle brackets (``${<parallelStepId>.output.<into>}``) which make
      MDX's acorn parser fail outright.
    Both are wrapped in inline backticks so Docusaurus renders them as code.
    """
    lines = content.split("\n")
    result = []
    in_code_block = False

    for line in lines:
        if line.strip().startswith("```"):
            in_code_block = not in_code_block
            result.append(line)
            continue

        if not in_code_block:
            # Replace ${...} reference bindings NOT already inside backticks.
            line = re.sub(
                r"(?<!`)(\$\{[^}]*\})(?!`)",
                r"`\1`",
                line,
            )
            # Replace {{word}} or {{namespace.word}} NOT already inside backticks.
            line = re.sub(
                r"(?<!`)(\{\{[\w.]+\}\})(?!`)",
                r"`\1`",
                line,
            )

        result.append(line)

    return "\n".join(result)


def fix_orphaned_additional_properties_links(content: str) -> str:
    """Remove link markup from [](#...additionalProperties) entries with no heading target."""
    # Find all heading anchors defined in the file
    heading_anchors = set(re.findall(r"\{#([\w]+)\}", content))

    # Find orphaned additionalProperties links and replace with plain text
    def replace_if_orphaned(match):
        anchor = match.group(1)
        if anchor not in heading_anchors:
            return "- additionalProperties"
        return match.group(0)

    return re.sub(
        r"\[]\(#([\w]+_additionalProperties)\s*\)",
        replace_if_orphaned,
        content,
    )


TITLE = "PromptPack Specification"


def ensure_frontmatter(content: str) -> str:
    """Add the frontmatter Astro requires, if the generator did not.

    json-schema-for-humans emits a bare `# Heading` document. Astro's content
    collection requires a title, so a regeneration without this silently
    strips the frontmatter a previous pass added and the site stops building.

    That is not hypothetical: the Generate Schema Docs workflow did exactly
    that on 2026-08-31, and the failure surfaced on an unrelated PR rather
    than on the commit that caused it.
    """
    if content.startswith("---\n"):
        return content
    return f'---\ntitle: "{TITLE}"\n---\n\n' + content


def main():
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <path-to-schema-reference.md>")
        sys.exit(1)

    filepath = sys.argv[1]
    with open(filepath, "r") as f:
        content = f.read()

    content = ensure_frontmatter(content)
    content = fix_mdx_curly_braces(content)
    content = fix_orphaned_additional_properties_links(content)

    with open(filepath, "w") as f:
        f.write(content)

    print(f"Post-processed {filepath} for MDX compatibility")


if __name__ == "__main__":
    main()
