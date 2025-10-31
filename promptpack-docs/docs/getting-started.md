---
sidebar_position: 2
---

# Getting Started

Welcome to PromptPack! This guide will help you understand and start using the PromptPack specification.

## Quick Overview

PromptPack files use YAML format and typically have a `.promptpack.yml` extension. They define conversational AI systems through five main entities:

- **Prompts** - Template-based instructions for AI models
- **Tools** - External functions the AI can call
- **Workflows** - Multi-step conversation flows  
- **Personas** - AI personality and behavior definitions
- **Fragments** - Reusable prompt components

## Basic Example

Here's a simple PromptPack file:

```yaml
apiVersion: v1
kind: PromptPack
metadata:
  name: simple-assistant
  version: 1.0.0
  description: A basic assistant for answering questions

spec:
  prompts:
    - name: main
      template: |
        You are a helpful assistant named {{persona.name}}.
        Answer this question: {{user_question}}
      variables:
        - name: user_question
          type: string
          required: true

  personas:
    - name: default
      traits:
        name: Alex
        personality: friendly and knowledgeable
```

## Next Steps

1. **Learn the Structure** - Read the [specification overview](/docs/spec/overview)
2. **See More Examples** - Check out [detailed examples](/docs/spec/examples)  
3. **Reference Guide** - Use the [schema reference](/docs/spec/schema-reference)
4. **Try the Runtime** - Use [PromptKit](/docs/ecosystem/promptkit-runtime) to run PromptPacks