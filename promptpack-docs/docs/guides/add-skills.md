---
sidebar_position: 3
title: "How to Add Skills"
---

# How to Add Skills

Add progressive-disclosure knowledge loading to an existing PromptPack so that agents can access domain expertise on demand without bloating system templates.

## Prerequisites

- A PromptPack (v1.3.1 schema)
- Understanding of [Pack Structure](/docs/spec/structure)
- Knowledge you want to make available to agents beyond what's in system templates

## Step 1: Identify Your Knowledge Sources

Skills represent modular knowledge units. Look at your existing prompts and identify:

1. **What domain expertise do agents need?** → These become skill sources.
2. **Is the knowledge small enough to inline?** → Use `InlineSkill`.
3. **Is the knowledge in external files?** → Use string paths or `SkillPathSource`.
4. **Should any knowledge load eagerly?** → Set `preload: true`.

For example, if you have billing and technical support prompts:

```
skills/
├── billing/         → billing policies, refund rules, account procedures
├── technical/       → troubleshooting guides, diagnostic procedures
└── compliance/      → regulatory requirements (preload for all states)
```

## Step 2: Add the Top-Level Skills Array

Add a `skills` array to your pack root. Each entry is one of three forms:

### String Paths (Simplest)

```json
{
  "skills": [
    "./skills/billing",
    "./skills/technical"
  ]
}
```

### Path Objects (With Preload)

```json
{
  "skills": [
    { "path": "./skills/compliance", "preload": true },
    { "path": "./skills/billing" }
  ]
}
```

Use `preload: true` for knowledge that should be available immediately (e.g., compliance rules that apply to all interactions).

### Inline Skills (Small, Pack-Specific)

```json
{
  "skills": [
    {
      "name": "escalation-protocol",
      "description": "Steps for escalating unresolved customer issues",
      "instructions": "When a customer issue cannot be resolved within 3 exchanges:\n1. Acknowledge the complexity\n2. Collect all relevant case details\n3. Create an escalation ticket with priority based on customer tier\n4. Provide the ticket reference number to the customer"
    }
  ]
}
```

Inline skills are best for small, self-contained knowledge that doesn't warrant a separate file.

## Step 3: Mix Skill Sources (Optional)

You can combine all three forms in one array:

```json
{
  "skills": [
    "./skills/general",
    { "path": "./skills/compliance", "preload": true },
    {
      "name": "escalation-protocol",
      "description": "Steps for escalating unresolved issues",
      "instructions": "When an issue cannot be resolved:\n1. Collect details\n2. Create ticket\n3. Set follow-up expectations"
    }
  ]
}
```

## Step 4: Scope Skills Per Workflow State (Optional)

If your pack uses a workflow, you can filter which skills are available in each state:

```json
{
  "workflow": {
    "version": 1,
    "entry": "triage",
    "states": {
      "triage": {
        "prompt_task": "triage",
        "on_event": { "billing": "billing_state", "technical": "tech_state" }
      },
      "billing_state": {
        "prompt_task": "billing",
        "on_event": { "resolved": "closing" },
        "skills": "./skills/billing"
      },
      "tech_state": {
        "prompt_task": "technical",
        "on_event": { "resolved": "closing" },
        "skills": "./skills/technical"
      },
      "closing": {
        "prompt_task": "closing",
        "on_event": {},
        "skills": "none"
      }
    }
  }
}
```

- **Omit `skills`** → all pack-level skills are available
- **Set a path** → only skills from that path are available
- **Set `"none"`** → no skills are available in that state

## Complete Example

### Before: Skills Embedded in Templates

```json
{
  "id": "customer-support",
  "version": "1.3.0",
  "prompts": {
    "billing": {
      "id": "billing",
      "name": "Billing Support",
      "version": "1.0.0",
      "system_template": "You are a billing specialist.\n\nRefund Policy:\n- Full refunds within 30 days\n- Partial refunds within 90 days\n- No refunds after 90 days\n\nEscalation Protocol:\n- Collect case details...\n\n[50 more lines of embedded knowledge]"
    }
  }
}
```

### After: Skills for Progressive Loading

```json
{
  "id": "customer-support",
  "version": "1.3.1",
  "skills": [
    "./skills/billing",
    { "path": "./skills/compliance", "preload": true },
    {
      "name": "escalation-protocol",
      "description": "Steps for escalating unresolved issues",
      "instructions": "When an issue cannot be resolved within 3 exchanges:\n1. Acknowledge the complexity\n2. Collect case details\n3. Create escalation ticket\n4. Provide ticket reference"
    }
  ],
  "prompts": {
    "billing": {
      "id": "billing",
      "name": "Billing Support",
      "version": "1.1.0",
      "system_template": "You are a billing specialist.\n\nUse your available skills for refund policies, compliance rules, and escalation procedures."
    }
  }
}
```

## Validation Checklist

After adding skills, verify:

- [ ] Pack validates against the v1.3.1 schema
- [ ] All file paths point to existing directories/files (if using path-based skills)
- [ ] Inline skills have all three required fields: `name`, `description`, `instructions`
- [ ] `SkillPathSource` objects have a `path` field
- [ ] Workflow state `skills` values are either valid paths or `"none"`
- [ ] Existing prompts still work without changes (backward compatible)

## Common Mistakes

### Putting runtime logic in skills

Skills are knowledge, not code. They should contain instructions and expertise, not executable logic.

**Wrong:**
```json
{
  "name": "billing-handler",
  "instructions": "if (customer.tier === 'premium') { applyDiscount(20) }"
}
```

**Right:**
```json
{
  "name": "billing-policy",
  "instructions": "For premium customers, apply a 20% discount on service fees."
}
```

### Using skills for static text substitution

If you just need text inserted into a template at compile time, use fragments instead.

**Use fragments for:** Company intro, disclaimers, boilerplate text
**Use skills for:** Domain expertise, procedures, behavioral instructions loaded at runtime

### Forgetting to scope skills in workflows

Without a `skills` field on a workflow state, all pack-level skills are available. This may provide more context than needed. Scope skills to keep agent focus narrow:

```json
"billing_state": {
  "prompt_task": "billing",
  "on_event": { "resolved": "closing" },
  "skills": "./skills/billing"
}
```

## Next Steps

- [Architecture Patterns](/docs/spec/architecture-patterns) — how skills relate to other features
- [Schema Guide](/docs/spec/schema-guide) — detailed field documentation
- [Real-World Examples](/docs/spec/examples) — complete pack with skills
- [RFC-0008: Skills Extension](/docs/rfcs/skills-extension) — design rationale
