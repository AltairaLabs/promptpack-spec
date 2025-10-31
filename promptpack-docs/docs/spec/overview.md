---
sidebar_position: 1
---

# Specification Overview

PromptPack is a declarative specification for defining conversational AI systems. It provides a structured way to package prompts, tools, workflows, and personas into reusable, testable components.

## Core Concepts

### PromptPack File Structure

Every PromptPack file follows this basic structure:

```yaml
apiVersion: v1
kind: PromptPack
metadata:
  name: my-promptpack
  version: 1.0.0
  description: Description of what this pack does

spec:
  prompts: []     # Prompt definitions
  tools: []       # Tool definitions  
  workflows: []   # Workflow definitions
  personas: []    # Persona definitions
  fragments: []   # Reusable components
```

## Key Entities

### Prompts

Prompts are template-based instructions that define how the AI should behave in specific situations.

```yaml
prompts:
  - name: greeting
    template: "Hello {{user.name}}, how can I help you today?"
    variables:
      - name: user.name
        type: string
        required: true
```

### Tools

Tools define external functions that the AI can call during conversations.

```yaml
tools:
  - name: weather_api
    description: Get current weather for a location
    parameters:
      - name: location
        type: string
        required: true
    endpoint: https://api.weather.com/current
```

### Workflows

Workflows orchestrate multi-step conversations and decision-making processes.

```yaml
workflows:
  - name: customer_support
    steps:
      - prompt: greeting
      - condition: user_intent == "technical"
        then: technical_support_flow
        else: general_support_flow
```

### Personas

Personas define the AI's personality, knowledge, and behavioral constraints.

```yaml
personas:
  - name: technical_expert
    traits:
      personality: professional and detailed
      expertise: software engineering
      tone: helpful but precise
```

### Fragments

Fragments are reusable prompt components that can be included in other prompts.

```yaml
fragments:
  - name: safety_guidelines
    content: |
      Always prioritize user safety and privacy.
      Do not provide harmful or dangerous information.
```

## Entity Relationships

*Prompts can reference Tools, Personas, and Fragments. Workflows orchestrate Prompts and can branch based on conditions.*

*(Relationship diagram coming soon)*

## Validation and Testing

PromptPack files include built-in support for:

- **Schema validation** - Ensure proper structure and required fields
- **Test cases** - Define expected inputs and outputs
- **Version compatibility** - Manage breaking changes across versions

## Runtime Requirements

To execute a PromptPack, runtime systems must support:

1. **Template rendering** - Variable substitution in prompts
2. **Tool execution** - Calling external APIs and functions
3. **Workflow orchestration** - Managing conversation state and flow
4. **Persona application** - Applying personality and behavioral constraints