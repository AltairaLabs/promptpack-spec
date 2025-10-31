---
sidebar_position: 2
---

# Arena Testing

Arena is a comprehensive testing platform for PromptPack specifications, enabling automated evaluation, A/B testing, and performance benchmarking of conversational AI systems.

## Overview

Arena provides a systematic approach to testing and validating PromptPack implementations across different scenarios, LLM providers, and performance criteria. It's designed to ensure reliability and quality in production deployments.

### Key Features

- **Automated Testing** - Run comprehensive test suites against PromptPacks
- **Multi-Provider Comparison** - Test across different LLM providers simultaneously  
- **Performance Benchmarking** - Measure response time, accuracy, and cost metrics
- **Regression Testing** - Detect changes in behavior across versions
- **A/B Testing** - Compare different prompt variations and configurations
- **Continuous Integration** - Integration with CI/CD pipelines

## Installation

### Using npm

```bash
npm install -g promptpack-arena
```

### Using pip

```bash
pip install promptpack-arena
```

### Docker

```bash
docker run -it altairalabs/promptpack-arena
```

## Quick Start

### Basic Testing

```bash
# Run all tests in a PromptPack
arena test my-assistant.promptpack.yml

# Run specific test suite
arena test my-assistant.promptpack.yml --suite regression

# Test against multiple providers
arena test my-assistant.promptpack.yml --providers openai,anthropic,ollama
```

### Generating Test Reports

```bash
# Generate HTML report
arena test my-assistant.promptpack.yml --report html --output results.html

# Generate JSON report for CI integration
arena test my-assistant.promptpack.yml --report json --output results.json

# Generate comprehensive report with benchmarks
arena test my-assistant.promptpack.yml --benchmark --report comprehensive
```

## Test Configuration

### Arena Configuration File

Create an `arena.config.yml` file:

```yaml
# Arena testing configuration
providers:
  openai:
    models: ["gpt-4", "gpt-3.5-turbo"]
    api_key: ${OPENAI_API_KEY}
  anthropic:
    models: ["claude-3-sonnet", "claude-3-haiku"]  
    api_key: ${ANTHROPIC_API_KEY}
  ollama:
    models: ["llama2", "mistral"]
    endpoint: http://localhost:11434

test_suites:
  smoke:
    description: "Quick validation tests"
    timeout: 30
    max_concurrent: 5
    
  regression:
    description: "Full regression testing"
    timeout: 120
    max_concurrent: 3
    baseline_comparison: true
    
  performance:
    description: "Performance benchmarking"
    iterations: 100
    metrics: [latency, throughput, cost]

reporting:
  formats: [html, json, junit]
  include_traces: true
  detailed_errors: true
```

## Writing Test Cases

### Inline Tests

Add tests directly to your PromptPack:

```yaml
spec:
  prompts:
    - name: customer_greeting
      template: |
        Hello {{customer.name}}, welcome to {{company.name}}!
        How can I assist you today?
      tests:
        - name: basic_greeting
          description: "Test basic greeting functionality"
          variables:
            customer:
              name: "John Smith"
            company:
              name: "Acme Corp"
          assertions:
            - type: contains
              value: "Hello John Smith"
            - type: contains  
              value: "Acme Corp"
            - type: length
              min: 20
              max: 200

        - name: tone_validation
          description: "Ensure professional and friendly tone"
          variables:
            customer:
              name: "Sarah Johnson"
            company:
              name: "Tech Solutions Inc"
          assertions:
            - type: sentiment
              expected: positive
            - type: tone
              expected: professional
            - type: no_profanity
```

### External Test Files

Create separate test files for complex scenarios:

```yaml
# tests/customer-support.test.yml
apiVersion: v1
kind: ArenaTestSuite
metadata:
  name: customer-support-tests
  promptpack: customer-support.promptpack.yml

spec:
  test_cases:
    - name: escalation_workflow
      description: "Test customer issue escalation flow"
      workflow: support_escalation
      scenarios:
        - name: technical_issue
          input: "My software keeps crashing when I try to save files"
          expected_path: [greeting, technical_assessment, solution_search, escalation]
          
        - name: billing_issue  
          input: "I was charged twice for my subscription"
          expected_path: [greeting, billing_assessment, refund_process]
          
    - name: sentiment_handling
      description: "Test handling of different customer emotions"
      prompt: customer_response
      scenarios:
        - name: angry_customer
          variables:
            customer_message: "This is ridiculous! Your service never works!"
          assertions:
            - type: tone
              expected: empathetic
            - type: de_escalation
              required: true
              
        - name: confused_customer
          variables:
            customer_message: "I don't understand how to use this feature"
          assertions:
            - type: clarity_score
              min: 0.8
            - type: helpful_tone
              required: true
```

## Test Types and Assertions

### Built-in Assertion Types

#### Text Analysis
```yaml
assertions:
  - type: contains
    value: "expected text"
    
  - type: matches
    pattern: "regex pattern"
    
  - type: length
    min: 10
    max: 500
    
  - type: word_count
    min: 5
    max: 100
```

#### Semantic Analysis
```yaml
assertions:
  - type: sentiment
    expected: positive  # positive, negative, neutral
    threshold: 0.7
    
  - type: tone
    expected: professional  # professional, casual, friendly, etc.
    
  - type: similarity
    reference: "expected meaning"
    threshold: 0.85
    
  - type: topic_relevance
    topics: ["customer service", "technical support"]
    min_score: 0.8
```

#### Workflow Validation
```yaml
assertions:
  - type: workflow_path
    expected: [step1, step2, step3]
    
  - type: tool_calls
    expected: ["search_knowledge", "create_ticket"]
    
  - type: state_transitions
    from: initial
    to: resolved
```

### Performance Assertions
```yaml
assertions:
  - type: response_time
    max_ms: 2000
    
  - type: token_usage
    max_tokens: 1000
    
  - type: cost
    max_usd: 0.05
```

## A/B Testing

### Comparing Prompt Variations

```yaml
# ab-test-config.yml
apiVersion: v1
kind: ArenaABTest
metadata:
  name: greeting_variations
  
spec:
  variants:
    - name: formal_greeting
      promptpack: formal-assistant.promptpack.yml
      traffic_split: 0.5
      
    - name: casual_greeting  
      promptpack: casual-assistant.promptpack.yml
      traffic_split: 0.5
      
  success_metrics:
    - user_satisfaction_score
    - conversation_length
    - task_completion_rate
    
  test_inputs:
    - "Hello, I need help with my account"
    - "Can you help me understand this feature?"
    - "I'm having trouble with the login process"
    
  duration: 7d
  statistical_power: 0.8
```

Run A/B test:

```bash
# Start A/B test
arena ab-test greeting_variations.yml --start

# Check results
arena ab-test greeting_variations.yml --results

# Stop test early if significant
arena ab-test greeting_variations.yml --stop
```

## Performance Benchmarking

### Benchmark Configuration

```yaml
# benchmark.config.yml
benchmark:
  scenarios:
    - name: high_load
      concurrent_users: 100
      requests_per_second: 50
      duration: 300s  # 5 minutes
      
    - name: burst_traffic
      concurrent_users: 500  
      ramp_up: 30s
      hold: 60s
      ramp_down: 30s
      
  metrics:
    - response_time_p95
    - throughput
    - error_rate
    - cost_per_request
    
  providers:
    - openai
    - anthropic
    - azure_openai
```

Run benchmarks:

```bash
# Run performance benchmark
arena benchmark my-assistant.promptpack.yml --config benchmark.config.yml

# Compare providers
arena benchmark my-assistant.promptpack.yml --compare-providers

# Load test specific endpoint
arena benchmark my-assistant.promptpack.yml --load-test --target http://localhost:8000
```

## Continuous Integration

### GitHub Actions Integration

```yaml
# .github/workflows/promptpack-tests.yml
name: PromptPack Tests
on:
  pull_request:
    paths: ['**/*.promptpack.yml']
    
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install Arena
        run: npm install -g promptpack-arena
        
      - name: Run PromptPack Tests
        run: arena test **/*.promptpack.yml --report junit --output test-results.xml
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          
      - name: Publish Test Results
        uses: dorny/test-reporter@v1
        if: always()
        with:
          name: Arena Test Results
          path: test-results.xml
          reporter: java-junit
```

### Jenkins Pipeline

```groovy
// Jenkinsfile
pipeline {
    agent any
    
    environment {
        OPENAI_API_KEY = credentials('openai-api-key')
        ANTHROPIC_API_KEY = credentials('anthropic-api-key')
    }
    
    stages {
        stage('Test PromptPacks') {
            steps {
                sh 'npm install -g promptpack-arena'
                sh 'arena test **/*.promptpack.yml --report json --output results.json'
            }
            post {
                always {
                    publishTestResults testResultsPattern: 'results.json'
                }
            }
        }
        
        stage('Performance Regression') {
            when {
                branch 'main'  
            }
            steps {
                sh 'arena test **/*.promptpack.yml --suite performance --baseline-comparison'
            }
        }
    }
}
```

## Monitoring and Alerts

### Quality Gates

```yaml
# quality-gates.yml
gates:
  - name: accuracy_threshold
    metric: assertion_pass_rate
    threshold: 0.95
    action: fail_build
    
  - name: performance_regression  
    metric: response_time_p95
    max_degradation: 0.2  # 20% slower than baseline
    action: warn
    
  - name: cost_control
    metric: cost_per_request
    max_cost: 0.10  # $0.10 per request
    action: fail_build
```

### Integration with Monitoring Tools

```yaml
# monitoring.config.yml
integrations:
  datadog:
    api_key: ${DATADOG_API_KEY}
    metrics:
      - test_pass_rate
      - response_times
      - error_counts
      
  prometheus:
    endpoint: http://prometheus:9090
    job_name: promptpack_arena
    
  slack:
    webhook_url: ${SLACK_WEBHOOK}
    channels:
      - "#ai-quality"
      - "#alerts"
```

## Best Practices

### Test Organization

- **Separate concerns** - Different test files for functionality vs. performance
- **Use descriptive names** - Clear test case and assertion names
- **Version control tests** - Commit test files with PromptPack changes
- **Baseline management** - Maintain performance baselines for regression testing

### Coverage Strategy

- **Functional coverage** - Test all prompts, tools, and workflows
- **Edge case testing** - Test with invalid/boundary inputs
- **Provider coverage** - Test across different LLM providers  
- **Performance testing** - Regular performance regression testing

### Maintenance

- **Regular updates** - Update test cases as requirements change
- **Baseline refresh** - Periodically update performance baselines
- **Test cleanup** - Remove obsolete tests and update assertions
- **Documentation** - Document test intent and expected behaviors