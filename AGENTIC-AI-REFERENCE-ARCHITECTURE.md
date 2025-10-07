# FINOS Agentic AI Reference Architecture with AIR Governance

## Overview

This document describes a **flexible, high-level reference architecture** for agentic AI systems with embedded **FINOS AIR (AI Readiness) Governance Framework** controls. The architecture is designed to support arbitrary technology stack implementations and multi-agent coordination patterns.

## Document Structure

This is a **multi-document CALM specification** with:

- **Main Architecture**: `agentic-ai-reference-architecture.calm.json`
- **Sub-Components**: Modular specifications in `components/` directory
  - MCP Server Component
  - Agent Communication Protocol (future)
  - Knowledge Base Component (future)

## Architecture Principles

### 1. **Flexibility**
- **Tech-Stack Agnostic**: Supports multiple frameworks (LangChain, AutoGen, CrewAI, custom)
- **Deployment Agnostic**: Cloud, on-premise, hybrid deployments
- **LLM Provider Agnostic**: Works with OpenAI, Anthropic, AWS Bedrock, Azure OpenAI, self-hosted models

### 2. **Modularity**
- **Sub-Component References**: Complex components have dedicated CALM specs
- **Independent Versioning**: Components can evolve independently
- **Reusability**: Components can be reused across architectures

### 3. **AI Governance First**
- **Embedded AIR Controls**: FINOS AIR governance at every layer
- **Threat-Aware**: Addresses agentic-specific threats (autonomy, coordination, tool misuse)
- **Compliance-Ready**: Designed for regulatory compliance (EU AI Act, etc.)

## Architecture Layers

### Layer 1: Human Interface
**Components**: Human Interface, API Gateway, Auth Service

**Purpose**: Secure entry point for human users

**AIR Controls**:
- AIR-PREV-003: Input firewalling and filtering
- AIR-PREV-012: User authentication and authorization

---

### Layer 2: AI Gateway & Orchestration
**Components**: AI Gateway, Agent Orchestrator, Coordination Service

**Purpose**: Central coordination and security gateway for agentic workloads

**Key Features**:
- Prompt injection protection
- Agent workflow management
- Multi-agent coordination
- Circuit breakers for safety

**AIR Controls**:
- AIR-PREV-003: AI firewall
- AIR-PREV-013: Agent autonomy limits
- AIR-PREV-014: Human-in-the-loop checkpoints
- AIR-DET-007: Anomaly detection
- AIR-CORR-001: Incident response

---

### Layer 3: Agent Layer
**Components**: Planning Agent, Execution Agent, Validation Agent

**Purpose**: Specialized agents for different aspects of task completion

#### Planning Agent
- **Role**: Task decomposition and strategy generation
- **Threats**: Hallucinations, prompt injection
- **Controls**: Observability, audit logging

#### Execution Agent
- **Role**: Task execution with tool access via MCP
- **Threats**: Tool misuse, privilege escalation, autonomy loss
- **Controls**: Tool authorization, human approval, autonomy limits

#### Validation Agent
- **Role**: Output validation and quality assurance
- **Threats**: Hallucination detection failures
- **Controls**: Cross-validation, fact-checking

---

### Layer 4: Tool & Resource Access
**Components**: MCP Server, Tool Authorization Service

**Purpose**: Standardized, secure tool access for agents

**MCP (Model Context Protocol)**:
- Tool discovery and invocation
- Resource access
- Standardized agent-to-tool interface
- See detailed spec: `components/mcp-server.calm.json`

**AIR Controls**:
- AIR-PREV-012: Fine-grained tool RBAC
- AIR-PREV-013: Tool usage limits
- AIR-DET-005: Tool call audit logging

---

### Layer 5: Knowledge & Intelligence
**Components**: LLM Service, Vector Database, Knowledge Base, Embedding Service

**Purpose**: AI intelligence and contextual knowledge

**Flexibility**:
- **LLM**: Any provider (OpenAI, Anthropic, Azure, AWS, self-hosted)
- **Vector DB**: Pinecone, Weaviate, Chroma, pgvector, etc.
- **Embeddings**: OpenAI, Cohere, sentence-transformers, custom

**AIR Controls**:
- AIR-PREV-002: Data filtering and sanitization
- AIR-SEC-002: Vector store information leakage prevention
- AIR-DET-004: Model performance monitoring

---

### Layer 6: Governance & Observability
**Components**: Observability Platform, Audit Service, Human Approval Service

**Purpose**: Comprehensive monitoring, audit, and human oversight

**Capabilities**:
- Real-time agent behavior monitoring
- Immutable audit trails
- Human approval workflows
- Anomaly detection
- Circuit breakers

**AIR Controls**:
- AIR-DET-004: AI System Observability
- AIR-DET-005: Audit Trail
- AIR-DET-007: Behavior Anomaly Detection
- AIR-PREV-014: Human-in-the-Loop

---

## Key Architectural Patterns

### Pattern 1: Agent-to-Agent Communication

Agents can communicate directly with proper authentication and audit:

```
Planning Agent → (mTLS + SPIFFE) → Execution Agent
            ↓
    [Audit Logging + Observability]
```

**AIR Controls**: AIR-DET-005, AIR-DET-007

---

### Pattern 2: Human-in-the-Loop Approval

High-risk actions require human approval:

```
Agent → [Risk Assessment] → Human Approval Service
                                    ↓
                            [Timeout: 5m] → [Escalation]
                                    ↓
                            [Approved] → Execute
```

**AIR Controls**: AIR-PREV-014, AIR-DET-005

---

### Pattern 3: Multi-Agent Coordination

Coordinated workflows with deadlock prevention:

```
Orchestrator → Coordination Service
        ↓              ↓
   Agent 1       [Conflict Resolution]
   Agent 2       [Resource Allocation]
   Agent 3       [Deadlock Detection]
```

**AIR Controls**: AIR-DET-007, AIR-OP-021, AIR-OP-022

---

### Pattern 4: Tool Access via MCP

Standardized, secure tool access:

```
Execution Agent → MCP Server → Tool Authorization → [Tool Execution]
        ↓                              ↓
    [Audit Log]              [Policy Check (OPA/Cedar)]
```

**AIR Controls**: AIR-PREV-012, AIR-PREV-013, AIR-DET-005

---

## FINOS AIR Governance Framework Integration

### Threat Coverage

The architecture addresses **9 primary threats**:

| Threat ID | Name | Agentic Context | Severity |
|-----------|------|-----------------|----------|
| AIR-OP-004 | Hallucination and Inaccurate Outputs | Multi-agent amplification | Critical |
| AIR-SEC-010 | Prompt Injection | Multiple injection surfaces | High |
| AIR-SEC-002 | Information Leaked to Vector Store | Shared knowledge bases | Critical |
| AIR-SEC-001 | Data Poisoning | Tool responses and knowledge | High |
| AIR-OP-020 | Reputational Risk | Agent failures in production | High |
| AIR-SEC-009 | Agent Autonomy and Control Loss | Unintended autonomous actions | Critical |
| AIR-OP-015 | Model Drift | Agent performance degradation | High |
| AIR-SEC-011 | Tool Misuse and Privilege Escalation | Agent tool access | High |
| AIR-OP-021 | Agent Coordination Failures | Multi-agent deadlocks | Medium |

### Control Implementation

The architecture implements **10 controls**:

#### Preventative (6)
- **AIR-PREV-001**: AI System Risk Assessment
- **AIR-PREV-002**: Data Filtering
- **AIR-PREV-003**: AI Firewalling
- **AIR-PREV-012**: Role-Based Access Control
- **AIR-PREV-013**: Agent Autonomy Limits ⭐ *Agentic-Specific*
- **AIR-PREV-014**: Human-in-the-Loop Checkpoints ⭐ *Agentic-Specific*

#### Detective (3)
- **AIR-DET-004**: AI System Observability
- **AIR-DET-005**: AI System Audit Trail
- **AIR-DET-007**: Agent Behavior Anomaly Detection ⭐ *Agentic-Specific*

#### Corrective (1)
- **AIR-CORR-001**: AI System Incident Response (with agent circuit breakers)

---

## Autonomy Levels

The architecture supports configurable agent autonomy levels:

| Level | Description | Human Involvement | Use Cases |
|-------|-------------|-------------------|-----------|
| **Level 0** | No autonomy | Every action requires approval | High-risk financial transactions |
| **Level 1** | Suggest only | Recommends actions for approval | Advisory systems |
| **Level 2** | Bounded execution | Executes within defined bounds | Customer service, data analysis |
| **Level 3** | Full autonomy | Operates independently | Monitoring, routine tasks |

**AIR Control**: AIR-PREV-013 (Agent Autonomy Limits)

---

## Technology Stack Examples

### Example 1: LangChain + Azure OpenAI

```
- Agent Framework: LangChain + LangGraph
- LLM: Azure OpenAI (GPT-4)
- Vector DB: Azure AI Search
- MCP: Custom MCP server
- Observability: Azure Monitor
- Auth: Azure AD (Entra ID)
```

### Example 2: AutoGen + AWS Bedrock

```
- Agent Framework: Microsoft AutoGen
- LLM: AWS Bedrock (Claude 3)
- Vector DB: pgvector on RDS
- MCP: Community MCP servers
- Observability: CloudWatch + Datadog
- Auth: AWS IAM + Cognito
```

### Example 3: Custom + Self-Hosted

```
- Agent Framework: Custom (Go/Python)
- LLM: Self-hosted Llama 3
- Vector DB: Weaviate
- MCP: Custom MCP implementation
- Observability: Prometheus + Grafana
- Auth: Keycloak + SPIFFE/SPIRE
```

---

## Multi-Document CALM Structure

### Main Architecture
**File**: `agentic-ai-reference-architecture.calm.json`

**Purpose**: High-level reference architecture

**Contains**:
- 18 nodes (agents, services, datastores)
- 18 relationships (with AIR metadata)
- 3 end-to-end flows
- 10 CALM controls
- References to sub-components

### Sub-Components

#### 1. MCP Server Component
**File**: `components/mcp-server.calm.json`

**Purpose**: Detailed MCP server specification

**Contains**:
- MCP protocol implementation details
- Tool authorization patterns
- Security controls
- OAuth 2.1 + OIDC integration

**Usage**: Referenced by `execution-agent` and `mcp-server` nodes

#### 2. Agent Communication Protocol (Future)
**File**: `components/agent-communication.calm.json`

**Purpose**: Agent-to-agent communication patterns

**Will Contain**:
- Message formats
- SPIFFE/SPIRE authentication
- Coordination protocols
- Error handling

#### 3. Knowledge Base Component (Future)
**File**: `components/knowledge-base.calm.json`

**Purpose**: Knowledge management and RAG

**Will Contain**:
- Vector database patterns
- Embedding strategies
- Data classification
- Access control per agent

---

## Deployment Patterns

### Pattern 1: Cloud-Native (Kubernetes)

```
- Agents: Kubernetes pods with SPIFFE/SPIRE
- LLM: API calls to cloud provider
- Vector DB: Managed service (Pinecone, Azure AI Search)
- Observability: Cloud-native (Datadog, CloudWatch)
- Scaling: Horizontal pod autoscaling
```

### Pattern 2: Hybrid (On-Prem + Cloud)

```
- Agents: On-premise VMs
- LLM: Cloud API (with private endpoint)
- Vector DB: On-premise (Weaviate)
- Observability: Hybrid (Grafana + Cloud)
- Data: Remains on-premise
```

### Pattern 3: Air-Gapped (Fully On-Prem)

```
- Agents: On-premise infrastructure
- LLM: Self-hosted models
- Vector DB: On-premise (Chroma, pgvector)
- Observability: On-premise (Prometheus + Grafana)
- No external connectivity
```

---

## Security Architecture

### Authentication Flow

```
1. Human → OAuth 2.1 + PKCE → Auth Service → JWT
2. Agent → SPIFFE/SPIRE → mTLS + JWT → Agent Auth
3. Tool → MCP Server → Tool Authorization Service → ABAC Policy
```

### Authorization Layers

1. **API Gateway**: Coarse-grained (user-level)
2. **AI Gateway**: AI-specific (agent-level)
3. **Agent Orchestrator**: Workflow-level
4. **Tool Authorization**: Fine-grained (tool-level)

### Audit Trail

All actions logged with:
- Agent identity (SPIFFE ID)
- Timestamp
- Action type
- Input/output (with PII redaction)
- Decision reasoning
- Human approval status

**Retention**: 7 years (configurable for compliance)

---

## Observability Architecture

### Metrics
- Agent invocations
- Tool usage and costs
- Token consumption
- Error rates
- Latency (p50, p95, p99)
- Coordination conflicts

### Traces
- Distributed tracing across agents
- Agent chain visualization
- Tool call tracking
- Human approval flow tracking

### Logs
- Structured JSON logs
- Agent reasoning logs
- Decision audit logs
- Error and exception logs

### Alerts
- Hallucination rate thresholds
- Agent behavior anomalies
- Cost thresholds
- Error rate spikes
- Circuit breaker triggers

---

## Compliance Considerations

### EU AI Act (High-Risk AI Systems)

**Requirements Met**:
- ✅ Risk assessment (AIR-PREV-001)
- ✅ Data governance (AIR-PREV-002)
- ✅ Transparency and explainability
- ✅ Human oversight (AIR-PREV-014)
- ✅ Accuracy and robustness
- ✅ Cybersecurity
- ✅ Record-keeping (AIR-DET-005)

### Financial Services Regulations

**Applicable for**:
- Trading algorithms
- Credit decisions
- Fraud detection
- Customer service
- Risk assessment

**Controls**:
- Model validation (AIR-PREV-001)
- Audit trails (AIR-DET-005)
- Human oversight (AIR-PREV-014)
- Explainability
- Testing and monitoring

---

## Getting Started

### 1. Review the Architecture

```bash
# View main architecture
cat agentic-ai-reference-architecture.calm.json | jq '.metadata'

# View MCP sub-component
cat components/mcp-server.calm.json | jq '.metadata'
```

### 2. Customize for Your Stack

The architecture is designed to be **customized**:

- Replace `"tech-stack-flexibility"` values with your chosen technologies
- Adjust autonomy levels based on your risk appetite
- Add/remove agents based on your use case
- Modify controls based on your compliance requirements

### 3. Implement Incrementally

**Phase 1**: Single agent with human-in-the-loop
**Phase 2**: Multi-agent with orchestration
**Phase 3**: Full autonomy with monitoring
**Phase 4**: Production with all governance controls

---

## Use Cases

### Use Case 1: Financial Analysis Agent

- **Planning Agent**: Analyzes request, determines data sources
- **Execution Agent**: Pulls financial data, runs calculations
- **Validation Agent**: Validates results, checks for hallucinations
- **Human Approval**: Required for investment recommendations
- **Autonomy Level**: Level 1 (suggest only)

### Use Case 2: Customer Service Agent

- **Planning Agent**: Routes to appropriate response strategy
- **Execution Agent**: Generates response, accesses CRM
- **Validation Agent**: Checks response quality
- **Human Approval**: For refunds > $500
- **Autonomy Level**: Level 2 (bounded execution)

### Use Case 3: DevOps Agent

- **Planning Agent**: Diagnoses infrastructure issues
- **Execution Agent**: Executes remediation scripts
- **Validation Agent**: Verifies fix
- **Human Approval**: For production changes
- **Autonomy Level**: Level 3 for dev, Level 1 for prod

---

## Roadmap

### Phase 1: Core Architecture (Current)
- ✅ Main CALM specification
- ✅ AIR governance integration
- ✅ MCP sub-component reference
- ✅ Documentation

### Phase 2: Additional Sub-Components
- ⏳ Agent Communication Protocol spec
- ⏳ Knowledge Base Component spec
- ⏳ LLM Service Component spec

### Phase 3: Implementation Guides
- ⏳ LangChain implementation guide
- ⏳ AutoGen implementation guide
- ⏳ Kubernetes deployment guide

### Phase 4: Validation Tools
- ⏳ CALM validator for agentic architectures
- ⏳ AIR compliance checker
- ⏳ Architecture visualization tools

---

## Contributing

This is a reference architecture designed to be adapted. Contributions welcome:

1. **Tech Stack Examples**: Share your implementation
2. **Sub-Components**: Create detailed component specs
3. **Use Cases**: Document real-world applications
4. **Controls**: Enhance AIR governance controls

---

## References

- [FINOS AIR Governance Framework](https://air-governance-framework.finos.org/)
- [FINOS CALM Specification](https://calm.finos.org/)
- [Model Context Protocol](https://modelcontextprotocol.io/specification/)
- [SPIFFE/SPIRE](https://spiffe.io/)
- [EU AI Act](https://artificialintelligenceact.eu/)
- [OWASP Top 10 for LLMs](https://owasp.org/www-project-top-10-for-large-language-model-applications/)

---

## License

This specification follows the same license as the parent FINOS repository.
