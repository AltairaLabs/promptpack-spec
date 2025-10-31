---
sidebar_position: 5
---

# Schema Guide

Human-readable guide to PromptPack entities and their properties. For the auto-generated technical reference, see [Schema Reference](./schema-reference.md).

## Root Schema

### PromptPack

The root object of every PromptPack file.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `apiVersion` | string | ✅ | Must be "v1" |
| `kind` | string | ✅ | Must be "PromptPack" |
| `metadata` | [Metadata](#metadata) | ✅ | File metadata |
| `spec` | [Spec](#spec) | ✅ | Specification content |

### Metadata

File metadata and identification.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Unique identifier (lowercase, hyphens only) |
| `version` | string | ✅ | Semantic version (MAJOR.MINOR.PATCH) |
| `description` | string | ❌ | Human-readable description |
| `authors` | string[] | ❌ | Author names or emails |
| `license` | string | ❌ | License identifier (e.g., "MIT", "Apache-2.0") |
| `tags` | string[] | ❌ | Classification tags |
| `created` | string | ❌ | ISO 8601 creation timestamp |
| `updated` | string | ❌ | ISO 8601 last updated timestamp |

### Spec

The main specification content.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prompts` | [Prompt](#prompt)[] | ❌ | Prompt definitions |
| `tools` | [Tool](#tool)[] | ❌ | Tool definitions |
| `workflows` | [Workflow](#workflow)[] | ❌ | Workflow definitions |
| `personas` | [Persona](#persona)[] | ❌ | Persona definitions |
| `fragments` | [Fragment](#fragment)[] | ❌ | Reusable fragments |
| `config` | [Config](#config) | ❌ | Runtime configuration |

## Entity Schemas

### Prompt

Defines a template-based instruction for AI systems.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Unique prompt identifier |
| `template` | string | ✅ | Template with variable placeholders |
| `description` | string | ❌ | Purpose and usage description |
| `variables` | [Variable](#variable)[] | ❌ | Input variable definitions |
| `outputs` | [Output](#output)[] | ❌ | Expected output definitions |
| `examples` | [Example](#example)[] | ❌ | Test cases and examples |
| `metadata` | object | ❌ | Additional key-value metadata |

### Variable

Defines an input variable for prompts or tools.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Variable name (supports dot notation) |
| `type` | string | ✅ | Data type: "string", "number", "boolean", "array", "object" |
| `required` | boolean | ❌ | Whether variable is required (default: false) |
| `default` | any | ❌ | Default value if not provided |
| `description` | string | ❌ | Variable purpose and usage |
| `validation` | [Validation](#validation) | ❌ | Validation rules |

### Tool

Defines an external function or API that can be called.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Unique tool identifier |
| `description` | string | ✅ | What the tool does |
| `parameters` | [Variable](#variable)[] | ❌ | Input parameters |
| `returns` | [ReturnSchema](#returnschema) | ❌ | Return value schema |
| `endpoint` | string | ❌ | API endpoint URL |
| `method` | string | ❌ | HTTP method (GET, POST, PUT, DELETE) |
| `headers` | object | ❌ | HTTP headers |
| `authentication` | [Auth](#auth) | ❌ | Authentication configuration |

### Workflow

Defines a multi-step conversational flow.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Unique workflow identifier |
| `description` | string | ❌ | Workflow purpose |
| `steps` | [Step](#step)[] | ✅ | Ordered execution steps |
| `variables` | [Variable](#variable)[] | ❌ | Workflow-level variables |
| `error_handling` | [ErrorHandling](#errorhandling) | ❌ | Error handling strategy |

### Persona

Defines AI personality and behavioral characteristics.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Unique persona identifier |
| `description` | string | ❌ | Persona description |
| `traits` | [PersonaTraits](#personatraits) | ✅ | Personality characteristics |
| `knowledge` | string[] | ❌ | Areas of expertise |
| `constraints` | string[] | ❌ | Behavioral limitations |
| `examples` | [PersonaExample](#personaexample)[] | ❌ | Example interactions |

### Fragment

Defines reusable content that can be included in prompts.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Unique fragment identifier |
| `content` | string | ✅ | Reusable content template |
| `description` | string | ❌ | Fragment purpose |
| `variables` | [Variable](#variable)[] | ❌ | Fragment-specific variables |

## Supporting Schemas

### Step

A single step in a workflow.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prompt` | string | ❌ | Prompt to execute |
| `tool` | string | ❌ | Tool to call |
| `condition` | string | ❌ | Boolean condition for branching |
| `then` | [Step](#step)[] | ❌ | Steps if condition is true |
| `else` | [Step](#step)[] | ❌ | Steps if condition is false |

### PersonaTraits

Personality characteristics for a persona.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `personality` | string | ❌ | Core personality description |
| `communication_style` | string | ❌ | How the persona communicates |
| `expertise` | string | ❌ | Areas of knowledge |
| `tone` | string | ❌ | Communication tone |

### Validation

Validation rules for variables.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `min_length` | number | ❌ | Minimum string length |
| `max_length` | number | ❌ | Maximum string length |
| `pattern` | string | ❌ | Regular expression pattern |
| `enum` | any[] | ❌ | Allowed values |
| `min` | number | ❌ | Minimum numeric value |
| `max` | number | ❌ | Maximum numeric value |

### Auth

Authentication configuration for tools.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | ✅ | "api_key", "bearer_token", "basic", "oauth2" |
| `key_location` | string | ❌ | "header", "query_parameter" |
| `key_name` | string | ❌ | Header or parameter name |

### ReturnSchema

Schema for tool return values.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | ✅ | Return data type |
| `schema` | object | ❌ | JSON schema for validation |
| `description` | string | ❌ | Return value description |

### Config {#config}

Runtime configuration settings.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | string | ❌ | Default AI model |
| `temperature` | number | ❌ | Generation temperature (0.0-1.0) |
| `max_tokens` | number | ❌ | Maximum output tokens |
| `timeout` | number | ❌ | Request timeout in seconds |
| `retries` | number | ❌ | Number of retry attempts |

### Output {#output}

Expected output specification for prompts.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Output identifier |
| `type` | string | ✅ | Expected data type |
| `description` | string | ❌ | Output description |
| `schema` | object | ❌ | JSON schema for validation |
| `required` | boolean | ❌ | Whether output is required |

### Example {#example}

Test cases and usage examples.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Example identifier |
| `inputs` | object | ✅ | Input variable values |
| `expected_output` | any | ❌ | Expected result |
| `description` | string | ❌ | Example description |

### ErrorHandling {#errorhandling}

Error handling configuration for workflows.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `strategy` | string | ✅ | "fail_fast", "continue", "retry" |
| `max_retries` | number | ❌ | Maximum retry attempts |
| `fallback` | string | ❌ | Fallback prompt or tool |
| `timeout` | number | ❌ | Step timeout in seconds |

### PersonaExample {#personaexample}

Example interactions for personas.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `input` | string | ✅ | User input |
| `output` | string | ✅ | Persona response |
| `context` | object | ❌ | Interaction context |
| `description` | string | ❌ | Example description |

## Data Types

### Supported Types

- **string** - Text data
- **number** - Numeric values (integers and floats)
- **boolean** - True/false values
- **array** - Ordered lists of values
- **object** - Key-value maps

### Template Variables

Variables in templates use double curly braces:

```
{{variable_name}}
```

**Examples:**

- **Dot Notation:** `{{user.profile.name}}`
- **Array Access:** `{{items[0].title}}`  
- **Conditionals:** `{{#if condition}}content{{/if}}`