---
sidebar_position: 2
---

# Getting Started

Ready to transform your conversational AI from scattered prompts into production-ready systems? PromptPacks provide everything you need to package, deploy, and scale sophisticated AI applications.

## What You'll Accomplish

By the end of this guide, you'll understand how to:

- **Package multiple prompts** into a single, deployable unit
- **Share resources** like tools and text fragments across prompts  
- **Deploy consistently** across different environments and platforms
- **Maintain quality** with built-in validation and testing

## Your First PromptPack

Let's start with a simple but complete example that demonstrates the core concepts:

```json
{
  "id": "help-desk",
  "name": "Help Desk Assistant",
  "version": "1.0.0",
  "description": "AI assistant for basic customer support",
  
  "template_engine": {
    "version": "v1",
    "syntax": "{{variable}}"
  },
  
  "prompts": {
    "greeting": {
      "id": "greeting",
      "name": "Customer Greeting",
      "version": "1.0.0",
      "system_template": "You are {{assistant_name}}, a {{role}} for {{company}}.\n\n{{greeting_fragment}}\n\nHow can I help you today?",
      "variables": [
        {
          "name": "assistant_name",
          "type": "string",
          "required": true,
          "example": "Alex"
        },
        {
          "name": "role", 
          "type": "string",
          "required": true,
          "example": "customer support specialist"
        },
        {
          "name": "company",
          "type": "string", 
          "required": true,
          "example": "TechCorp"
        }
      ],
      "tools": ["lookup_customer"],
      "parameters": {
        "temperature": 0.7,
        "max_tokens": 200
      }
    },
    
    "followup": {
      "id": "followup",
      "name": "Follow-up Questions", 
      "version": "1.0.0",
      "system_template": "Continue the conversation with {{customer_name}}.\n\nPrevious context: {{conversation_history}}\n\nProvide helpful follow-up and next steps.",
      "variables": [
        {
          "name": "customer_name",
          "type": "string",
          "required": true
        },
        {
          "name": "conversation_history",
          "type": "string",
          "required": false
        }
      ],
      "tools": ["lookup_customer", "create_ticket"],
      "parameters": {
        "temperature": 0.6,
        "max_tokens": 300
      }
    }
  },
  
  "tools": {
    "lookup_customer": {
      "name": "lookup_customer",
      "description": "Retrieve customer account information",
      "parameters": {
        "type": "object",
        "properties": {
          "customer_id": {
            "type": "string",
            "description": "Customer account ID"
          }
        },
        "required": ["customer_id"]
      }
    },
    
    "create_ticket": {
      "name": "create_ticket",
      "description": "Create support ticket for unresolved issues",
      "parameters": {
        "type": "object",
        "properties": {
          "title": {"type": "string"},
          "description": {"type": "string"},
          "priority": {"type": "string", "enum": ["low", "medium", "high"]}
        },
        "required": ["title", "description"]
      }
    }
  },
  
  "fragments": {
    "greeting_fragment": "Welcome! I'm here to help resolve any questions or issues you might have."
  }
}
```

## What Makes This Powerful

This simple pack demonstrates several key PromptPack benefits:

### 🎯 **Specialized Prompts**

- **Greeting prompt**: Optimized for initial customer contact with welcoming tone
- **Follow-up prompt**: Focused on continuing conversations and resolution

### 🔧 **Shared Tools**

- Both prompts can use `lookup_customer` and `create_ticket`
- Define once, reuse everywhere—no duplication

### 📝 **Reusable Fragments**

- `greeting_fragment` provides consistent messaging across prompts
- Easy to update company-wide messaging in one place

### ⚙️ **Independent Tuning**

- Greeting uses higher temperature (0.7) for friendlier responses
- Follow-up uses lower temperature (0.6) for more focused assistance

## Key Concepts Explained

### Multi-Prompt Architecture

Instead of one generic prompt handling everything, you create **specialized prompts for specific scenarios**:

```json
{
  "prompts": {
    "greeting": { /* optimized for first contact */ },
    "technical": { /* focused on troubleshooting */ },
    "billing": { /* specialized for payment issues */ }
  }
}
```

**Why this works better:**

- Each prompt excels at its specific task
- Easier to test and optimize individual scenarios
- Clearer maintenance and updates

### Shared Resources

Common tools, fragments, and configuration are defined once and shared:

```json
{
  "tools": { /* available to all prompts */ },
  "fragments": { /* reusable text snippets */ },
  "template_engine": { /* consistent processing */ }
}
```

**Benefits:**

- Eliminates duplication and inconsistency
- Updates propagate automatically
- Easier coordination across teams

### Complete Packaging

Everything needed to run your AI system is in one JSON file:

- ✅ All prompt templates and configurations
- ✅ Tool definitions and parameters  
- ✅ Validation rules and safety measures
- ✅ Version information and metadata

**Result:** Deploy once, run anywhere—no missing dependencies or configuration drift.

## Getting Deeper

### 1. **Understanding Structure**

Read the [Pack Structure & Design](/docs/spec/structure) guide to understand how multi-prompt architecture scales to complex systems.

### 2. **Real-World Examples**

Explore [complete business scenarios](/docs/spec/examples) like customer support systems, content marketing suites, and educational assistants.

### 3. **File Format Benefits**

Learn why [JSON format](/docs/spec/file-format) makes PromptPacks portable, testable, and production-ready.

### 4. **Technical Reference**

Use the [Schema Reference](/docs/spec/schema-reference) for complete field definitions and validation rules.

## Start Building

You're now ready to create PromptPacks that transform conversational AI from experimental prototypes into reliable, maintainable business solutions. Start with a simple pack like the example above, then gradually add more prompts, tools, and sophisticated features as your needs grow.
