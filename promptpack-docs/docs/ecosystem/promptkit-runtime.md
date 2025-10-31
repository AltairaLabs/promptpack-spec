---
sidebar_position: 1
---

# PromptKit Runtime

PromptKit is the reference implementation for running PromptPack specifications. It provides a complete runtime environment for executing prompts, tools, workflows, and personas.

## Overview

PromptKit serves as both a reference implementation and a production-ready runtime for PromptPack files. It demonstrates how to properly interpret the specification while providing a robust platform for building conversational AI applications.

### Key Features

- **Full PromptPack Support** - Implements the complete v1 specification
- **Multi-LLM Backend** - Works with OpenAI, Anthropic, Ollama, and more
- **Tool Integration** - Native support for external APIs and functions  
- **Workflow Orchestration** - State management and complex conversation flows
- **Persona System** - Consistent personality and behavioral enforcement
- **Testing Framework** - Built-in validation and testing capabilities

## Installation

### Using npm

```bash
npm install -g promptkit
```

### Using pip

```bash
pip install promptkit
```

### Docker

```bash
docker run -it altairalabs/promptkit
```

## Quick Start

### Running a PromptPack

```bash
# Run a PromptPack file
promptkit run my-assistant.promptpack.yml

# Run with specific input
promptkit run my-assistant.promptpack.yml --input "Hello, how are you?"

# Run with custom LLM provider
promptkit run my-assistant.promptpack.yml --provider openai --model gpt-4
```

### Interactive Mode

```bash
# Start interactive chat session
promptkit chat my-assistant.promptpack.yml

# Load and chat with specific persona
promptkit chat my-assistant.promptpack.yml --persona helpful_expert
```

### Validation

```bash
# Validate PromptPack syntax and schema
promptkit validate my-assistant.promptpack.yml

# Run built-in tests
promptkit test my-assistant.promptpack.yml

# Generate test report
promptkit test my-assistant.promptpack.yml --report html
```

## Configuration

### Provider Setup

Configure your LLM providers:

```yaml
# ~/.promptkit/config.yml
providers:
  openai:
    api_key: your-api-key
    default_model: gpt-4
  anthropic:
    api_key: your-api-key  
    default_model: claude-3-sonnet
  ollama:
    endpoint: http://localhost:11434
    default_model: llama2
```

### Runtime Options

```yaml
# promptkit.config.yml in your project
runtime:
  max_tokens: 4096
  temperature: 0.7
  timeout: 30
  
logging:
  level: info
  format: json
  
tools:
  timeout: 10
  retry_attempts: 3
```

## API Usage

### Python API

```python
from promptkit import PromptPackRunner

# Load and run a PromptPack
runner = PromptPackRunner("my-assistant.promptpack.yml")

# Execute a prompt
result = runner.execute_prompt(
    prompt_name="greeting",
    variables={"user_name": "Alice"}
)

# Run a workflow
workflow_result = runner.run_workflow(
    workflow_name="customer_support",
    initial_input="I need help with my account"
)

# Chat session
session = runner.create_session()
response = session.chat("Hello, how can you help me?")
```

### JavaScript API

```javascript
const { PromptPackRunner } = require('promptkit');

// Load PromptPack
const runner = new PromptPackRunner('my-assistant.promptpack.yml');

// Execute prompt
const result = await runner.executePrompt('greeting', {
  user_name: 'Alice'
});

// Stream responses
const stream = runner.streamPrompt('conversation', {
  message: 'Tell me about AI'
});

for await (const chunk of stream) {
  console.log(chunk.content);
}
```

### REST API

Start the PromptKit server:

```bash
promptkit serve my-assistant.promptpack.yml --port 8000
```

Make API calls:

```bash
# Execute a prompt
curl -X POST http://localhost:8000/prompts/greeting \
  -H "Content-Type: application/json" \
  -d '{"variables": {"user_name": "Alice"}}'

# Run a workflow  
curl -X POST http://localhost:8000/workflows/support_flow \
  -H "Content-Type: application/json" \
  -d '{"input": "I need help"}'

# Chat session
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "session_id": "user123"}'
```

## Advanced Features

### Custom Tools

Register custom tools at runtime:

```python
from promptkit.tools import Tool

@Tool.register("my_custom_tool")
def calculate_score(data: dict) -> float:
    """Calculate a custom score based on input data"""
    return sum(data.values()) / len(data.values())

# Tool is now available in PromptPacks as "my_custom_tool"
```

### Middleware

Add custom processing middleware:

```python
from promptkit.middleware import Middleware

class LoggingMiddleware(Middleware):
    def before_prompt(self, prompt_name, variables):
        print(f"Executing prompt: {prompt_name}")
        
    def after_prompt(self, prompt_name, result):
        print(f"Prompt result: {result}")

runner.add_middleware(LoggingMiddleware())
```

### Custom Providers

Add support for new LLM providers:

```python
from promptkit.providers import LLMProvider

class CustomLLMProvider(LLMProvider):
    def generate(self, prompt: str, **kwargs) -> str:
        # Your custom LLM integration
        return self.call_custom_api(prompt, **kwargs)

runner.register_provider("custom", CustomLLMProvider())
```

## Testing and Validation

### Built-in Test Runner

```bash
# Run all tests in a PromptPack
promptkit test my-assistant.promptpack.yml

# Run specific test cases
promptkit test my-assistant.promptpack.yml --test greeting_test

# Generate coverage report
promptkit test my-assistant.promptpack.yml --coverage
```

### Writing Tests

Add tests directly in your PromptPack:

```yaml
spec:
  prompts:
    - name: greeting
      template: "Hello {{name}}!"
      tests:
        - name: basic_greeting
          variables:
            name: "World"
          expected:
            contains: "Hello World!"
        - name: custom_name
          variables:
            name: "Alice"
          expected:
            matches: "Hello Alice!"
```

## Performance and Scaling

### Caching

```python
# Enable response caching
runner = PromptPackRunner(
    "my-assistant.promptpack.yml",
    cache_enabled=True,
    cache_ttl=3600  # 1 hour
)
```

### Batch Processing

```python
# Process multiple inputs efficiently
inputs = [
    {"name": "Alice", "question": "What is AI?"},
    {"name": "Bob", "question": "How does ML work?"}
]

results = runner.batch_execute("qa_prompt", inputs)
```

### Load Balancing

```yaml
# Configure multiple LLM endpoints
providers:
  openai:
    endpoints:
      - api_key: key1
        weight: 0.7
      - api_key: key2  
        weight: 0.3
    load_balance: round_robin
```

## Deployment

### Production Deployment

```dockerfile
# Dockerfile
FROM altairalabs/promptkit:latest

COPY my-assistant.promptpack.yml /app/
COPY promptkit.config.yml /app/

EXPOSE 8000
CMD ["promptkit", "serve", "/app/my-assistant.promptpack.yml", "--host", "0.0.0.0"]
```

### Kubernetes

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: promptkit-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: promptkit
  template:
    metadata:
      labels:
        app: promptkit
    spec:
      containers:
      - name: promptkit
        image: altairalabs/promptkit:latest
        ports:
        - containerPort: 8000
        env:
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: llm-keys
              key: openai
```

## Community and Support

- **Documentation** - [promptkit.org](https://promptkit.org)
- **GitHub** - [github.com/altairalabs/promptkit](https://github.com/altairalabs/promptkit)
- **Discord** - Join our community Discord server
- **Issues** - Report bugs and request features on GitHub