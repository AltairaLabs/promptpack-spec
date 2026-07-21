---
sidebar_position: 4
---

# Schema Reference

Complete field-by-field reference for all PromptPack entities and their properties.

## Root Schema

### PromptPack

The root object of every PromptPack file.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `apiVersion` | string | Yes | Must be "v1" |
| `kind` | string | Yes | Must be "PromptPack" |
| `metadata` | [Metadata](#metadata) | Yes | File metadata |
| `spec` | [Spec](#spec) | Yes | Specification content |

### Metadata

File metadata and identification.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Unique identifier (lowercase, hyphens only) |
| `version` | string | Yes | Semantic version (MAJOR.MINOR.PATCH) |
| `description` | string | No | Human-readable description |
| `authors` | string[] | No | Author names or emails |
| `license` | string | No | License identifier (e.g., "MIT", "Apache-2.0") |
| `tags` | string[] | No | Classification tags |
| `created` | string | No | ISO 8601 creation timestamp |
| `updated` | string | No | ISO 8601 last updated timestamp |

### Spec

The main specification content.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prompts` | [Prompt](#prompt)[] | No | Prompt definitions |
| `tools` | [Tool](#tool)[] | No | Tool definitions |
| `workflows` | [Workflow](#workflow)[] | No | Workflow definitions |
| `personas` | [Persona](#persona)[] | No | Persona definitions |
| `fragments` | [Fragment](#fragment)[] | No | Reusable fragments |
| `config` | [Config](#config) | No | Runtime configuration |

## Entity Schemas

### Prompt

Defines a template-based instruction for AI systems.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Unique prompt identifier |
| `template` | string | Yes | Template with variable placeholders |
| `description` | string | No | Purpose and usage description |
| `variables` | [Variable](#variable)[] | No | Input variable definitions |
| `outputs` | [Output](#output)[] | No | Expected output definitions |
| `examples` | [Example](#example)[] | No | Test cases and examples |
| `metadata` | object | No | Additional key-value metadata |

### Variable

Defines an input variable for prompts or tools.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Variable name (supports dot notation) |
| `type` | string | Yes | Data type: "string", "number", "boolean", "array", "object" |
| `required` | boolean | No | Whether variable is required (default: false) |
| `default` | any | No | Default value if not provided |
| `description` | string | No | Variable purpose and usage |
| `validation` | [Validation](#validation) | No | Validation rules |

### Tool

Defines an external function or API that can be called.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Unique tool identifier |
| `description` | string | Yes | What the tool does |
| `parameters` | [Variable](#variable)[] | No | Input parameters |
| `returns` | [ReturnSchema](#returnschema) | No | Return value schema |
| `endpoint` | string | No | API endpoint URL |
| `method` | string | No | HTTP method (GET, POST, PUT, DELETE) |
| `headers` | object | No | HTTP headers |
| `authentication` | [Auth](#auth) | No | Authentication configuration |

### Workflow

Defines a multi-step conversational flow.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Unique workflow identifier |
| `description` | string | No | Workflow purpose |
| `steps` | [Step](#step)[] | Yes | Ordered execution steps |
| `variables` | [Variable](#variable)[] | No | Workflow-level variables |
| `error_handling` | [ErrorHandling](#errorhandling) | No | Error handling strategy |

### Persona

Defines AI personality and behavioral characteristics.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Unique persona identifier |
| `description` | string | No | Persona description |
| `traits` | [PersonaTraits](#personatraits) | Yes | Personality characteristics |
| `knowledge` | string[] | No | Areas of expertise |
| `constraints` | string[] | No | Behavioral limitations |
| `examples` | [PersonaExample](#personaexample)[] | No | Example interactions |

### Fragment

Defines reusable content that can be included in prompts.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Unique fragment identifier |
| `content` | string | Yes | Reusable content template |
| `description` | string | No | Fragment purpose |
| `variables` | [Variable](#variable)[] | No | Fragment-specific variables |

## Supporting Schemas

### Step

A single step in a workflow.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prompt` | string | No | Prompt to execute |
| `tool` | string | No | Tool to call |
| `condition` | string | No | Boolean condition for branching |
| `then` | [Step](#step)[] | No | Steps if condition is true |
| `else` | [Step](#step)[] | No | Steps if condition is false |

### PersonaTraits

Personality characteristics for a persona.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `personality` | string | No | Core personality description |
| `communication_style` | string | No | How the persona communicates |
| `expertise` | string | No | Areas of knowledge |
| `tone` | string | No | Communication tone |

### Validation

Validation rules for variables.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `min_length` | number | No | Minimum string length |
| `max_length` | number | No | Maximum string length |
| `pattern` | string | No | Regular expression pattern |
| `enum` | any[] | No | Allowed values |
| `min` | number | No | Minimum numeric value |
| `max` | number | No | Maximum numeric value |

### Auth

Authentication configuration for tools.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | "api_key", "bearer_token", "basic", "oauth2" |
| `key_location` | string | No | "header", "query_parameter" |
| `key_name` | string | No | Header or parameter name |

### ReturnSchema

Schema for tool return values.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | Return data type |
| `schema` | object | No | JSON schema for validation |
| `description` | string | No | Return value description |

### Config {#config}

Runtime configuration settings.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | string | No | Default AI model |
| `temperature` | number | No | Generation temperature (0.0-1.0) |
| `max_tokens` | number | No | Maximum output tokens |
| `timeout` | number | No | Request timeout in seconds |
| `retries` | number | No | Number of retry attempts |

### Output {#output}

Expected output specification for prompts.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Output identifier |
| `type` | string | Yes | Expected data type |
| `description` | string | No | Output description |
| `schema` | object | No | JSON schema for validation |
| `required` | boolean | No | Whether output is required |

### Example {#example}

Test cases and usage examples.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Example identifier |
| `inputs` | object | Yes | Input variable values |
| `expected_output` | any | No | Expected result |
| `description` | string | No | Example description |

### ErrorHandling {#errorhandling}

Error handling configuration for workflows.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `strategy` | string | Yes | "fail_fast", "continue", "retry" |
| `max_retries` | number | No | Maximum retry attempts |
| `fallback` | string | No | Fallback prompt or tool |
| `timeout` | number | No | Step timeout in seconds |

### PersonaExample {#personaexample}

Example interactions for personas.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `input` | string | Yes | User input |
| `output` | string | Yes | Persona response |
| `context` | object | No | Interaction context |
| `description` | string | No | Example description |

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