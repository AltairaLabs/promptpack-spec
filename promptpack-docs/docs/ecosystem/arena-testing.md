---
sidebar_position: 2
---

# Arena Testing

:::info Status
✅ **Available Now** - PromptArena is actively being used for LLM testing
:::

## Overview

**PromptArena** (`promptarena`) is a CLI tool for running multi-turn conversation simulations across multiple LLM providers, validating conversation flows, and generating comprehensive test reports.

Arena enables systematic testing of conversational AI systems with support for:

- **Multi-Provider Testing** - Run the same tests across OpenAI, Anthropic, Google, and more
- **Multi-Turn Conversations** - Test complex conversation flows and state management
- **Self-Play Mode** - Simulate realistic user interactions with configurable roles
- **Multimodal Testing** - Test with images, audio, and video content
- **Comprehensive Reporting** - HTML, JSON, JUnit XML, and Markdown reports
- **Mock Testing** - Fast, cost-free testing with mock providers
- **CI/CD Integration** - Built for automated testing pipelines

## Installation

PromptArena is available as part of the PromptKit toolkit. See the [PromptKit repository](https://github.com/AltairaLabs/PromptKit) for installation instructions.

## Quick Start

### Basic Usage

```bash
# Run all tests with default configuration
promptarena run

# Specify configuration file
promptarena run --config my-arena.yaml

# Run specific providers only
promptarena run --provider openai,anthropic

# Run specific scenarios
promptarena run --scenario basic-qa,edge-cases
```

### Configuration File

Create an `arena.yaml` configuration file:

```yaml
apiVersion: promptkit.altairalabs.ai/v1alpha1
kind: Arena
metadata:
  name: my-arena
spec:
  prompt_configs:
    - id: assistant
      file: prompts/assistant.yaml

  providers:
    - file: providers/openai.yaml
    - file: providers/anthropic.yaml

  scenarios:
    - file: scenarios/test.yaml

  defaults:
    output:
      dir: out
      formats: ["json", "html"]
```

## Key Features

### Multi-Provider Testing

Test the same scenarios across multiple LLM providers:

```bash
# Compare OpenAI, Anthropic, and Gemini
promptarena run --provider openai,anthropic,gemini --format html
```

Supported providers include:
- OpenAI (GPT-4, GPT-3.5, etc.)
- Anthropic (Claude 3 Opus, Sonnet, Haiku)
- Google (Gemini Pro)
- Azure OpenAI
- And more

### Multi-Turn Conversations

Define complex conversation flows in scenario files:

```yaml
apiVersion: promptkit.altairalabs.ai/v1alpha1
kind: Scenario
metadata:
  name: customer-support
spec:
  task_type: support
  turns:
    - role: user
      parts:
        - type: text
          text: "I need help with my account"
    - role: assistant
      # Expected assistant response
    - role: user
      parts:
        - type: text
          text: "Can you reset my password?"
```

### Multimodal Content

Test with images, audio, and video:

```yaml
turns:
  - role: user
    parts:
      - type: text
        text: "What's in this image?"
      - type: image
        media:
          file_path: test-data/sample.jpg
          detail: high
```

Supported media types:
- Images: JPEG, PNG, GIF, WebP
- Audio: MP3, WAV, OGG, M4A
- Video: MP4, WebM, MOV

### Self-Play Mode

Simulate realistic conversations with configurable roles:

```bash
# Enable self-play testing
promptarena run --selfplay

# Self-play with specific roles
promptarena run --selfplay --roles frustrated-customer,tech-support
```

### Mock Testing

Fast, cost-free testing during development:

```bash
# Use mock provider instead of real APIs
promptarena run --mock-provider

# Use custom mock configuration
promptarena run --mock-config mock-responses.yaml
```

## Output Formats

Arena generates comprehensive reports in multiple formats:

### HTML Reports

Interactive HTML reports with:
- Side-by-side provider comparison
- Response times and token usage
- Cost analysis
- Media content visualization
- Test assertions pass/fail status

```bash
promptarena run --format html
open out/report-[timestamp].html
```

### JUnit XML

Standard JUnit XML for CI/CD integration:

```bash
promptarena run --format junit --junit-file out/junit.xml
```

Properties include:
- `media.images.total` - Count of images tested
- `media.loaded.success` - Successfully loaded media
- `media.loaded.errors` - Failed media loads
- Test pass/fail status

### JSON Reports

Machine-readable JSON for programmatic analysis:

```bash
promptarena run --format json
```

### Markdown Reports

Human-readable markdown summaries:

```bash
promptarena run --format markdown --markdown-file out/results.md
```

## Test Assertions

Arena supports multiple assertion types:

### Text Assertions

```yaml
assertions:
  - type: content_includes
    patterns: ["expected text", "another phrase"]
  
  - type: content_excludes
    patterns: ["unwanted text"]
```

### Media Assertions

Validate media outputs from generative models:

```yaml
# Image validation
assertions:
  - type: image_format
    params:
      formats: [png, jpeg]
  
  - type: image_dimensions
    params:
      width: 1920
      height: 1080

# Audio validation
assertions:
  - type: audio_format
    params:
      formats: [mp3, wav]
  
  - type: audio_duration
    params:
      min_seconds: 29
      max_seconds: 31

# Video validation
assertions:
  - type: video_resolution
    params:
      presets: [4k, uhd]
  
  - type: video_duration
    params:
      min_seconds: 59
      max_seconds: 61
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/arena-tests.yml
name: Arena Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Arena Tests
        run: promptarena run --ci --format junit
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          
      - name: Publish Test Results
        uses: dorny/test-reporter@v1
        if: always()
        with:
          name: Arena Test Results
          path: out/junit.xml
          reporter: java-junit
```

### CI Mode

Run in headless mode optimized for CI pipelines:

```bash
# Headless mode for CI pipelines
promptarena run --ci --format junit,json
```

Exit codes:
- `0` - Success, all tests passed
- `1` - Failure, one or more tests failed

## Commands

### `promptarena run`

Run conversation simulations across multiple LLM providers.

**Flags:**
- `-c, --config` - Configuration file path (default: `arena.yaml`)
- `-j, --concurrency` - Number of concurrent workers (default: `6`)
- `--provider` - Providers to use (comma-separated)
- `--scenario` - Scenarios to run (comma-separated)
- `--temperature` - Override temperature for all scenarios
- `--max-tokens` - Override max tokens for all scenarios
- `--selfplay` - Enable self-play mode
- `--mock-provider` - Replace all providers with MockProvider
- `-o, --out` - Output directory (default: `out`)
- `--format` - Output formats: `json`, `junit`, `html`, `markdown`
- `-v, --verbose` - Enable verbose debug logging

### `promptarena config-inspect`

Inspect and validate arena configuration:

```bash
# Inspect default configuration
promptarena config-inspect

# Verbose output with details
promptarena config-inspect --verbose

# JSON output for programmatic use
promptarena config-inspect --format json
```

### `promptarena prompt-debug`

Test prompt generation with specific contexts:

```bash
# Test prompt generation for task type
promptarena prompt-debug --task-type support

# Test with region
promptarena prompt-debug --task-type support --region us

# Test with scenario file
promptarena prompt-debug --scenario scenarios/customer-support.yaml
```

### `promptarena render`

Generate HTML report from existing test results:

```bash
# Render from default location
promptarena render out/index.json

# Custom output path
promptarena render out/index.json --output custom-report.html
```

## Best Practices

### Performance

```bash
# Increase concurrency for faster execution
promptarena run --concurrency 10

# Reduce concurrency for stability
promptarena run --concurrency 1
```

### Cost Control

```bash
# Use mock provider during development
promptarena run --mock-provider

# Test with cheaper models first
promptarena run --provider gpt-3.5-turbo
```

### Reproducibility

```bash
# Always use same seed for consistent results
promptarena run --seed 42
```

### Debugging

```bash
# Always start with config validation
promptarena config-inspect --verbose

# Use verbose mode to see API calls
promptarena run --verbose --scenario problematic-test

# Test prompt generation separately
promptarena prompt-debug --scenario scenarios/test.yaml
```

## Learn More

- **Complete CLI Reference:** [Arena User Guide](https://github.com/AltairaLabs/PromptKit/blob/main/docs/guides/arena-user-guide.md)
- **Configuration Reference:** [Config Documentation](https://github.com/AltairaLabs/PromptKit/blob/main/docs/promptarena/config-reference.md)
- **Getting Started:** [First Project Walkthrough](https://github.com/AltairaLabs/PromptKit/blob/main/docs/promptarena/getting-started.md)
- **CI/CD Integration:** [Pipeline Setup Guide](https://github.com/AltairaLabs/PromptKit/blob/main/docs/promptarena/ci-cd-integration.md)
- **GitHub Repository:** [AltairaLabs/PromptKit](https://github.com/AltairaLabs/PromptKit)

## Support

For questions, issues, or feature requests:
- **Issues:** [GitHub Issues](https://github.com/AltairaLabs/PromptKit/issues)
- **Discussions:** [GitHub Discussions](https://github.com/AltairaLabs/PromptKit/discussions)
