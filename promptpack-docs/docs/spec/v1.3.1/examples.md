---
sidebar_position: 4
title: "Examples (v1.3.1)"
---

# Real-World Examples

<div style={{
  padding: '8px 16px',
  backgroundColor: '#6b7280',
  color: 'white',
  borderRadius: '6px',
  display: 'inline-block',
  marginBottom: '24px',
  fontWeight: 'bold'
}}>
  📦 v1.3.1 (Stable)
</div>

:::warning Archived Version
This is the **v1.3.1** documentation. For the latest features, see [v1.4 docs →](../examples)
:::

These examples showcase how PromptPacks solve real business problems. Each demonstrates different benefits of the multi-prompt architecture and shared resource model.

## Complete Customer Support System

This pack handles the full spectrum of customer service interactions by using specialized prompts for different scenarios.

### The Business Problem

Customer service teams need to handle diverse inquiries—from simple billing questions to complex technical issues. A single generic prompt can't optimize for all scenarios, leading to poor response quality and frustrated customers.

### The PromptPack Solution

```json
{
  "id": "customer-support",
  "name": "Customer Support Pack",
  "version": "1.2.0",
  "description": "Complete customer service solution with specialized prompts",
  
  "template_engine": {
    "version": "v1",
    "syntax": "{{variable}}",
    "features": ["basic_substitution", "fragments"]
  },
  
  "prompts": {
    "support": {
      "id": "support", 
      "name": "General Support",
      "version": "1.0.0",
      "system_template": "You are a {{role}} for {{company}}.\n\n{{customer_context}}\n\nHelp resolve their issue professionally and empathetically.",
      "variables": [
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
      "tools": ["lookup_customer", "create_ticket"],
      "parameters": {
        "temperature": 0.7,
        "max_tokens": 500
      },
      "validators": [
        {
          "type": "banned_words",
          "enabled": true,
          "params": {
            "words": ["impossible", "can't help", "not my job"]
          }
        }
      ]
    },
    
    "technical": {
      "id": "technical",
      "name": "Technical Support", 
      "version": "1.1.0",
      "system_template": "You are a {{role}} for {{company}}.\n\nCustomer's technical issue: {{issue_description}}\n\nProvide step-by-step troubleshooting guidance.",
      "variables": [
        {
          "name": "role",
          "type": "string", 
          "required": true,
          "example": "technical support engineer"
        },
        {
          "name": "issue_description",
          "type": "string",
          "required": true
        }
      ],
      "tools": ["run_diagnostic", "access_knowledge_base"],
      "parameters": {
        "temperature": 0.5,
        "max_tokens": 800
      }
    },
    
    "billing": {
      "id": "billing",
      "name": "Billing Support",
      "version": "1.0.1", 
      "system_template": "You are a {{role}} for {{company}}.\n\nCustomer billing inquiry: {{billing_question}}\n\nProvide accurate billing information and assistance.",
      "variables": [
        {
          "name": "role", 
          "type": "string",
          "required": true,
          "example": "billing specialist"
        },
        {
          "name": "billing_question",
          "type": "string",
          "required": true
        }
      ],
      "tools": ["lookup_account", "process_payment", "generate_invoice"],
      "validators": [
        {
          "type": "pii_detection",
          "enabled": true,
          "fail_on_violation": true
        }
      ]
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
            "description": "Customer account identifier"
          }
        },
        "required": ["customer_id"]
      }
    },
    
    "create_ticket": {
      "name": "create_ticket", 
      "description": "Create support ticket for complex issues",
      "parameters": {
        "type": "object",
        "properties": {
          "title": {"type": "string"},
          "description": {"type": "string"},
          "priority": {
            "type": "string",
            "enum": ["low", "medium", "high", "urgent"]
          }
        },
        "required": ["title", "description"]
      }
    }
  },
  
  "fragments": {
    "customer_context": "Customer: {{customer_name}}\nAccount Type: {{account_type}}\nIssue Category: {{category}}",
    "escalation_notice": "I'm going to connect you with a specialist who can provide more detailed assistance."
  }
}
```

### Key Benefits Demonstrated

**Specialized Expertise**: Each prompt optimizes for its domain—technical prompts use lower temperature for accuracy, billing prompts include PII detection

**Shared Efficiency**: All prompts share the same tools and fragments, reducing duplication and ensuring consistency

**Independent Evolution**: The technical prompt is at v1.1.0 while others are at v1.0.x, showing how different areas can evolve at their own pace

**Operational Safety**: Banned word validators prevent negative language in support contexts, while PII detection protects sensitive billing information

## Content Marketing Suite

This pack demonstrates how creative teams can use PromptPacks to maintain brand consistency across different content types.

### Marketing Challenge

Marketing teams need to create various content types (blogs, social media, emails) while maintaining consistent brand voice and meeting different platform requirements. Manual coordination leads to inconsistent messaging and duplicated effort.

### Multi-Channel Solution

```json
{
  "id": "content-marketing", 
  "name": "Content Marketing Suite",
  "version": "2.0.0",
  "description": "Brand-consistent content generation across all channels",
  
  "prompts": {
    "blog": {
      "id": "blog",
      "name": "Blog Writer",
      "version": "2.1.0", 
      "system_template": "{{fragments.brand_voice}}\n\nWrite a {{post_type}} blog post about {{topic}} for {{audience}}.\n\n{{fragments.blog_guidelines}}",
      "variables": [
        {
          "name": "post_type",
          "type": "string",
          "validation": {
            "enum": ["how-to", "thought-leadership", "case-study", "news"]
          }
        },
        {
          "name": "topic", 
          "type": "string",
          "required": true
        },
        {
          "name": "audience",
          "type": "string",
          "required": true,
          "example": "small business owners"
        }
      ],
      "tools": ["seo_analyzer", "plagiarism_checker"],
      "parameters": {
        "temperature": 0.8,
        "max_tokens": 2000
      }
    },
    
    "social": {
      "id": "social", 
      "name": "Social Media",
      "version": "1.5.0",
      "system_template": "{{fragments.brand_voice}}\n\nCreate a {{platform}} post about {{topic}}.\n\n{{fragments.social_guidelines}}",
      "variables": [
        {
          "name": "platform",
          "type": "string",
          "validation": {
            "enum": ["twitter", "linkedin", "instagram", "facebook"]
          }
        },
        {
          "name": "topic",
          "type": "string", 
          "required": true
        }
      ],
      "validators": [
        {
          "type": "max_length",
          "enabled": true, 
          "params": {
            "max_characters": 280
          }
        }
      ]
    },
    
    "email": {
      "id": "email",
      "name": "Email Marketing",
      "version": "1.3.0",
      "system_template": "{{fragments.brand_voice}}\n\nWrite a {{email_type}} email about {{campaign_topic}}.\n\n{{fragments.email_guidelines}}",
      "variables": [
        {
          "name": "email_type",
          "type": "string",
          "validation": {
            "enum": ["newsletter", "promotional", "onboarding", "announcement"]
          }
        },
        {
          "name": "campaign_topic",
          "type": "string",
          "required": true
        }
      ],
      "tools": ["email_validator", "ab_test_generator"]
    }
  },
  
  "tools": {
    "seo_analyzer": {
      "name": "seo_analyzer",
      "description": "Analyze content for SEO optimization",
      "parameters": {
        "type": "object",
        "properties": {
          "content": {"type": "string"},
          "target_keywords": {
            "type": "array",
            "items": {"type": "string"}
          }
        }
      }
    }
  },
  
  "fragments": {
    "brand_voice": "You are writing for TechCorp, a B2B software company. Our voice is professional but approachable, authoritative but not arrogant. We speak to business leaders who value efficiency and results.",
    
    "blog_guidelines": "Structure: compelling headline, intro hook, 3-5 main sections with subheadings, conclusion with CTA. Include specific examples and data. Optimize for SEO without sacrificing readability.",
    
    "social_guidelines": "Be engaging and conversational. Include relevant hashtags. Encourage interaction through questions or polls when appropriate.",
    
    "email_guidelines": "Subject line should be compelling but not clickbait. Personalize when possible. Include clear CTA. Respect recipient's time with concise, valuable content."
  }
}
```

### Content Marketing Benefits

**Brand Consistency**: The shared `brand_voice` fragment ensures all content maintains the same voice and personality

**Platform Optimization**: Each prompt is optimized for its medium—social posts have character limits, blog posts include SEO guidelines

**Content Quality**: Built-in tools like SEO analysis and plagiarism checking ensure high-quality output

**Campaign Coordination**: All content types can reference the same campaign topics and maintain consistent messaging

## AI-Powered Learning Assistant

This pack shows how educational institutions can create comprehensive learning systems that adapt to different learning contexts.

### Educational Challenge

Educational institutions need AI assistants that can tutor students, help with research, provide feedback on assignments, and answer administrative questions. Each context requires different approaches and safety considerations.

### Adaptive Learning Solution

```json
{
  "id": "learning-assistant",
  "name": "AI Learning Assistant", 
  "version": "1.4.0",
  "description": "Comprehensive educational AI supporting multiple learning contexts",
  
  "prompts": {
    "tutor": {
      "id": "tutor",
      "name": "Personal Tutor",
      "version": "1.2.0",
      "system_template": "You are a {{subject}} tutor helping a {{grade_level}} student.\n\nStudent question: {{question}}\n\n{{fragments.socratic_method}}\n\n{{fragments.safety_guidelines}}",
      "variables": [
        {
          "name": "subject",
          "type": "string",
          "required": true,
          "example": "mathematics"
        },
        {
          "name": "grade_level", 
          "type": "string",
          "required": true,
          "validation": {
            "enum": ["elementary", "middle", "high", "college"]
          }
        },
        {
          "name": "question",
          "type": "string", 
          "required": true
        }
      ],
      "parameters": {
        "temperature": 0.6,
        "max_tokens": 600
      },
      "validators": [
        {
          "type": "educational_appropriateness",
          "enabled": true,
          "params": {
            "check_age_appropriate": true,
            "prevent_direct_answers": true
          }
        }
      ]
    },
    
    "research": {
      "id": "research", 
      "name": "Research Assistant",
      "version": "1.1.0",
      "system_template": "You are a research assistant helping with {{research_topic}}.\n\nResearch question: {{question}}\n\n{{fragments.research_methodology}}\n\n{{fragments.citation_requirements}}",
      "variables": [
        {
          "name": "research_topic",
          "type": "string",
          "required": true
        },
        {
          "name": "question",
          "type": "string",
          "required": true
        }
      ],
      "tools": ["database_search", "citation_formatter"],
      "validators": [
        {
          "type": "academic_integrity", 
          "enabled": true,
          "params": {
            "plagiarism_check": true,
            "source_verification": true
          }
        }
      ]
    },
    
    "feedback": {
      "id": "feedback",
      "name": "Assignment Feedback",
      "version": "1.0.0", 
      "system_template": "Provide constructive feedback on this {{assignment_type}}.\n\nAssignment: {{student_work}}\n\nRubric: {{grading_rubric}}\n\n{{fragments.feedback_approach}}",
      "variables": [
        {
          "name": "assignment_type",
          "type": "string",
          "required": true,
          "example": "essay"
        },
        {
          "name": "student_work",
          "type": "string",
          "required": true
        },
        {
          "name": "grading_rubric", 
          "type": "string",
          "required": false
        }
      ],
      "parameters": {
        "temperature": 0.4
      }
    }
  },
  
  "tools": {
    "database_search": {
      "name": "database_search",
      "description": "Search academic databases for research sources",
      "parameters": {
        "type": "object", 
        "properties": {
          "query": {"type": "string"},
          "subject_area": {"type": "string"},
          "publication_years": {
            "type": "object",
            "properties": {
              "start": {"type": "integer"},
              "end": {"type": "integer"}
            }
          }
        }
      }
    }
  },
  
  "fragments": {
    "socratic_method": "Guide the student to discover the answer through questions. Don't give direct answers—help them think through the problem step by step.",
    
    "safety_guidelines": "Always maintain appropriate boundaries. If a question is outside your expertise or inappropriate for the student's level, explain and redirect appropriately.",
    
    "research_methodology": "Help identify reliable sources, evaluate credibility, synthesize information from multiple sources, and maintain academic integrity throughout the research process.",
    
    "citation_requirements": "All sources must be properly cited. Help students understand plagiarism and the importance of attribution.",
    
    "feedback_approach": "Provide specific, actionable feedback. Highlight strengths first, then areas for improvement. Suggest concrete next steps for enhancement."
  }
}
```

### Educational Benefits

**Educational Specialization**: Different prompts use different approaches—tutoring uses Socratic method, research emphasizes methodology, feedback focuses on constructive criticism

**Safety First**: Built-in validators ensure age-appropriate content and academic integrity

**Learning Scaffolding**: Shared fragments encode best educational practices that apply across all contexts

**Adaptive Parameters**: Research assistant uses higher temperature for creativity, feedback uses lower for consistency

## Multi-Agent Customer Support with Workflow *(v1.3+)*

This pack demonstrates how workflow orchestration and agent definitions work together to create a fully automated customer support system with intelligent routing.

### The Orchestration Challenge

In the earlier Customer Support example, a caller must decide which prompt to invoke. As systems grow more complex, you need automated routing — triaging requests, transitioning between specialists, and handling escalations without manual intervention.

### Workflow + Agents Solution

```json
{
  "id": "customer-support-orchestrated",
  "name": "Orchestrated Customer Support",
  "version": "1.3.0",
  "description": "Multi-agent customer support with automated workflow routing",

  "template_engine": {
    "version": "v1",
    "syntax": "{{variable}}",
    "features": ["basic_substitution", "fragments"]
  },

  "prompts": {
    "triage": {
      "id": "triage",
      "name": "Request Triage",
      "version": "1.0.0",
      "system_template": "You are a customer service triage agent for {{company}}.\n\nClassify the customer's request and respond with one of: billing, technical, general.\n\n{{fragments.company_intro}}",
      "variables": [
        { "name": "company", "type": "string", "required": true }
      ],
      "parameters": { "temperature": 0.3 }
    },
    "billing": {
      "id": "billing",
      "name": "Billing Support",
      "version": "1.0.0",
      "system_template": "You are a billing specialist for {{company}}.\n\nHelp resolve the customer's billing issue.\n\n{{fragments.company_intro}}",
      "variables": [
        { "name": "company", "type": "string", "required": true }
      ],
      "tools": ["lookup_account", "process_refund"],
      "parameters": { "temperature": 0.5 }
    },
    "technical": {
      "id": "technical",
      "name": "Technical Support",
      "version": "1.0.0",
      "system_template": "You are a technical support engineer for {{company}}.\n\nProvide step-by-step troubleshooting.\n\n{{fragments.company_intro}}",
      "variables": [
        { "name": "company", "type": "string", "required": true }
      ],
      "tools": ["run_diagnostic", "access_knowledge_base"],
      "parameters": { "temperature": 0.4 }
    },
    "closing": {
      "id": "closing",
      "name": "Session Closing",
      "version": "1.0.0",
      "system_template": "Summarize the resolution and ask if there's anything else you can help with.",
      "parameters": { "temperature": 0.6 }
    }
  },

  "workflow": {
    "version": 1,
    "entry": "triage",
    "states": {
      "triage": {
        "prompt_task": "triage",
        "description": "Classify and route incoming requests",
        "on_event": {
          "billing": "billing_state",
          "technical": "technical_state",
          "general": "closing_state"
        }
      },
      "billing_state": {
        "prompt_task": "billing",
        "on_event": { "resolved": "closing_state", "escalate": "escalation" },
        "persistence": "persistent"
      },
      "technical_state": {
        "prompt_task": "technical",
        "on_event": { "resolved": "closing_state", "escalate": "escalation" },
        "persistence": "persistent"
      },
      "closing_state": {
        "prompt_task": "closing",
        "on_event": {},
        "orchestration": "internal"
      },
      "escalation": {
        "prompt_task": "closing",
        "on_event": {},
        "orchestration": "external"
      }
    }
  },

  "agents": {
    "entry": "triage",
    "members": {
      "triage": {
        "description": "Routes customer requests to the right specialist",
        "tags": ["router", "customer-service"]
      },
      "billing": {
        "description": "Handles billing inquiries and payment issues",
        "tags": ["billing", "payments"],
        "output_modes": ["text/plain", "application/json"]
      },
      "technical": {
        "description": "Provides technical troubleshooting assistance",
        "tags": ["support", "technical"]
      }
    }
  },

  "tools": {
    "lookup_account": {
      "name": "lookup_account",
      "description": "Look up customer account details",
      "parameters": {
        "type": "object",
        "properties": {
          "customer_id": { "type": "string" }
        },
        "required": ["customer_id"]
      }
    },
    "process_refund": {
      "name": "process_refund",
      "description": "Process a customer refund",
      "parameters": {
        "type": "object",
        "properties": {
          "amount": { "type": "number" },
          "reason": { "type": "string" }
        },
        "required": ["amount"]
      }
    },
    "run_diagnostic": {
      "name": "run_diagnostic",
      "description": "Run automated diagnostic checks",
      "parameters": {
        "type": "object",
        "properties": {
          "product_id": { "type": "string" },
          "symptoms": { "type": "string" }
        }
      }
    },
    "access_knowledge_base": {
      "name": "access_knowledge_base",
      "description": "Search the technical knowledge base",
      "parameters": {
        "type": "object",
        "properties": {
          "query": { "type": "string" }
        },
        "required": ["query"]
      }
    }
  },

  "fragments": {
    "company_intro": "Welcome to {{company}} support. We're here to help."
  }
}
```

### Orchestration Benefits

**Automated Routing**: The triage prompt classifies requests, and the workflow automatically transitions to the right specialist — no manual routing logic needed

**Stateful Conversations**: `persistence: "persistent"` ensures billing and technical states preserve conversation context across turns

**Escalation Paths**: When a specialist can't resolve an issue, the `escalate` event transitions to an external orchestration state for human handoff

**A2A Discovery**: Agent definitions make each prompt discoverable via the A2A protocol, enabling external systems to route requests directly to specialists

**Composable Architecture**: Workflow and agents are independent — use workflow alone for internal orchestration, or agents alone for A2A interop

## Document Review Pipeline with Evals *(v1.2+)*

This pack demonstrates how evals and validators work together to monitor quality in a document-processing pipeline.

### The Quality Challenge

Legal and compliance teams generate high volumes of document summaries, risk analyses, and draft responses. Validators catch obvious problems inline, but teams also need ongoing quality metrics — brand voice consistency, structural compliance, and accuracy trends — without blocking every response.

### Evals + Validators Solution

```json
{
  "id": "document-review-pipeline",
  "name": "Document Review Pipeline",
  "version": "1.2.0",
  "description": "Document processing with validators for safety and evals for quality monitoring",

  "template_engine": {
    "version": "v1",
    "syntax": "{{variable}}",
    "features": ["basic_substitution", "fragments"]
  },

  "evals": [
    {
      "id": "brand-voice",
      "description": "Checks that all outputs align with corporate communication guidelines",
      "type": "cosine_similarity",
      "trigger": "on_session_complete",
      "metric": {
        "name": "promptpack_brand_voice_score",
        "type": "gauge",
        "range": { "min": 0, "max": 1 }
      },
      "params": {
        "reference_embeddings": "corporate_style_guide_v3",
        "threshold": 0.85
      }
    },
    {
      "id": "structure-check",
      "description": "Validates that outputs conform to expected JSON structure",
      "type": "json_valid",
      "trigger": "every_turn",
      "metric": {
        "name": "promptpack_structure_valid",
        "type": "boolean"
      }
    }
  ],

  "prompts": {
    "summarizer": {
      "id": "summarizer",
      "name": "Document Summarizer",
      "version": "1.0.0",
      "system_template": "You are a document summarizer for {{company}}.\n\nSummarize the following document in {{format}} format.\n\n{{fragments.output_standards}}",
      "variables": [
        { "name": "company", "type": "string", "required": true },
        { "name": "format", "type": "string", "required": true, "example": "bullet-point" }
      ],
      "parameters": { "temperature": 0.3, "max_tokens": 1000 },
      "validators": [
        {
          "type": "max_length",
          "enabled": true,
          "fail_on_violation": true,
          "params": { "max_characters": 5000 }
        }
      ]
    },
    "risk_analyzer": {
      "id": "risk_analyzer",
      "name": "Risk Analyzer",
      "version": "1.1.0",
      "system_template": "You are a risk analysis specialist for {{company}}.\n\nAnalyze the document for regulatory, financial, and operational risks.\n\nReturn a JSON object with risk_level, findings, and recommendations.\n\n{{fragments.output_standards}}",
      "variables": [
        { "name": "company", "type": "string", "required": true }
      ],
      "tools": ["compliance_db_lookup", "precedent_search"],
      "parameters": { "temperature": 0.2, "max_tokens": 2000 },
      "validators": [
        {
          "type": "pii_detection",
          "enabled": true,
          "fail_on_violation": true
        }
      ],
      "evals": [
        {
          "id": "risk-accuracy",
          "description": "LLM judge checks whether identified risks are substantiated by the source document",
          "type": "llm_judge",
          "trigger": "every_turn",
          "metric": {
            "name": "promptpack_risk_accuracy",
            "type": "gauge",
            "range": { "min": 1, "max": 5 }
          },
          "params": {
            "judge_prompt": "Rate 1-5 whether each identified risk is clearly supported by evidence in the source document.",
            "model": "gpt-4o",
            "passing_score": 4
          }
        }
      ]
    },
    "drafter": {
      "id": "drafter",
      "name": "Response Drafter",
      "version": "1.0.0",
      "system_template": "You are a professional response drafter for {{company}}.\n\nDraft a {{response_type}} based on the analysis provided.\n\n{{fragments.output_standards}}",
      "variables": [
        { "name": "company", "type": "string", "required": true },
        { "name": "response_type", "type": "string", "required": true, "example": "client letter" }
      ],
      "parameters": { "temperature": 0.5, "max_tokens": 3000 }
    }
  },

  "tools": {
    "compliance_db_lookup": {
      "name": "compliance_db_lookup",
      "description": "Search the regulatory compliance database",
      "parameters": {
        "type": "object",
        "properties": {
          "regulation": { "type": "string" },
          "jurisdiction": { "type": "string" }
        },
        "required": ["regulation"]
      }
    },
    "precedent_search": {
      "name": "precedent_search",
      "description": "Search for relevant legal precedents",
      "parameters": {
        "type": "object",
        "properties": {
          "query": { "type": "string" },
          "date_range": { "type": "string" }
        },
        "required": ["query"]
      }
    }
  },

  "fragments": {
    "output_standards": "Follow corporate communication standards. Be precise, cite sources, and avoid speculation."
  }
}
```

### Quality Monitoring Benefits

**Layered Quality**: Validators block bad output immediately (PII leaks, oversized responses), while evals track quality trends over time (brand voice drift, risk accuracy)

**Pack-Level + Prompt-Level Evals**: The `brand-voice` and `structure-check` evals apply to all prompts. The `risk_analyzer` adds its own `risk-accuracy` eval that runs `every_turn` because accuracy is critical for risk analysis

**Prometheus Metrics**: Each eval declares a metric with name, type, and range — runtimes export these directly to monitoring dashboards

**Override Semantics**: If the `risk_analyzer` needed different brand-voice thresholds, it could declare a prompt-level eval with the same `id` to override the pack-level default

## Visual Product Catalog Assistant *(v1.1+)*

This pack demonstrates multimodal capabilities — handling images alongside text in a product catalog context.

### The Multimodal Challenge

E-commerce teams need AI assistants that can look at product photos, understand visual details, and generate accurate catalog descriptions. A text-only prompt can't interpret product images, leading to generic descriptions that miss visual selling points.

### Multimodal Solution

```json
{
  "id": "product-catalog-assistant",
  "name": "Visual Product Catalog Assistant",
  "version": "1.1.0",
  "description": "Image-aware product assistant with text-only catalog writer",

  "template_engine": {
    "version": "v1",
    "syntax": "{{variable}}",
    "features": ["basic_substitution", "fragments"]
  },

  "prompts": {
    "product_lookup": {
      "id": "product_lookup",
      "name": "Visual Product Lookup",
      "version": "1.0.0",
      "system_template": "You are a product specialist for {{brand}}.\n\nAnalyze the product image and provide:\n- Product category and type\n- Key visual features (color, material, style)\n- Condition assessment\n- Suggested catalog tags\n\n{{fragments.brand_standards}}",
      "variables": [
        { "name": "brand", "type": "string", "required": true, "example": "ModernHome" }
      ],
      "tools": ["product_db_search", "price_lookup"],
      "parameters": { "temperature": 0.3, "max_tokens": 800 },
      "media": {
        "enabled": true,
        "supported_types": ["image"],
        "image": {
          "max_size_mb": 10,
          "allowed_formats": ["jpeg", "png", "webp"],
          "default_detail": "high",
          "require_caption": false,
          "max_images_per_msg": 4
        },
        "examples": [
          {
            "name": "product-analysis",
            "description": "Analyzing a product image to extract catalog information",
            "role": "user",
            "parts": [
              { "type": "text", "text": "Analyze this product for our catalog:" },
              {
                "type": "media",
                "media": {
                  "url": "https://example.com/sample-product.jpg",
                  "mime_type": "image/jpeg",
                  "detail": "high",
                  "caption": "Blue ceramic vase, 12 inches tall"
                }
              }
            ]
          },
          {
            "name": "product-analysis-response",
            "description": "Expected analysis output format",
            "role": "assistant",
            "parts": [
              {
                "type": "text",
                "text": "**Category:** Home Decor > Vases\n**Features:** Ceramic, cobalt blue glaze, cylindrical form, 12\" height\n**Condition:** New\n**Tags:** ceramic, vase, blue, home-decor, modern"
              }
            ]
          }
        ]
      }
    },
    "catalog_writer": {
      "id": "catalog_writer",
      "name": "Catalog Description Writer",
      "version": "1.0.0",
      "system_template": "You are a catalog copywriter for {{brand}}.\n\nWrite a compelling product description based on the product details provided.\n\nTone: {{tone}}\n\n{{fragments.brand_standards}}",
      "variables": [
        { "name": "brand", "type": "string", "required": true },
        { "name": "tone", "type": "string", "required": true, "example": "warm and aspirational" }
      ],
      "parameters": { "temperature": 0.7, "max_tokens": 500 },
      "validators": [
        {
          "type": "max_length",
          "enabled": true,
          "fail_on_violation": true,
          "params": { "max_characters": 2000 }
        }
      ]
    }
  },

  "tools": {
    "product_db_search": {
      "name": "product_db_search",
      "description": "Search the product database by visual features or text query",
      "parameters": {
        "type": "object",
        "properties": {
          "query": { "type": "string" },
          "category": { "type": "string" },
          "tags": { "type": "array", "items": { "type": "string" } }
        },
        "required": ["query"]
      }
    },
    "price_lookup": {
      "name": "price_lookup",
      "description": "Look up current pricing for a product",
      "parameters": {
        "type": "object",
        "properties": {
          "product_id": { "type": "string" }
        },
        "required": ["product_id"]
      }
    }
  },

  "fragments": {
    "brand_standards": "Follow ModernHome brand guidelines: premium but accessible, emphasize craftsmanship and design intent."
  }
}
```

### Multimodal Benefits

**Image-Aware Analysis**: The `product_lookup` prompt accepts up to 4 images per message with high-detail processing, extracting visual features that text-only prompts would miss

**Multimodal Examples**: The `media.examples` array uses `parts` with mixed `text` and `media` content types, showing the model exactly what input/output format to expect

**Text + Multimodal Coexistence**: The `catalog_writer` prompt is text-only — it receives the analyzed product details and writes copy. Not every prompt in a pack needs multimodal support

**Format Control**: The `image` config restricts formats to `jpeg`, `png`, and `webp`, limits file size to 10 MB, and sets `default_detail: "high"` for accurate product analysis

## Research Crew — Agents Without Workflow *(v1.3+)*

This pack demonstrates standalone agents that collaborate via A2A discovery without a workflow state machine.

### The Collaboration Challenge

Research teams need multiple AI specialists — a researcher who gathers information, a fact-checker who verifies claims, and a writer who produces the final output. These agents don't follow a rigid sequence; the researcher might call the fact-checker multiple times, and the writer might loop back to the researcher for more detail.

### Standalone Agents Solution

```json
{
  "id": "research-crew",
  "name": "Research Crew",
  "version": "1.3.0",
  "description": "Collaborative research agents using A2A discovery without workflow orchestration",

  "template_engine": {
    "version": "v1",
    "syntax": "{{variable}}",
    "features": ["basic_substitution", "fragments"]
  },

  "prompts": {
    "researcher": {
      "id": "researcher",
      "name": "Research Specialist",
      "version": "1.0.0",
      "system_template": "You are a research specialist.\n\nGather comprehensive information on {{topic}} from available sources.\n\nWhen you find claims that need verification, use the fact_checker tool.\nWhen your research is complete, use the writer tool to produce the final output.\n\n{{fragments.quality_standards}}",
      "variables": [
        { "name": "topic", "type": "string", "required": true }
      ],
      "tools": ["web_search", "academic_search", "fact_checker", "writer"],
      "parameters": { "temperature": 0.5, "max_tokens": 2000 }
    },
    "fact_checker": {
      "id": "fact_checker",
      "name": "Fact Checker",
      "version": "1.0.0",
      "system_template": "You are a fact-checking specialist.\n\nVerify the accuracy of claims by cross-referencing multiple sources.\n\nReturn a JSON object with: claim, verdict (confirmed/unconfirmed/disputed), confidence, and sources.\n\n{{fragments.quality_standards}}",
      "tools": ["web_search", "academic_search"],
      "parameters": { "temperature": 0.2, "max_tokens": 1000 }
    },
    "writer": {
      "id": "writer",
      "name": "Research Writer",
      "version": "1.0.0",
      "system_template": "You are a research writer.\n\nProduce a well-structured {{output_format}} based on the research and fact-check results provided.\n\nIf you need additional information, use the researcher tool.\n\n{{fragments.quality_standards}}",
      "variables": [
        { "name": "output_format", "type": "string", "required": true, "example": "executive briefing" }
      ],
      "tools": ["researcher"],
      "parameters": { "temperature": 0.6, "max_tokens": 3000 },
      "validators": [
        {
          "type": "max_length",
          "enabled": true,
          "fail_on_violation": false,
          "params": { "max_characters": 15000 }
        }
      ]
    }
  },

  "agents": {
    "entry": "researcher",
    "members": {
      "researcher": {
        "description": "Gathers and synthesizes information from multiple sources on a given topic",
        "tags": ["research", "information-gathering"],
        "input_modes": ["text/plain"],
        "output_modes": ["text/plain", "application/json"]
      },
      "fact_checker": {
        "description": "Verifies factual claims by cross-referencing sources and returns confidence scores",
        "tags": ["verification", "fact-checking"],
        "input_modes": ["text/plain", "application/json"],
        "output_modes": ["application/json"]
      },
      "writer": {
        "description": "Produces polished research documents from gathered information and verified facts",
        "tags": ["writing", "content-creation"],
        "input_modes": ["text/plain", "application/json"],
        "output_modes": ["text/plain"]
      }
    }
  },

  "tools": {
    "web_search": {
      "name": "web_search",
      "description": "Search the web for current information",
      "parameters": {
        "type": "object",
        "properties": {
          "query": { "type": "string" },
          "max_results": { "type": "integer" }
        },
        "required": ["query"]
      }
    },
    "academic_search": {
      "name": "academic_search",
      "description": "Search academic databases for peer-reviewed sources",
      "parameters": {
        "type": "object",
        "properties": {
          "query": { "type": "string" },
          "subject_area": { "type": "string" }
        },
        "required": ["query"]
      }
    }
  },

  "fragments": {
    "quality_standards": "Cite all sources. Distinguish between established facts and emerging research. Flag any claims with low confidence."
  }
}
```

### Standalone Agents Benefits

**No Workflow Needed**: The agents collaborate through tool references — `researcher` calls `fact_checker` and `writer` as tools, `writer` can call `researcher` back. The interaction topology emerges from tool references, not a rigid state machine

**A2A Discovery**: Each agent declares `description`, `tags`, `input_modes`, and `output_modes` — enough for external systems to discover and invoke them via the A2A protocol

**Flexible Topology**: Unlike workflow (which enforces a fixed sequence), the agent mesh allows dynamic collaboration. The researcher might call fact-checker zero times or ten times depending on the topic

**Entry Point**: `agents.entry: "researcher"` tells external systems which agent receives the initial request by default, but any agent can be invoked directly

## Skill-Enhanced Support System *(v1.3.1+)*

This pack demonstrates how skills provide progressive-disclosure knowledge loading — domain expertise that agents activate on demand without bloating system templates.

### The Knowledge Challenge

Support agents need deep domain knowledge — billing policies, troubleshooting procedures, escalation protocols — but embedding everything in system templates makes them unwieldy. Different conversation phases need different knowledge, and loading it all upfront wastes context window.

### Skills Solution

```json
{
  "id": "skill-enhanced-support",
  "name": "Skill-Enhanced Support",
  "version": "1.3.1",
  "description": "Support system with progressive knowledge loading via skills",

  "template_engine": {
    "version": "v1",
    "syntax": "{{variable}}",
    "features": ["basic_substitution", "fragments"]
  },

  "skills": [
    "./skills/billing",
    "./skills/technical",
    { "path": "./skills/compliance", "preload": true },
    {
      "name": "escalation-protocol",
      "description": "Steps for escalating unresolved customer issues",
      "instructions": "When a customer issue cannot be resolved within 3 exchanges:\n1. Acknowledge the complexity of the issue\n2. Collect all relevant case details (order ID, error messages, steps tried)\n3. Create an escalation ticket with priority based on customer tier\n4. Provide the ticket reference number to the customer\n5. Set expectations for follow-up timeline (24h for standard, 4h for premium)"
    }
  ],

  "prompts": {
    "triage": {
      "id": "triage",
      "name": "Request Triage",
      "version": "1.0.0",
      "system_template": "You are a support triage agent for {{company}}.\n\nClassify the customer's request and respond with: billing, technical, or general.",
      "variables": [
        { "name": "company", "type": "string", "required": true }
      ],
      "parameters": { "temperature": 0.3 }
    },
    "billing": {
      "id": "billing",
      "name": "Billing Support",
      "version": "1.0.0",
      "system_template": "You are a billing specialist for {{company}}.\n\nHelp resolve the customer's billing issue using your available skills and tools.",
      "variables": [
        { "name": "company", "type": "string", "required": true }
      ],
      "tools": ["lookup_account", "process_refund"],
      "parameters": { "temperature": 0.5 }
    },
    "technical": {
      "id": "technical",
      "name": "Technical Support",
      "version": "1.0.0",
      "system_template": "You are a technical support engineer for {{company}}.\n\nDiagnose and resolve the customer's technical issue using your available skills.",
      "variables": [
        { "name": "company", "type": "string", "required": true }
      ],
      "tools": ["run_diagnostic"],
      "parameters": { "temperature": 0.4 }
    },
    "closing": {
      "id": "closing",
      "name": "Session Closing",
      "version": "1.0.0",
      "system_template": "Summarize the resolution and ask if there's anything else.",
      "parameters": { "temperature": 0.6 }
    }
  },

  "workflow": {
    "version": 1,
    "entry": "triage",
    "states": {
      "triage": {
        "prompt_task": "triage",
        "on_event": { "billing": "billing_state", "technical": "tech_state", "general": "closing_state" }
      },
      "billing_state": {
        "prompt_task": "billing",
        "on_event": { "resolved": "closing_state" },
        "persistence": "persistent",
        "skills": "./skills/billing"
      },
      "tech_state": {
        "prompt_task": "technical",
        "on_event": { "resolved": "closing_state" },
        "persistence": "persistent",
        "skills": "./skills/technical"
      },
      "closing_state": {
        "prompt_task": "closing",
        "on_event": {},
        "skills": "none"
      }
    }
  },

  "tools": {
    "lookup_account": {
      "name": "lookup_account",
      "description": "Look up customer account details",
      "parameters": {
        "type": "object",
        "properties": { "customer_id": { "type": "string" } },
        "required": ["customer_id"]
      }
    },
    "process_refund": {
      "name": "process_refund",
      "description": "Process a customer refund",
      "parameters": {
        "type": "object",
        "properties": { "amount": { "type": "number" }, "reason": { "type": "string" } },
        "required": ["amount"]
      }
    },
    "run_diagnostic": {
      "name": "run_diagnostic",
      "description": "Run automated diagnostic checks",
      "parameters": {
        "type": "object",
        "properties": { "product_id": { "type": "string" }, "symptoms": { "type": "string" } }
      }
    }
  }
}
```

### Skills Benefits

**Progressive Disclosure**: Skills load on demand rather than bloating system templates upfront. The billing state loads billing skills; the technical state loads technical skills

**State-Scoped Knowledge**: Each workflow state declares which skills are available via the `skills` field, ensuring agents only see relevant knowledge. The closing state uses `"none"` to disable skills entirely

**Mixed Sources**: The pack combines file-based skills (`./skills/billing`), eagerly-loaded compliance skills (`preload: true`), and an inline escalation protocol — all in one `skills` array

**Lean Templates**: System templates stay focused on core behavior. Domain knowledge lives in skills, loaded when needed rather than embedded in every prompt

## Why These Examples Matter

Each example shows how PromptPacks solve real business problems:

1. **Specialization Over Generalization**: Multiple focused prompts outperform single generic ones
2. **Operational Efficiency**: Shared resources eliminate duplication while ensuring consistency
3. **Quality Assurance**: Built-in validation, evals, and testing prevent common problems and enable continuous quality monitoring
4. **Maintainable Complexity**: Complex systems remain manageable through clear organization
5. **Business Alignment**: Each prompt can optimize for its specific business outcomes
6. **Flexible Architecture**: Choose the right orchestration pattern — workflow for rigid sequences, agents for dynamic collaboration, or both together
7. **Progressive Knowledge**: Skills keep templates lean while giving agents access to deep domain expertise on demand

PromptPacks transform conversational AI from experimental prototypes into production-ready business solutions.
