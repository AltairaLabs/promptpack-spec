# RFC 0003: Template Variable System

- **Status:** Implemented
- **Author(s):** AltairaLabs Team
- **Created:** 2025-10-10
- **Updated:** 2025-10-31
- **Implemented:** 2025-10-31
- **Related Issues:** N/A

## Summary

Define a robust template variable system for PromptPack that supports variable substitution, type validation, default values, and nested data structures using a `{{variable}}` syntax.

## Motivation

Prompts need dynamic content that varies per execution:

- User-provided values (names, IDs, context)
- Environment-specific configuration (company name, region)
- Runtime-computed values (timestamps, session data)

Without a standard variable system:

- **No portability** - Each runtime implements variables differently
- **No validation** - Type errors discovered at runtime
- **No documentation** - Variables lack clear definitions
- **No reusability** - Hard to share prompts with clear interfaces

### Goals

- Define a clear, unambiguous variable syntax
- Support type validation (string, number, boolean, object, array)
- Enable default values and required/optional variables
- Allow nested object access with dot notation
- Provide array indexing support
- Include validation rules (regex, min/max, enum)

### Non-Goals

- Implement conditionals or loops in templates (future RFC)
- Create a full programming language
- Support arbitrary code execution

## Detailed Design

### Variable Syntax

Variables use double curly braces:

```
{{variable_name}}
```

### Variable Definitions

Each variable is defined with metadata:

```json
{
  "variables": [
    {
      "name": "customer_name",
      "type": "string",
      "required": true,
      "description": "Customer's full name",
      "example": "John Doe"
    },
    {
      "name": "priority",
      "type": "string",
      "required": false,
      "default": "medium",
      "validation": {
        "enum": ["low", "medium", "high", "urgent"]
      }
    }
  ]
}
```

### Supported Types

1. **string** - Text data
2. **number** - Numeric values (integers and floats)
3. **boolean** - True/false values
4. **object** - Key-value maps
5. **array** - Ordered lists

### Dot Notation

Access nested object properties:

```
{{user.profile.name}}
{{settings.theme.primaryColor}}
{{account.billing.address.city}}
```

Schema:

```json
{
  "name": "user",
  "type": "object",
  "description": "User object with nested properties"
}
```

### Array Access

Access array elements by index:

```
{{items[0].title}}
{{users[1].email}}
{{tags[2]}}
```

### Validation Rules

Variables can have validation constraints:

```json
{
  "name": "email",
  "type": "string",
  "required": true,
  "validation": {
    "pattern": "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$",
    "min_length": 5,
    "max_length": 100
  }
}
```

Supported validations:

- **pattern** - Regular expression (string)
- **min_length** / **max_length** - String length (string)
- **minimum** / **maximum** - Numeric range (number)
- **enum** - Allowed values (any type)

### Template Engine Configuration

Shared across all prompts in a pack:

```json
{
  "template_engine": {
    "version": "v1",
    "syntax": "{{variable}}",
    "features": ["basic_substitution", "fragments"]
  }
}
```

### Key Design Decisions

#### Mustache-Style Syntax

Use `{{variable}}` instead of `${variable}` or `{variable}`.

**Rationale**: 
- Clear visual distinction from code
- Widely recognized in template systems (Mustache, Handlebars)
- Less collision with programming languages

#### Explicit Variable Definitions

All variables must be declared in the schema.

**Rationale**:
- Enables validation before execution
- Provides clear documentation
- Catches typos and missing variables early

#### Type System

Support common data types with validation.

**Rationale**:
- Prevents type errors at runtime
- Enables better IDE support
- Documents expected input format

## Examples

### Basic Substitution

Template:

```
You are a {{role}} assistant for {{company}}.
```

Variables:

```json
{
  "variables": [
    {"name": "role", "type": "string", "required": true},
    {"name": "company", "type": "string", "required": true}
  ]
}
```

Input:

```json
{
  "role": "customer support",
  "company": "TechCorp"
}
```

Result:

```
You are a customer support assistant for TechCorp.
```

### Nested Objects

Template:

```
Customer: {{customer.name}}
Email: {{customer.contact.email}}
Priority: {{ticket.priority}}
```

Variables:

```json
{
  "variables": [
    {
      "name": "customer",
      "type": "object",
      "required": true,
      "description": "Customer information with nested fields"
    },
    {
      "name": "ticket",
      "type": "object",
      "required": true
    }
  ]
}
```

### Arrays

Template:

```
First item: {{items[0].title}}
Second item: {{items[1].title}}
```

Variables:

```json
{
  "variables": [
    {
      "name": "items",
      "type": "array",
      "required": true,
      "description": "List of items"
    }
  ]
}
```

### Default Values

Template:

```
Priority: {{priority}}
Theme: {{theme}}
```

Variables:

```json
{
  "variables": [
    {
      "name": "priority",
      "type": "string",
      "required": false,
      "default": "medium"
    },
    {
      "name": "theme",
      "type": "string",
      "required": false,
      "default": "light"
    }
  ]
}
```

If no input provided, uses defaults:

```
Priority: medium
Theme: light
```

## Drawbacks

- **Limited logic** - No conditionals or loops (by design)
- **Runtime errors** - Nested access can fail if paths don't exist
- **Learning curve** - Developers need to understand validation rules

## Alternatives

### Alternative 1: Jinja2-Style Syntax

Use `{{ variable }}` (with spaces) and support full Jinja2 features.

**Rejected**: Too complex, introduces programming logic into templates.

### Alternative 2: String Interpolation

Use programming language string interpolation (e.g., Python f-strings).

**Rejected**: Not portable across languages and runtimes.

### Alternative 3: No Validation

Allow variables without type definitions.

**Rejected**: Loses documentation and validation benefits.

## Adoption Strategy

### Backward Compatibility

N/A - Part of initial v1 specification.

### Migration Path

N/A - No previous variable system.

## Unresolved Questions

None - All design decisions finalized.

---

## Revision History

- **2025-10-10:** Initial draft
- **2025-10-20:** Added validation rules
- **2025-10-31:** Finalized and implemented

## References

- [Mustache Template Syntax](https://mustache.github.io/)
- [JSON Schema Validation](https://json-schema.org/understanding-json-schema/reference/string.html)
- [RFC-0001: Core PromptPack Schema](0001-core-schema.md)
