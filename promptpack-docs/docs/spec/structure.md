---
sidebar_position: 2
---

# Pack Structure & Design

Understanding how PromptPacks are structured helps you design better conversational AI systems. The JSON-based format isn't just about data storage—it's architected to support real-world AI development patterns and deployment needs.

## The Multi-Prompt Architecture

The defining characteristic of PromptPacks is that **each pack contains multiple specialized prompts** rather than trying to fit everything into one generic prompt.

### Why Multiple Prompts?

**Better Performance**: Specialized prompts outperform generic ones. A prompt optimized for technical support will handle troubleshooting better than a generic "customer service" prompt trying to do everything.

**Easier Maintenance**: When you need to improve sales conversations, you modify just the sales prompt without affecting support or technical prompts.

**Independent Evolution**: Each prompt can have its own version, testing results, and optimization path while sharing common infrastructure.

**Clear Separation of Concerns**: Different prompts can use different tools, have different safety rules, and target different LLM parameters.

### Pack Organization

```json
{
  "id": "customer-support",
  "name": "Customer Support Pack",
  "version": "1.0.0",
  
  "prompts": {
    "support": { /* optimized for general support */ },
    "sales": { /* tuned for sales conversations */ },
    "technical": { /* focused on troubleshooting */ },
    "billing": { /* handles payment issues */ }
  }
}
```

Each prompt operates independently but shares the pack's common resources.

## Shared Resources Architecture

PromptPacks eliminate duplication through shared resources that all prompts can use:

### Template Engine Configuration

```json
{
  "template_engine": {
    "version": "v1",
    "syntax": "{{variable}}",
    "features": ["basic_substitution", "fragments"]
  }
}
```

**Why Shared**: Ensures all prompts use the same templating system, making the pack portable across different runtime environments.

### Reusable Fragments

```json
{
  "fragments": {
    "company_intro": "Welcome to {{company_name}}, where customer satisfaction is our priority.",
    "escalation_notice": "Let me connect you with a specialist who can better assist you.",
    "data_privacy": "We protect your information according to our privacy policy."
  }
}
```

**Benefits**:

- **Consistency**: Same messaging across all prompts
- **Maintainability**: Update company intro once, affects all prompts
- **Localization**: Easy to swap fragments for different languages or regions

### Tool Definitions

```json
{
  "tools": {
    "lookup_customer": { /* database query tool */ },
    "create_ticket": { /* ticketing system integration */ },
    "send_email": { /* email automation tool */ }
  }
}
```

**Advantages**:

- **Reusability**: Define once, reference from any prompt
- **Security**: Centralized tool policies and permissions
- **Testing**: Tool behavior is consistent across all prompts

## Prompt-Level Specialization

While sharing common resources, each prompt has its own specialized configuration:

### Independent Parameters

```json
{
  "prompts": {
    "support": {
      "parameters": {
        "temperature": 0.7,  // More creative for problem-solving
        "max_tokens": 1500   // Longer responses for explanations
      }
    },
    "sales": {
      "parameters": {
        "temperature": 0.9,  // More engaging and persuasive
        "max_tokens": 800    // Concise, focused responses
      }
    }
  }
}
```

### Specialized Tool Access

```json
{
  "prompts": {
    "support": {
      "tools": ["lookup_customer", "create_ticket", "send_email"]
    },
    "sales": {
      "tools": ["lookup_customer", "get_pricing", "schedule_demo"]
    },
    "billing": {
      "tools": ["lookup_customer", "process_payment", "send_receipt"]
    }
  }
}
```

### Custom Validation Rules

```json
{
  "prompts": {
    "support": {
      "validators": [
        {"type": "max_length", "params": {"max_tokens": 500}},
        {"type": "banned_words", "params": {"words": ["impossible", "can't help"]}}
      ]
    },
    "sales": {
      "validators": [
        {"type": "sentiment", "params": {"min_positive": 0.6}},
        {"type": "max_length", "params": {"max_tokens": 300}}
      ]
    }
  }
}
```

## Version Management Strategy

PromptPacks support both pack-level and prompt-level versioning:

```json
{
  "version": "2.1.0",  // Pack version - overall bundle version
  "prompts": {
    "support": {
      "version": "1.5.2"  // Individual prompt version
    },
    "sales": {
      "version": "2.0.1"  // Can evolve independently
    }
  }
}
```

**Benefits**:

- **Granular Updates**: Update just the sales prompt without changing support
- **Rollback Capability**: Revert individual prompts to previous versions
- **A/B Testing**: Run different prompt versions simultaneously
- **Compatibility Tracking**: Know which prompt versions work together

## Testing and Quality Assurance

PromptPacks include built-in support for testing and quality tracking:

```json
{
  "prompts": {
    "support": {
      "tested_models": [
        {
          "provider": "openai",
          "model": "gpt-4",
          "success_rate": 0.94,
          "avg_cost": 0.0045,
          "avg_latency_ms": 1200
        }
      ]
    }
  }
}
```

This enables:

- **Model Selection**: Choose the best-performing model for each prompt
- **Cost Optimization**: Balance performance vs. cost across different prompts
- **Performance Monitoring**: Track how prompts perform over time
- **Deployment Confidence**: Know before you deploy whether a prompt works well

## Deployment Benefits

The pack structure provides significant operational advantages:

### Single-File Deployment

Everything needed to run your AI system is in one JSON file. No missing dependencies, no scattered configuration files, no "it works on my machine" problems.

### Environment Portability

The same pack works across:

- **Development environments** (local testing)
- **Staging systems** (integration testing)
- **Production deployments** (live systems)
- **Different cloud providers** (AWS, Azure, GCP)
- **Various AI platforms** (OpenAI, Anthropic, local models)

### Atomic Updates

Deploy new versions atomically—either the entire pack updates successfully, or it doesn't. No partial updates that leave your system in an inconsistent state.

### Configuration as Code

PromptPacks enable GitOps workflows:

- **Version Control**: Track all changes through Git
- **Code Reviews**: Review prompt changes like code changes
- **Automated Testing**: CI/CD pipelines can test pack functionality
- **Rollback**: Instantly revert to previous pack versions

## Design Principles

The pack structure follows key principles that make conversational AI more manageable:

**Modularity**: Break complex AI behavior into focused, manageable pieces
**Composability**: Combine specialized prompts with shared resources efficiently  
**Portability**: Work consistently across different environments and providers
**Observability**: Built-in testing and performance tracking for continuous improvement
**Maintainability**: Clear separation makes updates safer and easier

This architecture scales from simple single-prompt packs to complex systems with dozens of specialized prompts, all while maintaining clarity and avoiding duplication.
