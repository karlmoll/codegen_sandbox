# CALM Sub-Component Specifications

This directory contains modular sub-component CALM specifications that are referenced by the main agentic AI reference architecture.

## Component Structure

The main architecture (`agentic-ai-reference-architecture.calm.json`) references these sub-components to enable:

1. **Modularity**: Components can be versioned and updated independently
2. **Reusability**: Components can be reused across multiple architectures
3. **Clarity**: Complex components have their own detailed specifications
4. **Maintainability**: Easier to maintain and update specific components

## Available Sub-Components

### 1. MCP Server Component (`mcp-server.calm.json`)
**Status**: Reference to existing specification

Detailed specification for Model Context Protocol (MCP) server implementation with:
- Tool discovery and invocation
- Resource access patterns
- Security controls
- Agent authorization

**Reference**: `../experimental-aigf-embedded-controls-enterprise-mcp-reference.calm.json`

### 2. Agent Communication Protocol (`agent-communication.calm.json`)
**Status**: To be created

Specification for agent-to-agent communication patterns including:
- Message formats and protocols
- Authentication between agents (SPIFFE/SPIRE)
- Coordination patterns
- Error handling

### 3. Knowledge Base Component (`knowledge-base.calm.json`)
**Status**: To be created

Detailed specification for knowledge management including:
- Vector database integration
- Embedding generation
- Data classification and filtering
- Access control per agent

## How to Use Sub-Components

### In Parent CALM Document

Reference sub-components in the metadata section:

```json
{
  "modularity": {
    "sub-components": [
      {
        "name": "MCP Server Component",
        "reference": "./components/mcp-server.calm.json",
        "description": "Model Context Protocol server for agent tool access"
      }
    ]
  }
}
```

### In Node Metadata

Reference sub-components directly in nodes:

```json
{
  "unique-id": "mcp-server",
  "node-type": "service",
  "metadata": {
    "sub-component-reference": "./components/mcp-server.calm.json"
  }
}
```

## Future Sub-Components

Potential future sub-components to add:

- **LLM Service Component**: Detailed LLM integration patterns
- **Observability Component**: Comprehensive monitoring setup
- **Human Approval Workflow**: Detailed human-in-the-loop patterns
- **Multi-Agent Coordination**: Advanced coordination patterns
- **Tool Authorization**: Detailed authorization policies

## Validation

Sub-component CALM specifications should:
- Follow FINOS CALM 1.0 schema
- Include embedded AIR governance metadata
- Reference back to parent architecture where applicable
- Be independently valid CALM documents
