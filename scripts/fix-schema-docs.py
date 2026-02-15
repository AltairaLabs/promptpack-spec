#!/usr/bin/env python3
"""Post-process generated schema-reference.md for Docusaurus MDX compatibility.

Fixes two classes of issues that json-schema-for-humans output creates:
1. Unescaped {{variable}} patterns outside code blocks that MDX interprets as JSX
2. Orphaned [](#...additionalProperties) links with no corresponding heading target
"""

import re
import sys


def fix_mdx_curly_braces(content: str) -> str:
    """Wrap bare {{...}} patterns in inline backticks when outside code fences."""
    lines = content.split("\n")
    result = []
    in_code_block = False

    for line in lines:
        if line.strip().startswith("```"):
            in_code_block = not in_code_block
            result.append(line)
            continue

        if not in_code_block:
            # Replace {{word}} NOT already inside backticks with `{{word}}`
            # Negative lookbehind/ahead for backtick
            line = re.sub(
                r"(?<!`)(\{\{[\w]+\}\})(?!`)",
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


def main():
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <path-to-schema-reference.md>")
        sys.exit(1)

    filepath = sys.argv[1]
    with open(filepath, "r") as f:
        content = f.read()

    content = fix_mdx_curly_braces(content)
    content = fix_orphaned_additional_properties_links(content)

    with open(filepath, "w") as f:
        f.write(content)

    print(f"Post-processed {filepath} for MDX compatibility")


if __name__ == "__main__":
    main()
