---
sidebar_position: 1
title: "Specification Overview (v1.0)"
---

# Specification Overview

<div style={{
  padding: '8px 16px',
  backgroundColor: '#6b7280',
  color: 'white',
  borderRadius: '6px',
  display: 'inline-block',
  marginBottom: '24px',
  fontWeight: 'bold'
}}>
  📦 v1.0 (Stable)
</div>

:::warning Archived Version
This is the **v1.0** documentation (October 2024). For the latest features, see [v1.1 docs →](../overview)
:::

PromptPack is a portable specification for packaging conversational AI systems into reusable, testable bundles. Think of it as a "container format" for AI applications—similar to how Docker containers package software, PromptPacks package everything needed to run sophisticated conversational AI.

## Why PromptPacks?

### The Challenge

Building production-ready conversational AI involves more than just writing prompts. You need:

- **Multiple specialized prompts** for different scenarios (support, sales, technical help)
- **External tools** that the AI can call (databases, APIs, calculators)
- **Shared resources** like reusable text fragments and configurations
- **Safety guardrails** to ensure appropriate responses
- **Version management** to track changes and ensure compatibility
- **Testing frameworks** to validate behavior across different models

Without a standard format, AI applications become fragmented, hard to maintain, and impossible to share reliably.

### The Solution

PromptPacks solve this by providing a **single JSON file** that contains everything needed to run a conversational AI system:

```json
{
  "id": "customer-support",
  "name": "Customer Support Pack", 
  "version": "1.0.0",
  "prompts": {
    "support": { /* specialized for general support */ },
    "sales": { /* optimized for sales inquiries */ },
    "technical": { /* focused on technical issues */ }
  },
  "tools": { /* shared external functions */ },
  "fragments": { /* reusable text components */ }
}
```

## Core Benefits

### 🎯 **Multi-Prompt Architecture**

Instead of one generic prompt trying to handle everything, PromptPacks let you create **specialized prompts for specific tasks**. A customer service pack might have separate prompts for billing questions, technical support, and sales inquiries—each optimized for its specific purpose while sharing common tools and configuration.

### 📦 **Complete Packaging**

Everything needed to run your AI system is in one file. No more hunting for prompt templates, tool definitions, or configuration scattered across multiple files. Deploy once, run anywhere.

### 🔄 **Reusability & Sharing**

PromptPacks are portable. Build a customer support pack once, then use it across different applications, teams, or even organizations. Share best practices through standardized, tested packages.

### 🛡️ **Built-in Safety**

Each prompt can have its own validators (guardrails) to ensure safe, appropriate responses. Define content filters, length limits, and custom validation rules that travel with your prompts.

### 🧪 **Testability**

PromptPacks include testing metadata—which models have been tested, success rates, performance metrics. Know before you deploy whether your pack works well with different AI providers.

### ⚡ **Tool Integration**

Define external tools once, reference them from any prompt in the pack. Whether it's looking up customer data, performing calculations, or calling external APIs, tools are reusable across all prompts.

## Real-World Use Cases

### Customer Service

A complete customer service PromptPack might include:

- **Support prompt** for general inquiries with ticket creation tools
- **Sales prompt** for product questions with inventory lookup tools
- **Technical prompt** for troubleshooting with diagnostic tools
- **Shared fragments** for company policies and escalation procedures

### Content Creation

A content generation PromptPack could contain:

- **Blog writing prompt** with SEO optimization tools
- **Social media prompt** with character limit validators
- **Email marketing prompt** with A/B testing tools
- **Brand voice fragments** ensuring consistent tone across all content

### Educational Assistant

An educational PromptPack might feature:

- **Tutoring prompt** with adaptive questioning techniques
- **Assessment prompt** with grading rubrics and feedback tools
- **Research prompt** with citation tools and fact-checking
- **Curriculum fragments** aligned to learning standards

## Design Philosophy

PromptPacks follow key principles that make them powerful and practical:

**Modularity**: Each prompt handles one domain well rather than trying to do everything

**Composability**: Shared tools, fragments, and configuration reduce duplication  

**Portability**: Works across different AI providers and runtime environments

**Versioning**: Track changes and maintain compatibility as your AI evolves

**Observability**: Built-in testing and performance tracking helps you optimize

## Getting Started

The PromptPack format is designed to be both human-readable and machine-executable. Whether you're hand-crafting prompts or generating them programmatically, the JSON structure provides the flexibility and power needed for production AI applications.

Ready to dive deeper? Explore the [structure guide](./structure) to understand how packs are organized, or jump to [examples](./examples) to see complete, real-world PromptPacks in action.
