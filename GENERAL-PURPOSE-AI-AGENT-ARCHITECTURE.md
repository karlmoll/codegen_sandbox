# General Purpose AI Agent Architecture with FINOS AIGF Controls

## Overview

This CALM specification defines a **General Purpose AI Agent Architecture** with embedded FINOS AI Governance Framework (AIGF) risks and mitigations. It serves as a **"golden path"** for secure agentic systems, defining trust boundaries and governance controls at each interaction point.

## Source

This architecture is based on the diagram described in:
- **GitHub Issue**: https://github.com/karlmoll/codegen_sandbox/issues/4
- **Original Reference**: https://github.com/finos/ai-governance-framework/pull/218#issuecomment-3296745868

## Architecture Overview

### Component Structure

The architecture consists of 5 major component groups:

```
┌─────────────────────────────────────────────────────────────────┐
│                         INPUT SOURCES                            │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────────┐      │
│  │  Text   │  │  Audio  │  │  Image  │  │ Agent (MCP)  │      │
│  │  Input  │  │  Input  │  │  Input  │  │    Input     │      │
│  └────┬────┘  └────┬────┘  └────┬────┘  └──────┬───────┘      │
└───────┼───────────┼────────────┼───────────────┼──────────────┘
        │           │            │               │
        │  ┌────────┴────────────┴───────────────┘
        │  │  [M18, M21, R29]        [M22, R28]
        │  │  Input Boundary         Agent-to-Agent Boundary
        ▼  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AI AGENT CORE                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  INTERNAL PROCESSES                                       │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐│  │
│  │  │   NLP    │ │Reasoning │ │ Planning │ │Intelligence  ││  │
│  │  │  Engine  │ │  Engine  │ │  Engine  │ │    Store     ││  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────┘│  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────┬───────────────────────────────────────────┬──────────┘
          │                                           │
          │ [R27]                                     │ [M19, M23, R24, R25]
          │ Memory                                    │ Tool Invocation Boundary
          ▼                                           ▼
    ┌─────────┐                          ┌────────────────────────┐
    │ Memory  │                          │        TOOLS           │
    │         │                          │  ┌──────┐  ┌────────┐ │
    │Persistent│                         │  │ RAG  │  │ Search │ │
    │ Storage │                          │  │Service│ │Service│ │
    └─────────┘                          │  └──────┘  └────────┘ │
                                         │  ┌──────┐  ┌────────┐ │
                                         │  │ API  │  │  MCP   │ │
                                         │  │Service│ │ Server │ │
                                         │  └──────┘  └────┬───┘ │
                                         └──────────────────┼─────┘
                                                            │ [M20, R26]
                                                            │ MCP Outbound
                                                            ▼
                                                    ┌──────────────┐
                                                    │  External    │
                                                    │   Agents     │
                                                    └──────────────┘
```

## Components (Nodes)

### Input Sources Group

#### 1. Text Input
- **Type**: Interface
- **Description**: Channel for text-based communication
- **Trust Boundary**: Input Boundary
- **AIGF Risk Level**: High
- **Risks**: R29 (Credential Discovery and Harvesting)

#### 2. Audio Input
- **Type**: Interface
- **Description**: Channel for audio-based communication (requires transcription)
- **Trust Boundary**: Input Boundary
- **AIGF Risk Level**: High
- **Risks**: R29

#### 3. Image Input
- **Type**: Interface
- **Description**: Channel for image-based communication (requires vision processing)
- **Trust Boundary**: Input Boundary
- **AIGF Risk Level**: High
- **Risks**: R29

#### 4. Agent Input (MCP)
- **Type**: Interface
- **Description**: Channel for Model Context Protocol communication from other agents
- **Trust Boundary**: Agent-to-Agent Boundary
- **AIGF Risk Level**: **Critical**
- **Risks**: R28 (Multi-Agent Trust Boundary Violations)
- **Note**: External agents must be treated as untrusted

---

### AI Agent Core

#### 5. AI Agent Core
- **Type**: Service
- **Description**: Central processing unit orchestrating all internal processes and external tool interactions
- **Role**: Orchestrator
- **AIGF Risk Level**: **Critical**
- **Risks**: R24, R25, R27, R28, R29
- **Mitigations**: M18, M19, M21, M22, M23

---

### Internal Processes Group

#### 6. NLP Engine
- **Type**: Service
- **Description**: Natural language processing (understanding and generation)
- **Component Type**: Internal Process
- **AIGF Risk Level**: Medium

#### 7. Reasoning Engine
- **Type**: Service
- **Description**: Logical deduction, problem-solving, and inference
- **Component Type**: Internal Process
- **AIGF Risk Level**: Medium

#### 8. Planning Engine
- **Type**: Service
- **Description**: Action planning, task decomposition, and sequencing
- **Component Type**: Internal Process
- **AIGF Risk Level**: Medium

#### 9. Intelligence Store
- **Type**: Datastore (In-Memory)
- **Description**: Internal knowledge base with insights and working memory
- **Component Type**: Internal Process
- **AIGF Risk Level**: Medium

---

### Memory

#### 10. Memory
- **Type**: Datastore (Persistent)
- **Description**: Persistent storage for long-term memory, state, and context
- **AIGF Risk Level**: **Critical**
- **Risks**: R27 (Agent State Persistence Poisoning)
- **Note**: Memory poisoning can compromise future agent behavior

---

### Tools Group

#### 11. RAG Service
- **Type**: Service
- **Description**: Retrieval-Augmented Generation tool for accessing vectorized knowledge
- **Trust Boundary**: Tool Invocation Boundary
- **AIGF Risk Level**: High
- **Risks**: R24, R25
- **Mitigations**: M19, M23

#### 12. Search Service
- **Type**: Service
- **Description**: Tool for executing external web or database searches
- **Trust Boundary**: Tool Invocation Boundary
- **AIGF Risk Level**: High
- **Risks**: R24, R25
- **Mitigations**: M19, M23

#### 13. API Service
- **Type**: Service
- **Description**: Generic tool for interacting with external third-party APIs
- **Trust Boundary**: Tool Invocation Boundary
- **AIGF Risk Level**: High
- **Risks**: R24, R25
- **Mitigations**: M19, M23

#### 14. MCP Server
- **Type**: Service
- **Description**: Tool for sending structured context to other AI agents via MCP
- **Trust Boundary**: MCP Outbound Boundary
- **Protocol**: https://modelcontextprotocol.io/specification/
- **AIGF Risk Level**: **Critical**
- **Risks**: R24, R25, R26
- **Mitigations**: M19, M20, M23
- **Note**: Outbound MCP traffic must be governed to prevent data leakage

---

### External Systems

#### 15. External Agents
- **Type**: External Service
- **Description**: Logical representation of other AI agents
- **Trust Level**: Untrusted
- **AIGF Risk Level**: **Critical**
- **Risks**: R26, R28
- **Note**: External agents must be treated as potentially malicious

---

## Trust Boundaries

The architecture defines **4 critical trust boundaries**:

### 1. Input Boundary
**Components**: Text/Audio/Image Input → AI Agent Core

**Risk Level**: High

**Description**: Critical boundary for managing trust and preventing malicious input from various sources.

**Controls**:
- M18: Agent Authority Least Privilege Framework
- M21: Agent Decision Audit and Explainability

**Risks**:
- R29: Agent-Mediated Credential Discovery and Harvesting

---

### 2. Agent-to-Agent Boundary
**Components**: Agent Input (MCP) → AI Agent Core

**Risk Level**: **Critical**

**Description**: High-risk trust boundary for MCP communication between agents.

**Controls**:
- M22: Multi-Agent Isolation and Segmentation

**Risks**:
- R28: Multi-Agent Trust Boundary Violations

---

### 3. Tool Invocation Boundary
**Components**: AI Agent Core → Tools (RAG, Search, API, MCP Server)

**Risk Level**: High

**Description**: Primary point of control for the agent's capabilities and external actions.

**Controls**:
- M19: Tool Chain Validation and Sanitization
- M23: Agentic System Credential Protection Framework

**Risks**:
- R24: Agent Action Authorization Bypass
- R25: Tool Chain Manipulation and Injection

---

### 4. MCP Outbound Boundary
**Components**: MCP Server → External Agents

**Risk Level**: High

**Description**: Governed boundary for agent communication with external agents.

**Controls**:
- M20: MCP Server Security Governance

**Risks**:
- R26: MCP Server Supply Chain Compromise

---

## FINOS AIGF Controls

### Mitigations (6 Total)

#### M18: Agent Authority Least Privilege Framework
- **Category**: Preventative
- **Applies To**: Input Boundary
- **Description**: The agent must only process inputs it is explicitly authorized to handle
- **Implementation**: Explicit allow-list, default deny

#### M19: Tool Chain Validation and Sanitization
- **Category**: Preventative
- **Applies To**: Tool Invocation Boundary
- **Description**: All inputs to tools must be strictly validated and sanitized to prevent injection attacks
- **Implementation**: Strict validation, parameter type checking, injection prevention (SQL, command, prompt)

#### M20: MCP Server Security Governance
- **Category**: Preventative
- **Applies To**: MCP Outbound Boundary
- **Description**: All outbound MCP traffic must adhere to strict security and data governance policies, ensuring no sensitive context is leaked
- **Implementation**: Data governance, sensitive data detection, DLP, context filtering, encryption

#### M21: Agent Decision Audit and Explainability
- **Category**: Detective
- **Applies To**: Input Boundary
- **Description**: The raw input and the agent's initial interpretation must be logged for audit and explainability
- **Implementation**: Log raw input, interpretation, decisions; structured JSON format; audit-compliant retention

#### M22: Multi-Agent Isolation and Segmentation
- **Category**: Preventative
- **Applies To**: Agent-to-Agent Boundary
- **Description**: The agent must treat input from other agents as untrusted and process it in an isolated manner
- **Implementation**: Sandboxed execution, untrusted processing, input sanitization, context isolation

#### M23: Agentic System Credential Protection Framework
- **Category**: Preventative
- **Applies To**: Tool Invocation Boundary
- **Description**: The agent's credentials for accessing tools must be securely managed and scoped
- **Implementation**: Vault-backed storage, least-privilege scoping, credential rotation (30 days), no hardcoded secrets

---

### Risks (6 Total)

#### R24: Agent Action Authorization Bypass
- **Category**: Security
- **Severity**: High
- **Boundary**: Tool Invocation
- **Description**: The agent might attempt to use a tool in an unauthorized way
- **Mitigations**: M23, Tool Authorization Control

#### R25: Tool Chain Manipulation and Injection
- **Category**: Security
- **Severity**: High
- **Boundary**: Tool Invocation
- **Description**: The agent could be tricked into crafting malicious payloads for a tool
- **Mitigations**: M19

#### R26: MCP Server Supply Chain Compromise
- **Category**: Security
- **Severity**: High
- **Boundary**: MCP Outbound
- **Description**: The outbound MCP communication could be intercepted or manipulated
- **Mitigations**: M20

#### R27: Agent State Persistence Poisoning
- **Category**: Security
- **Severity**: **Critical**
- **Boundary**: Memory
- **Description**: Malicious data could be written to memory, compromising the agent's future behavior
- **Mitigations**: Memory Protection Control

#### R28: Multi-Agent Trust Boundary Violations
- **Category**: Security
- **Severity**: **Critical**
- **Boundary**: Agent-to-Agent
- **Description**: An external agent could be malicious or compromised
- **Mitigations**: M22

#### R29: Agent-Mediated Credential Discovery and Harvesting
- **Category**: Security
- **Severity**: High
- **Boundary**: Input
- **Description**: Input channels could be used to harvest sensitive information
- **Mitigations**: M18, M21

---

## Interaction Flows

### Flow 1: User Input to Agent Response
**Description**: User input through internal processing

**Steps**:
1. User submits text → AI Agent Core (M18 authorization, M21 audit)
2. Agent → NLP Engine (language processing)
3. Agent → Reasoning Engine (logical processing)
4. Agent → Planning Engine (action planning)
5. Memory → Agent (context retrieval)
6. Agent → Intelligence Store (store results)

**AIGF Governance**:
- Mitigations: M18, M21
- Risks Addressed: R29
- Trust Boundaries: Input Boundary

---

### Flow 2: Agent Tool Invocation
**Description**: Agent invoking external tools with governance

**Steps**:
1. Agent → RAG Service (M19 validation, M23 credential protection, R24/R25)
2. Agent → Search Service (M19 validation, M23 credential protection, R24/R25)
3. Agent → API Service (M19 validation, M23 credential protection, R24/R25)

**AIGF Governance**:
- Mitigations: M19, M23
- Risks Addressed: R24, R25
- Trust Boundaries: Tool Invocation Boundary

---

### Flow 3: Agent-to-Agent Communication (MCP)
**Description**: Complete multi-agent communication flow

**Steps**:
1. Agent → MCP Server (M19 validation, M23 credential protection)
2. MCP Server → External Agent (M20 governance, R26)
3. External Agent → This Agent (M22 isolation, R28)

**AIGF Governance**:
- Mitigations: M19, M20, M22, M23
- Risks Addressed: R24, R25, R26, R28
- Trust Boundaries: Tool Invocation, MCP Outbound, Agent-to-Agent

---

### Flow 4: Memory Persistence
**Description**: Memory read/write with poisoning prevention

**Steps**:
1. Memory → Agent (read context)
2. Agent → Memory (write with R27 controls)

**AIGF Governance**:
- Risks Addressed: R27
- Trust Boundaries: None (internal)

---

## CALM Controls

The specification defines **8 CALM controls** mapping to AIGF mitigations and risks:

| Control | AIGF Mitigations | AIGF Risks | Boundary |
|---------|------------------|------------|----------|
| input-authorization-control | M18 | R29 | Input |
| input-audit-control | M21 | R29 | Input |
| multi-agent-isolation-control | M22 | R28 | Agent-to-Agent |
| memory-protection-control | - | R27 | Memory |
| tool-chain-validation-control | M19 | R25 | Tool Invocation |
| credential-protection-control | M23 | R24 | Tool Invocation |
| tool-authorization-control | - | R24 | Tool Invocation |
| mcp-outbound-governance-control | M20 | R26 | MCP Outbound |

---

## Golden Path Implementation

This specification serves as a **"golden path"** for secure agentic systems by:

1. **Defining Trust Boundaries**: Clear boundaries with risk levels
2. **Embedding AIGF Controls**: Mitigations at every interaction point
3. **Risk-Aware Architecture**: Risks mapped to specific relationships
4. **Governance Metadata**: AIGF metadata embedded throughout
5. **Flow-Level Governance**: Governance summaries for complete flows

---

## Implementation Guidelines

### Critical Security Controls

**Priority 1: Trust Boundaries**
- [ ] Implement M18 (least privilege) at input boundary
- [ ] Implement M22 (isolation) at agent-to-agent boundary
- [ ] Implement M19 (validation) at tool invocation boundary
- [ ] Implement M20 (governance) at MCP outbound boundary

**Priority 2: Credential Protection**
- [ ] Implement M23 (credential protection) for all tools
- [ ] Use vault-backed credential storage
- [ ] Implement 30-day credential rotation
- [ ] No hardcoded secrets

**Priority 3: Audit and Observability**
- [ ] Implement M21 (audit logging) for all inputs
- [ ] Log raw input, interpretation, and decisions
- [ ] Structured JSON format
- [ ] Audit-compliant retention

**Priority 4: Memory Protection**
- [ ] Implement data validation for memory writes
- [ ] Integrity checking for memory reads
- [ ] Version control for memory state
- [ ] Rollback capability for poisoned state

---

## Comparison with Reference Architecture

### Similarities
- Both are agentic AI architectures
- Both use MCP for agent-to-agent communication
- Both include FINOS AIR/AIGF governance
- Both define trust boundaries

### Differences

| Aspect | This Spec (Diagram-Based) | Reference Architecture |
|--------|---------------------------|------------------------|
| **Source** | Specific diagram from GitHub issue | Generic agentic AI patterns |
| **Component Count** | 15 nodes | 18 nodes |
| **Focus** | Golden path with specific boundaries | Flexible reference for any implementation |
| **Controls** | 6 AIGF mitigations (M18-M23) | 10 AIR controls |
| **Risks** | 6 AIGF risks (R24-R29) | 9 AIR threats |
| **Internal Processes** | Explicitly modeled (NLP, Reasoning, Planning) | Implicit in agent nodes |
| **Memory** | Explicit persistence risk (R27) | General audit logging |
| **Modularity** | Single document | Multi-document with sub-components |

---

## Use Cases

### Use Case 1: Multi-Modal Customer Service Agent
- **Input**: Text, Audio, Image
- **Tools**: RAG (knowledge base), API (CRM)
- **Memory**: Customer history, preferences
- **AIGF Controls**: M18 (input authorization), M21 (audit), M19/M23 (tool security)

### Use Case 2: Multi-Agent Research System
- **Input**: Agent MCP (from research agents)
- **Tools**: Search, RAG
- **Agent Communication**: MCP Server → External Agents
- **AIGF Controls**: M22 (isolation), M20 (outbound governance), M19/M23 (tool security)

### Use Case 3: Financial Analysis Agent
- **Input**: Text (analyst queries)
- **Tools**: RAG (financial data), API (market data)
- **Memory**: Analysis history
- **AIGF Controls**: All controls (high-security environment)

---

## Validation

✅ **JSON Syntax**: Valid (1,306 lines)
✅ **CALM Schema**: FINOS CALM 1.0 compliant
✅ **AIGF Integration**: All 6 mitigations and 6 risks embedded
✅ **Trust Boundaries**: All 4 boundaries defined with controls
✅ **Flows**: 4 complete flows with governance metadata

---

## References

- [FINOS AI Governance Framework](https://air-governance-framework.finos.org/)
- [Model Context Protocol](https://modelcontextprotocol.io/specification/)
- [GitHub Issue #4](https://github.com/karlmoll/codegen_sandbox/issues/4)
- [Original Architecture Diagram Comment](https://github.com/finos/ai-governance-framework/pull/218#issuecomment-3296745868)
- [FINOS CALM Specification](https://calm.finos.org/)

---

## Contributing

This specification represents a specific architectural pattern. Enhancements welcome:

- Additional risk scenarios
- Enhanced mitigation strategies
- Implementation examples
- Integration patterns
- Testing frameworks

---

## License

This specification follows the same license as the FINOS repository.
