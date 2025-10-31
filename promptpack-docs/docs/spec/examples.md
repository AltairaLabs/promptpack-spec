---
sidebar_position: 3
---

# Examples

This page showcases various PromptPack examples to help you understand the specification in practice.

## Basic Assistant

A simple conversational assistant that can answer questions and maintain context.

```yaml
apiVersion: v1
kind: PromptPack
metadata:
  name: basic-assistant
  version: 1.0.0
  description: A general-purpose conversational assistant

spec:
  prompts:
    - name: greeting
      template: |
        Hello! I'm {{persona.name}}, {{persona.description}}.
        How can I help you today?
      
    - name: question_answering
      template: |
        {{fragments.context_awareness}}
        
        User's question: {{user_input}}
        
        Please provide a helpful and accurate response based on your knowledge.
        If you're not sure about something, say so honestly.

  personas:
    - name: helpful_assistant
      description: your friendly AI assistant
      traits:
        personality: helpful, patient, and knowledgeable
        communication_style: clear and concise
        expertise: general knowledge

  fragments:
    - name: context_awareness
      content: |
        Remember our conversation history and maintain context.
        Be consistent with previous responses in this session.
```

## Customer Support Bot

A more complex example with tools and workflows for customer support.

```yaml
apiVersion: v1
kind: PromptPack
metadata:
  name: customer-support-bot
  version: 2.1.0
  description: AI-powered customer support system
  tags: [customer-service, support, helpdesk]

spec:
  workflows:
    - name: support_flow
      description: Main customer support workflow
      steps:
        - prompt: greeting
        - condition: "{{intent_classification}} == 'technical'"
          then:
            - prompt: technical_assessment  
            - tool: knowledge_search
            - prompt: technical_response
          else:
            - prompt: general_support
            - tool: ticket_creation

  prompts:
    - name: greeting
      template: |
        Hi {{customer.name}}! I'm {{persona.name}} from {{company.name}} support.
        I'm here to help resolve your issue today.
        
        Can you please describe what you're experiencing?
      variables:
        - name: customer.name
          type: string
          required: true

    - name: technical_assessment
      template: |
        Thanks for the details. Let me assess your technical issue:
        
        Issue: {{user_issue}}
        Product: {{customer.product}}
        
        Based on this information, I'll search our knowledge base for solutions.

    - name: technical_response
      template: |
        {{fragments.empathy}}
        
        I found some information that might help:
        {{knowledge_results}}
        
        {{fragments.follow_up}}

  tools:
    - name: knowledge_search
      description: Search internal knowledge base for solutions
      parameters:
        - name: query
          type: string
          required: true
        - name: product_category  
          type: string
          required: false
      returns:
        type: array
        items: KnowledgeArticle

    - name: ticket_creation
      description: Create support ticket for complex issues
      parameters:
        - name: customer_id
          type: string
          required: true
        - name: issue_description
          type: string
          required: true
        - name: priority
          type: string
          enum: [low, medium, high, urgent]

  personas:
    - name: support_specialist
      traits:
        personality: empathetic and solution-focused
        communication_style: professional but warm
        expertise: product knowledge and troubleshooting
      constraints:
        - Never make promises about timelines without checking
        - Always escalate security-related issues
        - Maintain customer confidentiality

  fragments:
    - name: empathy
      content: I understand how frustrating this must be.

    - name: follow_up
      content: |
        Does this help resolve your issue? If not, I can:
        - Look for additional solutions
        - Connect you with a specialist
        - Create a support ticket for further investigation
```

## Content Generation System

An example focused on creative content generation with multiple personas.

```yaml
apiVersion: v1
kind: PromptPack
metadata:
  name: content-generator
  version: 1.3.0
  description: Multi-persona content generation system

spec:
  workflows:
    - name: blog_creation
      steps:
        - prompt: topic_analysis
        - prompt: outline_creation
        - prompt: content_writing
        - prompt: review_and_edit

  prompts:
    - name: topic_analysis
      template: |
        Analyze this blog topic: {{topic}}
        Target audience: {{audience}}
        
        Provide:
        1. Key themes to cover
        2. Audience interests and pain points  
        3. Recommended content structure
        4. SEO keywords to include

    - name: outline_creation
      template: |
        Create a detailed outline for: {{topic}}
        
        Analysis: {{topic_analysis}}
        
        Structure the outline with:
        - Compelling headline options (3-5)
        - Introduction hook
        - 3-5 main sections with subpoints
        - Conclusion that drives action
        - Call-to-action suggestions

    - name: content_writing
      template: |
        {{fragments.writing_guidelines}}
        
        Write engaging blog content following this outline:
        {{outline}}
        
        Topic: {{topic}}
        Target audience: {{audience}}
        Persona voice: {{persona.voice}}
        Tone: {{persona.tone}}

  personas:
    - name: tech_blogger
      voice: authoritative but approachable
      tone: informative and slightly conversational
      traits:
        expertise: technology and software
        style: clear explanations with practical examples

    - name: marketing_copywriter  
      voice: persuasive and energetic
      tone: enthusiastic and benefit-focused
      traits:
        expertise: marketing and sales
        style: action-oriented with emotional appeals

  fragments:
    - name: writing_guidelines
      content: |
        Writing Guidelines:
        - Use active voice and strong verbs
        - Keep sentences concise and scannable
        - Include specific examples and data when possible
        - Write compelling headlines and subheadings
        - End with a clear call-to-action
```

## API Integration Example

Shows how to integrate external APIs and handle responses.

```yaml
apiVersion: v1
kind: PromptPack
metadata:
  name: weather-assistant
  version: 1.0.0
  description: Weather information assistant with real-time data

spec:
  prompts:
    - name: weather_query
      template: |
        I'll get the current weather information for {{location}}.
        {{weather_data}}
        
        {{fragments.weather_interpretation}}

  tools:
    - name: get_weather
      description: Fetch current weather data
      endpoint: https://api.openweathermap.org/data/2.5/weather
      method: GET
      parameters:
        - name: q
          type: string
          description: City name
          required: true
        - name: appid
          type: string
          required: true
        - name: units
          type: string
          default: metric
      authentication:
        type: api_key
        key_location: query_parameter
        key_name: appid
      returns:
        type: object
        schema: WeatherResponse

  fragments:
    - name: weather_interpretation
      content: |
        Based on these conditions, here's what you should know:
        - Temperature feels like {{weather.feels_like}}°C
        - Humidity is {{weather.humidity}}%  
        - Visibility is {{weather.visibility}} meters
        
        Recommendations will be provided based on current conditions.
```

These examples demonstrate the flexibility and power of the PromptPack specification for building sophisticated conversational AI systems.