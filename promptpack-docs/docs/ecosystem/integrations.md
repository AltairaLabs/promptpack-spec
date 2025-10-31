---
sidebar_position: 3
---

# Integrations

The PromptPack ecosystem includes integrations with popular development tools, LLM providers, and frameworks to enable seamless adoption and deployment.

## LLM Provider Integrations

### OpenAI

Official integration for OpenAI's GPT models.

**Features:**
- Complete ChatGPT and GPT-4 model support
- Function calling with PromptPack tools
- Streaming responses
- Token usage tracking and cost optimization

**Configuration:**
```yaml
providers:
  openai:
    api_key: ${OPENAI_API_KEY}
    organization: ${OPENAI_ORG_ID}  # Optional
    models:
      - gpt-4
      - gpt-3.5-turbo
    default_model: gpt-4
    max_tokens: 4096
    temperature: 0.7
```

### Anthropic

Native support for Claude models with advanced safety features.

**Features:**
- Claude 3 model family support
- Constitutional AI alignment
- Large context windows (up to 200K tokens)
- Advanced reasoning capabilities

**Configuration:**
```yaml
providers:
  anthropic:
    api_key: ${ANTHROPIC_API_KEY}
    models:
      - claude-3-opus
      - claude-3-sonnet  
      - claude-3-haiku
    default_model: claude-3-sonnet
    max_tokens: 4096
```

### Azure OpenAI

Enterprise-grade OpenAI integration through Microsoft Azure.

**Features:**
- Enterprise security and compliance
- Regional deployment options
- Private networking support
- Advanced monitoring and logging

**Configuration:**
```yaml
providers:
  azure_openai:
    endpoint: ${AZURE_OPENAI_ENDPOINT}
    api_key: ${AZURE_OPENAI_KEY}
    api_version: "2024-02-15-preview"
    deployments:
      gpt-4: "gpt-4-deployment-name"
      gpt-35-turbo: "gpt-35-turbo-deployment-name"
```

### Ollama

Local and self-hosted model support through Ollama.

**Features:**
- Local model execution
- Privacy and data control
- Custom model support
- No API key required

**Configuration:**
```yaml
providers:
  ollama:
    endpoint: http://localhost:11434
    models:
      - llama2
      - mistral
      - codellama
    default_model: llama2
```

### Google AI (Gemini)

Integration with Google's Gemini models.

**Configuration:**
```yaml
providers:
  google:
    api_key: ${GOOGLE_AI_API_KEY}
    models:
      - gemini-pro
      - gemini-pro-vision
    default_model: gemini-pro
```

## Framework Integrations

### LangChain

Use PromptPacks within LangChain applications.

**Installation:**
```bash
pip install promptpack-langchain
```

**Usage:**
```python
from langchain.llms import PromptPackLLM
from promptpack_langchain import PromptPackChain

# Create LangChain compatible LLM
llm = PromptPackLLM(promptpack_file="assistant.promptpack.yml")

# Create chain with PromptPack prompts
chain = PromptPackChain.from_promptpack(
    promptpack_file="assistant.promptpack.yml",
    prompt_name="question_answering",
    llm=llm
)

# Execute chain
result = chain.run(question="What is artificial intelligence?")
```

### LlamaIndex

Integrate PromptPacks with LlamaIndex for RAG applications.

**Installation:**
```bash
pip install promptpack-llamaindex
```

**Usage:**
```python
from llama_index import VectorStoreIndex
from promptpack_llamaindex import PromptPackServiceContext

# Create service context with PromptPack
service_context = PromptPackServiceContext.from_promptpack(
    "rag-assistant.promptpack.yml"
)

# Create index with PromptPack context
index = VectorStoreIndex.from_documents(
    documents,
    service_context=service_context
)

# Query with custom prompts from PromptPack
response = index.query(
    "What are the key benefits of renewable energy?",
    prompt_name="detailed_analysis"
)
```

### Haystack

Use PromptPacks in Haystack NLP pipelines.

**Installation:**
```bash
pip install promptpack-haystack
```

**Usage:**
```python
from haystack import Pipeline
from promptpack_haystack import PromptPackNode

# Create PromptPack node
promptpack_node = PromptPackNode(
    promptpack_file="qa-system.promptpack.yml",
    prompt_name="answer_generation"
)

# Add to pipeline
pipeline = Pipeline()
pipeline.add_node(component=promptpack_node, name="PromptPack", inputs=["Query"])

# Run pipeline
result = pipeline.run(query="How do solar panels work?")
```

## Development Tool Integrations

### VS Code Extension

Official VS Code extension for PromptPack development.

**Features:**
- Syntax highlighting for `.promptpack.yml` files
- Schema validation and autocomplete
- Live preview and testing
- Integrated documentation

**Installation:**
```bash
code --install-extension altairalabs.promptpack
```

**Features:**
- IntelliSense for PromptPack schemas
- Validation on save
- Snippet templates for common patterns
- Integrated terminal commands

### GitHub Actions

Pre-built actions for CI/CD pipelines.

**Validation Action:**
```yaml
# .github/workflows/validate.yml
name: Validate PromptPacks
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: altairalabs/promptpack-validate-action@v1
        with:
          files: "**/*.promptpack.yml"
```

**Testing Action:**
```yaml
# .github/workflows/test.yml  
name: Test PromptPacks
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: altairalabs/promptpack-test-action@v1
        with:
          files: "**/*.promptpack.yml"
          providers: "openai,anthropic"
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

### Docker Images

Official Docker images for different use cases.

**Runtime Image:**
```dockerfile
FROM altairalabs/promptpack:runtime
COPY my-assistant.promptpack.yml /app/
EXPOSE 8000
CMD ["promptkit", "serve", "/app/my-assistant.promptpack.yml"]
```

**Development Image:**
```dockerfile  
FROM altairalabs/promptpack:dev
WORKDIR /workspace
# Includes validation tools, testing framework, and development utilities
```

## Cloud Platform Integrations

### AWS

Deploy PromptPacks on AWS infrastructure.

**Lambda Function:**
```python
# AWS Lambda handler
import json
from promptkit import PromptPackRunner

runner = PromptPackRunner("s3://my-bucket/assistant.promptpack.yml")

def lambda_handler(event, context):
    result = runner.execute_prompt(
        prompt_name=event['prompt'],
        variables=event['variables']
    )
    
    return {
        'statusCode': 200,
        'body': json.dumps(result)
    }
```

**ECS Service:**
```yaml
# ecs-task-definition.json
{
  "family": "promptpack-service",
  "taskRoleArn": "arn:aws:iam::account:role/PromptPackTaskRole",
  "containerDefinitions": [
    {
      "name": "promptpack",
      "image": "altairalabs/promptpack:latest",
      "memory": 512,
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "PROMPTPACK_FILE",
          "value": "s3://my-bucket/assistant.promptpack.yml"
        }
      ]
    }
  ]
}
```

### Google Cloud Platform

**Cloud Run Deployment:**
```yaml
# cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/promptpack-service', '.']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/promptpack-service']
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args: 
      - 'run'
      - 'deploy'
      - 'promptpack-service'
      - '--image'
      - 'gcr.io/$PROJECT_ID/promptpack-service'
      - '--region'
      - 'us-central1'
      - '--allow-unauthenticated'
```

**Cloud Functions:**
```python
# main.py for Google Cloud Functions
import functions_framework
from promptkit import PromptPackRunner

runner = PromptPackRunner("gs://my-bucket/assistant.promptpack.yml")

@functions_framework.http
def promptpack_endpoint(request):
    request_json = request.get_json()
    
    result = runner.execute_prompt(
        prompt_name=request_json['prompt'],
        variables=request_json['variables']
    )
    
    return result
```

### Microsoft Azure

**Azure Functions:**
```python
# __init__.py for Azure Functions
import azure.functions as func
from promptkit import PromptPackRunner

runner = PromptPackRunner("https://mystorageaccount.blob.core.windows.net/promptpacks/assistant.promptpack.yml")

def main(req: func.HttpRequest) -> func.HttpResponse:
    req_body = req.get_json()
    
    result = runner.execute_prompt(
        prompt_name=req_body['prompt'],
        variables=req_body['variables']
    )
    
    return func.HttpResponse(
        json.dumps(result),
        mimetype="application/json"
    )
```

## API Integration Tools

### REST API Generator

Automatically generate REST APIs from PromptPacks.

**Usage:**
```bash
# Generate OpenAPI specification
promptkit generate-api my-assistant.promptpack.yml --output openapi.yml

# Generate REST service  
promptkit generate-service my-assistant.promptpack.yml --framework fastapi
```

**Generated FastAPI Service:**
```python
# Generated service code
from fastapi import FastAPI
from promptkit import PromptPackRunner

app = FastAPI()
runner = PromptPackRunner("my-assistant.promptpack.yml")

@app.post("/prompts/{prompt_name}")
async def execute_prompt(prompt_name: str, variables: dict):
    return runner.execute_prompt(prompt_name, variables)

@app.post("/workflows/{workflow_name}")  
async def run_workflow(workflow_name: str, input_data: dict):
    return runner.run_workflow(workflow_name, input_data)
```

### GraphQL Integration

```bash
# Generate GraphQL schema
promptkit generate-graphql my-assistant.promptpack.yml --output schema.graphql
```

**Generated Schema:**
```graphql
type Query {
  executePrompt(name: String!, variables: JSON): PromptResult
  runWorkflow(name: String!, input: JSON): WorkflowResult
}

type PromptResult {
  content: String!
  metadata: JSON
  usage: TokenUsage
}
```

## Monitoring Integrations

### Observability Platforms

**Datadog Integration:**
```yaml
# promptpack-datadog.yml
integrations:
  datadog:
    api_key: ${DATADOG_API_KEY}
    metrics:
      - prompt_execution_time
      - token_usage
      - error_rates
      - cost_tracking
    logs:
      - prompt_inputs
      - responses
      - errors
    traces:
      - workflow_execution
      - tool_calls
```

**New Relic Integration:**
```python
# New Relic instrumentation
import newrelic.agent
from promptkit import PromptPackRunner

class InstrumentedRunner(PromptPackRunner):
    @newrelic.agent.function_trace()
    def execute_prompt(self, prompt_name, variables):
        with newrelic.agent.FunctionTrace('promptpack.execute_prompt'):
            return super().execute_prompt(prompt_name, variables)
```

## Community Integrations

### Open Source Projects

- **promptpack-jupyter** - Jupyter notebook integration
- **promptpack-streamlit** - Streamlit app framework
- **promptpack-gradio** - Gradio interface generator
- **promptpack-discord** - Discord bot framework
- **promptpack-slack** - Slack app integration

### Third-Party Tools

- **Zapier Integration** - No-code workflow automation
- **Make.com** - Visual workflow builder
- **n8n** - Self-hosted automation platform
- **Retool** - Internal app builder with PromptPack widgets

## Contributing Integrations

To contribute a new integration:

1. **Follow the Integration Guidelines** - Use standard patterns and conventions
2. **Provide Documentation** - Include setup, usage, and examples
3. **Add Tests** - Comprehensive test coverage required
4. **Submit PR** - Follow the standard contribution process
5. **Maintain Compatibility** - Keep integration updated with specification changes

### Integration Template

```python
# promptpack-{integration}.py template
class PromptPackIntegration:
    def __init__(self, promptpack_file: str, **kwargs):
        self.runner = PromptPackRunner(promptpack_file)
        # Integration-specific initialization
        
    def integrate(self):
        # Integration-specific logic
        pass
        
    def cleanup(self):
        # Cleanup resources
        pass
```