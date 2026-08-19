---
title: "PromptKit"
sidebar:
  order: 1
---

:::info Status
PromptKit is the open-source reference toolkit for PromptPack — **shipped and actively maintained**. Repo: [github.com/AltairaLabs/PromptKit](https://github.com/AltairaLabs/PromptKit).
:::

PromptKit is the reference toolkit for working with PromptPack specifications. It provides a Go runtime plus npm-distributed CLIs for testing, validating, and compiling packs across providers.

## What's in the box

PromptKit bundles two CLIs and a Go runtime under one repo:

- **`promptarena`** — test, red-team, and evaluate prompts and packs across Claude, OpenAI, Gemini, Azure, and local models.
- **`packc`** — compile a workspace config into a portable, content-addressed `.pack.json` artifact ready for deployment.
- **Go runtime** — load and execute compiled packs, with first-class support for workflows, agent loops, tools, and skills.

```bash
npm install -g @altairalabs/promptarena @altairalabs/packc
```

## promptarena

Multi-provider testing CLI for prompts and packs.

```bash
# Scaffold a project from a template
promptarena init my-project --template iot-maintenance-demo

# Inspect resolved config
promptarena config-inspect

# Run a scenario across providers
promptarena run --scenario scenarios/hardware-faults.scenario.yaml

# Red-team / self-play scenarios
promptarena run --scenario scenarios/redteam-selfplay.scenario.yaml

# Launch the local results viewer
promptarena view
```

**Features:**

- Side-by-side comparison across Claude, OpenAI, Gemini, Azure OpenAI, and local models
- Multi-turn scenarios and self-play simulations
- Multimodal content support (images, audio, video)
- Red-team scenario authoring
- Reports in HTML, JSON, JUnit, and Markdown
- CI/CD integration via the [`promptarena-action`](https://github.com/AltairaLabs/PromptKit/.github/actions/promptarena-action) GitHub Action

See the [PromptArena documentation](./arena-testing) for the full guide.

## packc

Compile workspace config into a portable, deployable pack artifact.

```bash
packc compile -c config.arena.yaml -o app.pack.json
```

Output is a content-addressed `.pack.json` that any PromptPack runtime can load — the same artifact runs locally, in CI, and in production. A [`packc-action`](https://github.com/AltairaLabs/PromptKit/.github/actions/packc-action) GitHub Action publishes compiled packs from CI.

## CI/CD Integration

PromptKit ships GitHub Actions for both CLIs:

```yaml
- uses: AltairaLabs/PromptKit/.github/actions/promptarena-action@v1
  with:
    scenario: scenarios/regression.scenario.yaml
```

```yaml
- uses: AltairaLabs/PromptKit/.github/actions/packc-action@v1
  with:
    config: config.arena.yaml
    output: dist/app.pack.json
```

See the [GitHub Actions docs](https://promptkit.altairalabs.ai/devops/) for full usage.

## Get Involved

- **Repository**: [github.com/AltairaLabs/PromptKit](https://github.com/AltairaLabs/PromptKit)
- **Issues**: [GitHub Issues](https://github.com/AltairaLabs/PromptKit/issues)
- **Discussions**: [GitHub Discussions](https://github.com/AltairaLabs/PromptKit/discussions)
- **Quality**: [SonarCloud dashboard](https://sonarcloud.io/summary/new_code?id=AltairaLabs_PromptKit)

## Contributing

We welcome contributions. Areas where you can help:

- **Alternative runtimes** — implementations in other languages
- **Provider integrations** — adapters for additional model providers
- **Eval types** — new built-in eval kinds for the spec
- **Documentation** — examples, tutorials, and integration guides

See our [Contributing Guide](/docs/processes/contributing) to get started.

---

**Note:** PromptKit is the reference implementation. The PromptPack specification is open — anyone can build compatible tools and runtimes. See [Community Tools](./community-tools) for other implementations.
