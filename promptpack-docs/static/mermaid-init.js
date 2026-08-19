import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';

function getThemeConfig() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  // Atlas palette. Accent = ion cyan (PromptArena's lead accent); text rides
  // the star ramp. Bright cyan on the night sky, deepened cyan on the light
  // chart so it stays legible.
  const accent = isDark ? '#67E8F9' : '#0E7490';
  const textColor = isDark ? '#E6EDF8' : '#1E2C44';

  return {
    startOnLoad: false,
    look: 'handDrawn',
    theme: 'base',
    themeVariables: {
      // No fills - transparent backgrounds
      primaryColor: 'transparent',
      secondaryColor: 'transparent',
      tertiaryColor: 'transparent',
      // Borders in Atlas ion-cyan
      primaryBorderColor: accent,
      secondaryBorderColor: accent,
      tertiaryBorderColor: accent,
      // Text colors - match current mode (star ramp)
      primaryTextColor: textColor,
      secondaryTextColor: textColor,
      tertiaryTextColor: textColor,
      // Lines and edges in ion-cyan
      lineColor: accent,
      // Edge labels - cyan text, no background
      edgeLabelBackground: 'transparent',
      labelBackground: 'transparent',
      labelTextColor: accent,
      // Background
      background: 'transparent',
      mainBkg: 'transparent',
      nodeBkg: 'transparent',
      // Git graph specific
      git0: accent,
      git1: accent,
      gitBranchLabel0: accent,
      gitBranchLabel1: accent,
      commitLabelBackground: 'transparent',
      // Fonts
      fontFamily: "'Space Grotesk', system-ui, -apple-system, sans-serif",
    },
  };
}

mermaid.initialize(getThemeConfig());

async function renderMermaid() {
  // Starlight uses expressive-code which wraps code in a complex structure
  // Find all pre elements with data-language="mermaid" that haven't been processed yet
  const mermaidBlocks = document.querySelectorAll('pre[data-language="mermaid"]:not([data-mermaid-processed])');

  for (const pre of mermaidBlocks) {
    // Mark as processed immediately to prevent duplicate processing
    pre.setAttribute('data-mermaid-processed', 'true');
    // Extract text content from all the span elements inside
    // The structure is: pre > code > div.ec-line > div.code > span
    const lines = pre.querySelectorAll('.ec-line');
    let content = '';

    if (lines.length > 0) {
      // Expressive-code structure
      lines.forEach(line => {
        const codeDiv = line.querySelector('.code');
        if (codeDiv) {
          content += codeDiv.textContent + '\n';
        }
      });
    } else {
      // Fallback to simple structure
      const code = pre.querySelector('code');
      content = code ? code.textContent : pre.textContent;
    }

    content = content.trim();
    if (!content) continue;

    // Create mermaid container
    const div = document.createElement('div');
    div.className = 'mermaid';
    div.textContent = content;

    // Find the outermost wrapper
    const figure = pre.closest('figure.frame');
    const wrapper = figure ? figure.closest('.expressive-code') : null;
    const targetElement = wrapper || figure || pre;

    // Create a wrapper div to maintain proper block-level spacing
    const containerDiv = document.createElement('div');
    containerDiv.className = 'mermaid-container';
    containerDiv.style.cssText = 'display: block; margin: 1rem 0;';
    containerDiv.appendChild(div);

    // Hide the original element instead of removing it to preserve DOM/CSS structure
    // This prevents breaking CSS selectors that depend on sibling relationships
    targetElement.style.display = 'none';
    targetElement.setAttribute('data-mermaid-hidden', 'true');

    // Insert the mermaid diagram after the hidden element
    targetElement.parentNode.insertBefore(containerDiv, targetElement.nextSibling);
  }

  // Run mermaid if we found any diagrams
  const diagrams = document.querySelectorAll('.mermaid');
  if (diagrams.length > 0) {
    try {
      await mermaid.run();
    } catch (e) {
      console.error('Mermaid rendering error:', e);
    }
  }
}

// Run on initial load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderMermaid);
} else {
  renderMermaid();
}

// Re-run on Astro view transitions
document.addEventListener('astro:page-load', renderMermaid);

// Re-render when theme changes
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.attributeName === 'data-theme') {
      mermaid.initialize(getThemeConfig());
      renderMermaid();
    }
  }
});
observer.observe(document.documentElement, { attributes: true });
