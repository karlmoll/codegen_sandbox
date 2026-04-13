# MCP Architecture Augmentation Guide
## Combining Architecture Guidance with Embedded FINOS AI Governance Framework Controls

**Version**: 1.0  
**Date**: 2025-10-16  
**Authors**: AI Governance Working Group  
**Status**: Draft for OSFF Workshop Discussion

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Introduction to MCP Architecture Patterns](#introduction-to-mcp-architecture-patterns)
3. [FINOS AI Governance Framework Controls for MCP](#finos-ai-governance-framework-controls-for-mcp)
4. [Architectural Patterns with Embedded Controls](#architectural-patterns-with-embedded-controls)
5. [Agent-to-Agent Communication Patterns](#agent-to-agent-communication-patterns)
6. [Control Embedding Best Practices](#control-embedding-best-practices)
7. [Implementation Roadmap](#implementation-roadmap)
8. [Case Studies and Examples](#case-studies-and-examples)
9. [References and Additional Resources](#references-and-additional-resources)

---

## Executive Summary

This guide provides comprehensive guidance for augmenting Model Context Protocol (MCP) architectures with embedded FINOS AI Governance Framework controls. It synthesizes architectural patterns from the MCP CALM demo with newly introduced controls from FINOS AI Governance Framework PR #218, specifically designed for agentic AI systems.

**Key Contributions:**
- Integration of three new MCP-specific controls (MI-18, MI-20, MI-21) into enterprise MCP architectures
- Architectural patterns for agent-to-agent communication with embedded governance
- Tiered implementation approaches balancing security, compliance, and operational complexity
- Practical guidance for embedding controls into CALM architectural specifications

**Target Audience:**
- Enterprise architects designing MCP-based systems
- Security engineers implementing AI governance
- Compliance officers ensuring regulatory adherence
- Platform engineers deploying MCP infrastructures

---

## 1. Introduction to MCP Architecture Patterns

### 1.1 The Model Context Protocol (MCP)

The Model Context Protocol is an open standard for connecting AI assistants to the systems where data lives. MCP provides:

- **Standardized tool interfaces** for LLM-powered applications
- **Secure data access patterns** for retrieval-augmented generation
- **Composable architecture** supporting multiple MCP servers and clients
- **Protocol-level security** with transport-layer protection

### 1.2 Core MCP Architectural Components

Based on the [MCP CALM demo architecture](https://github.com/jpgough-ms/mcp-calm-demo/blob/main/calm-architecture/src/segmented-mcp.architecture.json), a typical MCP deployment consists of:

```
┌─────────────┐
│ MCP Client  │ (e.g., Claude Desktop, custom AI application)
└──────┬──────┘
       │ HTTPS/MCP Protocol
       ▼
┌─────────────────────┐
│   MCP Server        │ (presents tools and resources)
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Backend APIs       │ (actual data sources and services)
└─────────────────────┘
```

**Key architectural considerations:**
- MCP servers act as intermediaries between AI clients and backend systems
- Multiple MCP servers can be composed to provide different capabilities
- Security boundaries exist at multiple layers (client, server, backend)
- Agent decision-making occurs within MCP server implementation

### 1.3 Enterprise MCP Architectural Enhancements

Enterprise deployments require additional layers for security, governance, and compliance:

```
┌─────────────┐
│ MCP Client  │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  API Gateway        │ ◄── OAuth 2.1, OIDC, Rate Limiting, WAF
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│   MCP Proxy         │ ◄── Centralized MCP Server Governance
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│   MCP Server(s)     │ ◄── Agent Decision Logic, Tool Management
└──────┬──────────────┘
       │
       ├───────┬─────────────────┬──────────────┐
       ▼       ▼                 ▼              ▼
    ┌────┐  ┌────┐           ┌─────┐       ┌──────┐
    │OPA │  │OIDC│           │Vault│       │Logs  │
    │PDP │  │    │           │     │       │Metrics│
    └────┘  └────┘           └─────┘       └──────┘
       │
       ▼
┌─────────────────────┐
│  Backend APIs       │
└─────────────────────┘
```

---

## 2. FINOS AI Governance Framework Controls for MCP

### 2.1 Overview of FINOS AIR Framework

The FINOS AI Governance Framework (AIR) provides a comprehensive taxonomy of:
- **Threats/Risks** (RI-*): Security threats and operational risks to AI systems
- **Mitigations** (MI-*): Preventive (PREV), Detective (DET), and Corrective (CORR) controls

### 2.2 New MCP-Specific Controls from PR #218

Three new controls were introduced specifically for agentic AI systems using MCP:

#### **MI-18: Agent Authority Least Privilege Framework (AIR-PREV-018)**

**Purpose**: Implement granular access controls ensuring agents can only access APIs, tools, and data strictly necessary for their designated functions.

**Key Principles**:
- Granular API access control at tool manager and gateway levels
- Dynamic privilege adjustment based on context, risk, and value
- Time-bounded privileges with automatic expiration
- Separation of duties enforcement
- Business logic enforcement at privilege level

**Implementation Layers**:
1. **API Gateway Level**: Coarse-grained endpoint restrictions
2. **Tool Manager Level**: Fine-grained tool and parameter validation
3. **Policy Decision Point**: Dynamic authorization decisions

**Example Application in MCP**:
```json
{
  "control-id": "AIR-PREV-018",
  "enforcement-level": "tool-manager",
  "agent-roles": [
    {
      "role-name": "customer-service-agent",
      "allowed-tools": ["get_customer_info", "query_transactions"],
      "forbidden-tools": ["transfer_funds", "modify_account"],
      "transaction-limits": {"max-value": 1000}
    }
  ]
}
```

#### **MI-20: MCP Server Security Governance (AIR-PREV-020)**

**Purpose**: Establish comprehensive security controls for MCP servers including supply chain verification, secure communication, and continuous monitoring.

**Tiered Implementation Approach**:

**Tier 1: Centralized Proxy + Human-in-the-Loop**
- Recommended for: Initial MCP adoption, coding assistants, development workflows
- Central MCP proxy enforces allowlist of approved servers
- Human approval required before agent actions execute
- Basic security vetting (source code review, CVE checks, dependency scanning)

**Tier 2: Centralized Proxy with Pre-Approved Servers**
- Recommended for: Production systems with moderate risk
- Enhanced monitoring replaces human approval
- User/agent identity propagation through proxy
- Automated alerting on anomalies

**Tier 3: Distributed Many-to-Many with Comprehensive Security**
- Recommended for: High-risk transactions, fully autonomous systems
- Advanced supply chain due diligence
- Cryptographic data integrity validation
- Real-time behavioral monitoring
- Network segmentation and service isolation
- Mutual authentication between all components

**Key Controls**:
- Supply chain verification (vendor assessments, penetration testing, certifications)
- Secure MCP communication (TLS 1.3, mutual auth, certificate management)
- Data integrity validation (cryptographic signatures, schema validation)
- Continuous monitoring (behavioral analysis, anomaly detection, threat intelligence)
- Incident response integration

**Example Application in MCP**:
```json
{
  "control-id": "AIR-PREV-020",
  "implementation-tier": "tier-2-centralized-proxy",
  "approved-mcp-servers": [
    {
      "server-id": "internal-reports-server",
      "vendor": "internal",
      "last-security-review": "2025-10-01",
      "security-certifications": ["SOC2-Type-II"],
      "risk-level": "low"
    }
  ],
  "proxy-enforcement": {
    "allowlist-only": true,
    "bypass-prevention": true,
    "tls-required": true
  }
}
```

#### **MI-21: Agent Decision Audit and Explainability (AIR-DET-021)**

**Purpose**: Implement comprehensive logging, documentation, and explainability mechanisms for agent decisions to support regulatory compliance and incident investigation.

**Tiered Implementation Approach**:

**Tier 0: Zero Data Retention**
- Recommended for: Low-stakes applications, code development with reviews
- ADR documenting rationale for minimal retention
- Basic security logging only
- Human-in-the-loop replaces audit trails
- Emphasis on preventing data leakage

**Tier 1: Basic Flow Reconstruction**
- Recommended for: Moderate-stakes applications, dev/test environments
- Log flows and prompts for reproduction
- Capture inputs, timestamps, tool invocations
- Record final decisions and outcomes
- Enable "what happened" reconstruction

**Tier 2: Explicit Reasoning Generation**
- Recommended for: Production systems, regulated activities, customer-facing decisions
- Explicit reasoning generated and logged before tool calls
- Natural language explanations
- Confidence scoring and alternatives
- Note: Additional cost, may not capture internal reasoning (e.g., OpenAI o1 models)

**Tier 3: Comprehensive Audit Trail**
- Recommended for: High-risk transactions, regulatory compliance, autonomous systems
- Detailed decision reasoning and logical flow
- Complete contextual information
- Cryptographic protection and tamper-evident logging
- Full regulatory compliance integration
- Real-time monitoring and anomaly detection

**Key Controls**:
- Complete decision documentation (inputs, reasoning, tool selection, outcomes)
- Explainable decision logic (confidence scores, alternatives, decision trees)
- Regulatory compliance alignment (GDPR right to explanation, fair lending, AML)
- Real-time monitoring (anomaly detection, bias detection, violation detection)
- Tamper-evident logging (cryptographic hashing, immutable records)

**Example Application in MCP**:
```json
{
  "control-id": "AIR-DET-021",
  "implementation-tier": "tier-3-comprehensive",
  "decision-logging": {
    "input-data-recording": true,
    "tool-selection-rationale": true,
    "confidence-scoring": true,
    "decision-chain-tracking": true
  },
  "regulatory-compliance": {
    "gdpr-right-to-explanation": true,
    "fair-lending-compliance": true,
    "retention-period-days": 2555
  },
  "tamper-evident-logging": {
    "cryptographic-protection": true,
    "hash-algorithm": "SHA-256"
  }
}
```

### 2.3 Foundational Controls from AI Governance Framework

In addition to the three new MCP-specific controls, the following foundational controls remain essential:

| Control ID | Name | Type | Relevance to MCP |
|------------|------|------|------------------|
| AIR-PREV-001 (MI-1) | AI System Risk Assessment | PREV | Risk assessment before MCP deployment |
| AIR-PREV-002 (MI-2) | Data Filtering from External Knowledge Bases | PREV | Filtering data retrieved via MCP tools |
| AIR-PREV-003 (MI-3) | User/App/Model Firewalling | PREV | Input validation at MCP client interface |
| AIR-DET-004 (MI-4) | AI System Observability | DET | Monitoring MCP server and agent behavior |
| AIR-DET-005 (MI-5) | AI System Audit Trail | DET | Comprehensive logging of MCP interactions |
| AIR-CORR-001 (MI-6) | AI System Incident Response | CORR | Response to MCP server compromise |
| AIR-PREV-007 (MI-7) | Legal and Contractual Frameworks | PREV | Agreements with MCP server providers |
| AIR-PREV-012 (MI-12) | Role-Based Access Control for AI Data | PREV | RBAC for MCP tools and resources |

---

## 3. Architectural Patterns with Embedded Controls

### 3.1 Pattern 1: Single MCP Server with Gateway Controls

**Use Case**: Simple MCP deployment with one internal MCP server, minimal external dependencies.

**Architecture**:
```
[MCP Client] 
    ↓ (OAuth 2.1)
[API Gateway] ← AIR-PREV-018 (Least Privilege), AIR-PREV-012 (RBAC)
    ↓
[MCP Server] ← AIR-PREV-018 (Tool Manager), AIR-DET-021 (Audit), AIR-DET-004 (Observability)
    ↓
[Backend APIs] ← AIR-PREV-002 (Data Filtering)
```

**Embedded Controls**:
- **API Gateway**: Agent Authority (coarse-grained), RBAC, OAuth/OIDC
- **MCP Server**: Agent Authority (fine-grained), Decision Audit, Observability, Incident Response
- **Backend APIs**: Data Filtering, Access Control

**CALM Representation**:
```json
{
  "unique-id": "mcp-service",
  "node-type": "service",
  "controls": {
    "agent-authority-tool-manager": {
      "requirements": [{
        "control-requirement-url": ".../mi-18_agent-authority-least-privilege-framework.requirement.json",
        "control-config": {...}
      }]
    },
    "agent-decision-audit": {
      "requirements": [{
        "control-requirement-url": ".../mi-21_agent-decision-audit-and-explainability.requirement.json",
        "control-config": {
          "implementation-tier": "tier-2-explicit-reasoning"
        }
      }]
    }
  }
}
```

### 3.2 Pattern 2: Multiple MCP Servers with Centralized Proxy

**Use Case**: Enterprise deployment with multiple MCP servers (internal and external), requiring centralized governance.

**Architecture**:
```
[MCP Client]
    ↓
[API Gateway] ← AIR-PREV-018, AIR-PREV-012
    ↓
[MCP Proxy] ← AIR-PREV-020 (Tier 2: Centralized Proxy)
    ↓
    ├── [MCP Server 1: Reports] ← AIR-PREV-018, AIR-DET-021
    ├── [MCP Server 2: Analytics] ← AIR-PREV-018, AIR-DET-021
    └── [MCP Server 3: External Vendor] ← AIR-PREV-020 (Supply Chain Governance)
```

**Embedded Controls**:
- **MCP Proxy**: 
  - MCP Server Security Governance (allowlist enforcement, vetting, monitoring)
  - Identity propagation
  - Connection restrictions
- **Individual MCP Servers**:
  - Agent Authority (tool-specific)
  - Decision Audit (tier-appropriate)
  - Observability

**CALM Representation**:
```json
{
  "unique-id": "mcp-proxy",
  "node-type": "service",
  "name": "MCP Proxy Server",
  "controls": {
    "mcp-server-governance": {
      "requirements": [{
        "control-requirement-url": ".../mi-20_mcp-server-security-governance.requirement.json",
        "control-config": {
          "implementation-tier": "tier-2-centralized-proxy",
          "allowlist-enforcement": true,
          "approved-servers": [
            {"server-id": "reports-server", "risk-level": "low"},
            {"server-id": "external-vendor", "risk-level": "medium"}
          ]
        }
      }]
    }
  }
}
```

### 3.3 Pattern 3: Distributed MCP with Agent-to-Agent Communication

**Use Case**: Complex multi-agent system where agents interact with each other through MCP, requiring comprehensive security.

**Architecture**:
```
[MCP Client/Agent A]
    ↓
[API Gateway] ← AIR-PREV-018, AIR-PREV-012
    ↓
[MCP Server A] ← AIR-PREV-018, AIR-DET-021 (Tier 3), AIR-PREV-020 (Tier 3)
    ↓ (Agent-to-Agent MCP)
    ↓ (mutual TLS, authenticated)
[MCP Server B] ← AIR-PREV-018, AIR-DET-021 (Tier 3), AIR-PREV-020 (Tier 3)
    ↓
[Backend APIs]
```

**Embedded Controls**:
- **Agent-to-Agent Communication**:
  - Mutual TLS authentication
  - Agent identity propagation
  - Cross-agent authorization via PDP
  - Comprehensive audit trails across agent boundaries
- **Each MCP Server**:
  - Tier 3 Decision Audit (comprehensive reasoning capture)
  - Tier 3 MCP Server Governance (distributed security)
  - Fine-grained Agent Authority

**See Section 4 for detailed Agent-to-Agent patterns**

---

## 4. Agent-to-Agent Communication Patterns

### 4.1 Overview of Agent-to-Agent Interactions

Agent-to-agent communication occurs when one MCP server/agent invokes another as part of its workflow. This introduces unique challenges:

- **Identity propagation**: Original user context must flow through agent chain
- **Authorization boundaries**: Each agent must validate permissions
- **Audit trail continuity**: Decision chains must be traceable across agents
- **Privilege escalation risks**: Agents must not gain unauthorized access through chaining
- **Circular dependency risks**: Agent A → Agent B → Agent A loops

### 4.2 Pattern 4.A: Sequential Agent Chaining

**Scenario**: Agent A completes task, then hands off to Agent B with explicit handoff.

```
[User] → [Agent A: Customer Service]
            ↓ (completes initial triage)
            ↓ (explicit handoff with context)
         [Agent B: Compliance Review]
            ↓ (completes review)
         [Agent C: Transaction Execution]
```

**Control Embedding**:
```json
{
  "relationship": {
    "unique-id": "agent-a-to-agent-b",
    "source": {"node": "mcp-server-a"},
    "destination": {"node": "mcp-server-b"},
    "protocol": "HTTPS-MCP",
    "metadata": {
      "authentication": "mutual-TLS",
      "identity-propagation": "JWT-chaining",
      "air-controls": [
        "AIR-PREV-018 (Agent Authority verified at each hop)",
        "AIR-DET-021 (Decision chain tracked across agents)"
      ]
    }
  }
}
```

**Key Controls**:
- **AIR-PREV-018**: Each agent validates authority before accepting handoff
- **AIR-DET-021**: Full decision chain documented with agent transitions
- **AIR-DET-005**: Audit trail includes handoff reasons and authorization checks

### 4.3 Pattern 4.B: Parallel Agent Orchestration

**Scenario**: Orchestrator agent fans out to multiple specialist agents, aggregates results.

```
[User] → [Orchestrator Agent]
            ↓
            ├── [Agent 1: Risk Assessment]
            ├── [Agent 2: Compliance Check]
            └── [Agent 3: Pricing Analysis]
            ↓
         [Orchestrator aggregates results]
```

**Control Embedding**:
```json
{
  "node": {
    "unique-id": "orchestrator-agent",
    "controls": {
      "agent-orchestration-authority": {
        "control-config": {
          "control-id": "AIR-PREV-018",
          "orchestration-privileges": {
            "can-invoke-agents": ["risk-agent", "compliance-agent", "pricing-agent"],
            "can-aggregate-results": true,
            "cannot-modify-sub-agent-outputs": true
          },
          "separation-of-duties": {
            "orchestrator-cannot-execute-tools": true,
            "requires-approval": "high-value-decisions"
          }
        }
      }
    }
  }
}
```

**Key Controls**:
- **AIR-PREV-018**: Orchestrator has limited privileges (invoke and aggregate only)
- **AIR-DET-021**: Each sub-agent logs decisions independently, orchestrator logs aggregation logic
- **AIR-PREV-012**: RBAC enforces which agents orchestrator can invoke

### 4.4 Pattern 4.C: Agent Collaboration with Shared Context

**Scenario**: Multiple agents work together on shared context, requiring coordination.

```
[User] → [Shared Context / Session]
            ↑↓
         [Agent A] ←→ [Agent B] ←→ [Agent C]
         (all agents can read/write shared context)
```

**Security Risks**:
- Context poisoning: Agent A modifies context to mislead Agent B
- Privilege escalation: Agent B uses Agent A's higher privileges
- Information leakage: Agent C accesses data meant for Agent A

**Control Embedding**:
```json
{
  "shared-context-node": {
    "unique-id": "shared-session-context",
    "node-type": "datastore",
    "controls": {
      "context-access-control": {
        "control-config": {
          "control-id": "AIR-PREV-012",
          "access-model": "ABAC",
          "attributes": [
            "agent-identity",
            "data-classification",
            "purpose",
            "write-vs-read"
          ],
          "integrity-protection": {
            "cryptographic-signing": true,
            "tamper-detection": true,
            "agent-attribution": "mandatory"
          }
        }
      },
      "context-audit": {
        "control-config": {
          "control-id": "AIR-DET-005",
          "log-all-context-modifications": true,
          "attribute-changes-to-agent": true
        }
      }
    }
  }
}
```

**Key Controls**:
- **AIR-PREV-012**: ABAC for shared context access (read/write per agent, per data element)
- **AIR-DET-005**: Comprehensive audit trail of all context modifications
- **AIR-SEC-001**: Data poisoning prevention through integrity checks

### 4.5 Pattern 4.D: Agent Approval Workflows

**Scenario**: High-risk actions require multi-agent approval (separation of duties).

```
[Agent A: Initiate Transaction]
    ↓ (requests approval)
[Agent B: Risk Review] → [Approval Decision]
    ↓ (if approved)
[Agent C: Compliance Check] → [Approval Decision]
    ↓ (if approved)
[Agent D: Execution] → [Transaction Executed]
```

**Control Embedding**:
```json
{
  "approval-workflow": {
    "control-id": "AIR-PREV-018",
    "separation-of-duties": {
      "high-risk-threshold": 10000,
      "required-approvers": [
        {"agent": "risk-agent", "sequence": 1},
        {"agent": "compliance-agent", "sequence": 2}
      ],
      "no-single-agent-completion": true,
      "approval-timeout": "4-hours",
      "fallback": "escalate-to-human"
    },
    "audit-requirements": {
      "control-id": "AIR-DET-021",
      "log-approval-rationale": true,
      "log-rejection-rationale": true
    }
  }
}
```

**Key Controls**:
- **AIR-PREV-018**: Separation of duties enforced at privilege level
- **AIR-DET-021**: All approval/rejection decisions logged with reasoning
- **AIR-CORR-001**: Incident response if approval chain breaks

### 4.6 Agent-to-Agent Communication: CALM Relationships

**General Pattern for Agent-to-Agent Relationships**:

```json
{
  "relationships": [
    {
      "unique-id": "agent-a-to-agent-b",
      "description": "Agent A invokes Agent B for specialized processing",
      "relationship-type": {
        "connects": {
          "source": {"node": "mcp-server-a"},
          "destination": {"node": "mcp-server-b"}
        }
      },
      "protocol": "HTTPS-MCP",
      "metadata": {
        "authentication": "mutual-TLS-with-agent-identity",
        "identity-propagation": {
          "method": "JWT-chaining",
          "original-user": "preserved",
          "agent-chain": ["agent-a", "agent-b"]
        },
        "authorization": {
          "method": "policy-decision-point",
          "agent-authority-verified": true
        },
        "air-threats-addressed": [
          "RI-24 (Agent Action Authorization Bypass)",
          "RI-25 (Tool Chain Manipulation)"
        ],
        "air-controls-applied": [
          "AIR-PREV-018 (Agent Authority Least Privilege)",
          "AIR-DET-021 (Agent Decision Audit)"
        ]
      }
    }
  ]
}
```

---

## 5. Control Embedding Best Practices

### 5.1 CALM Control Embedding Patterns

#### Pattern A: Inline Control Configuration

Use when control configuration is simple and specific to this node:

```json
{
  "controls": {
    "control-name": {
      "description": "...",
      "requirements": [{
        "control-requirement-url": "https://air-governance-framework.finos.org/mitigations/mi-XX.requirement.json",
        "control-config": {
          "control-id": "AIR-PREV-XXX",
          "name": "Control Name",
          "description": "...",
          "configuration-details": {...}
        }
      }]
    }
  }
}
```

#### Pattern B: External Control Configuration Reference

Use when control configuration is shared across multiple nodes or complex:

```json
{
  "controls": {
    "control-name": {
      "description": "...",
      "requirements": [{
        "control-requirement-url": "https://air-governance-framework.finos.org/mitigations/mi-XX.requirement.json",
        "control-config-url": "https://controls.company.example/configs/control-XX.config.json"
      }]
    }
  }
}
```

#### Pattern C: Hybrid Approach

Use when some configuration is node-specific, but references shared schemas:

```json
{
  "controls": {
    "control-name": {
      "requirements": [{
        "control-requirement-url": "https://air-governance-framework.finos.org/mitigations/mi-XX.requirement.json",
        "control-config": {
          "$ref": "https://controls.company.example/configs/base-config.json",
          "node-specific-overrides": {...}
        }
      }]
    }
  }
}
```

### 5.2 Control Tiering Decision Framework

**Question 1**: What is the risk level of the use case?
- Low: Tier 0-1
- Medium: Tier 1-2
- High: Tier 2-3
- Critical: Tier 3

**Question 2**: What are the regulatory requirements?
- No regulatory requirements: Tier 0-1
- General data protection (GDPR): Tier 1-2
- Financial services regulation (MiFID II, Dodd-Frank): Tier 2-3
- Safety-critical (healthcare, trading): Tier 3

**Question 3**: What is the level of autonomy?
- Human-in-the-loop always: Tier 0-1
- Human oversight available: Tier 1-2
- Semi-autonomous with monitoring: Tier 2-3
- Fully autonomous: Tier 3

**Question 4**: What are the cost constraints?
- Minimize costs: Tier 0-1 (less logging, less reasoning generation)
- Balanced: Tier 1-2
- Compliance-driven (costs secondary): Tier 2-3

**Decision Matrix**:

| Risk | Regulatory | Autonomy | Recommended Tier |
|------|------------|----------|------------------|
| Low | None | HITL | Tier 0-1 |
| Medium | GDPR | Oversight | Tier 1-2 |
| High | Financial | Semi-Auto | Tier 2-3 |
| Critical | Safety | Autonomous | Tier 3 |

### 5.3 Creating an Architecture Decision Record (ADR)

For each MCP deployment, create an ADR documenting:

```markdown
# ADR-001: MCP Server Security Tier Selection

## Status
Accepted

## Context
We are deploying an MCP-based customer service agent for account inquiries.
- Risk level: Medium (access to account data, no financial transactions)
- Regulatory: GDPR applies
- Autonomy: Human oversight available within 1 hour
- Cost constraints: Moderate budget

## Decision
- **MI-20 (MCP Server Security Governance)**: Tier 2 (Centralized Proxy)
- **MI-21 (Agent Decision Audit)**: Tier 2 (Explicit Reasoning)
- **MI-18 (Agent Authority)**: Full implementation at tool manager level

## Rationale
- Tier 2 provides adequate security for medium-risk with centralized governance
- Explicit reasoning generation meets GDPR explanation requirements
- Human oversight within 1 hour allows Tier 2 over Tier 3
- Cost-benefit analysis shows Tier 3 comprehensive audit is unnecessary

## Consequences
- Must implement MCP proxy with allowlist enforcement
- Estimated additional cost: 20% token usage for reasoning generation
- Audit retention: 2 years (GDPR minimum)
- Review trigger: If autonomy increases or regulatory requirements change
```

### 5.4 Control Validation and Testing

Before deploying MCP architecture with embedded controls:

**1. Schema Validation**
```bash
npx @finos/calm-cli validate enterprise-mcp-with-air-controls-v3.calm.json
```

**2. Control Coverage Analysis**
- Verify all identified threats have corresponding controls
- Check for gaps in control coverage across architecture layers

**3. Control Effectiveness Testing**
- Test agent authority enforcement (attempt unauthorized tool access)
- Test MCP server allowlist enforcement (attempt unauthorized server connection)
- Test decision audit capture (verify audit trails for sample decisions)

**4. Incident Response Drills**
- Simulate MCP server compromise
- Simulate agent privilege escalation
- Verify controls detect and respond appropriately

---

## 6. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-4)

**Objectives**:
- Establish baseline MCP architecture
- Implement foundational security (OAuth, RBAC, logging)
- Deploy Tier 1 controls

**Deliverables**:
- CALM architecture document with embedded controls
- API Gateway with OAuth 2.1 and basic RBAC
- Basic MCP server with logging
- ADR documenting tier selections

**Key Controls**:
- AIR-PREV-012 (RBAC) - Basic implementation
- AIR-DET-004 (Observability) - Basic metrics and logs
- AIR-DET-005 (Audit Trail) - Basic audit logging

### Phase 2: MCP Governance (Weeks 5-8)

**Objectives**:
- Implement MCP Proxy for centralized governance
- Deploy Tier 2 MCP Server Security Governance
- Enhance agent authority controls

**Deliverables**:
- MCP Proxy with allowlist enforcement
- MCP server vetting process and documentation
- Enhanced agent authority at tool manager level

**Key Controls**:
- AIR-PREV-020 (MCP Server Security) - Tier 2
- AIR-PREV-018 (Agent Authority) - Tool manager level
- Enhanced logging and monitoring

### Phase 3: Decision Audit and Explainability (Weeks 9-12)

**Objectives**:
- Implement explicit reasoning generation
- Deploy comprehensive audit trails
- Establish regulatory compliance reporting

**Deliverables**:
- Decision audit framework with reasoning capture
- Tamper-evident logging infrastructure
- Regulatory compliance reports

**Key Controls**:
- AIR-DET-021 (Decision Audit) - Tier 2 or 3
- Enhanced AIR-DET-005 (Audit Trail) with decision chains
- Compliance integration

### Phase 4: Advanced Governance (Weeks 13-16)

**Objectives**:
- Implement agent-to-agent communication patterns
- Deploy Tier 3 controls for high-risk use cases
- Optimize performance and cost

**Deliverables**:
- Agent-to-agent protocols with identity propagation
- Tier 3 controls for critical systems
- Cost optimization analysis

**Key Controls**:
- AIR-PREV-020 (MCP Server Security) - Tier 3 for critical systems
- AIR-DET-021 (Decision Audit) - Tier 3 for regulated activities
- Full separation of duties enforcement

### Phase 5: Continuous Improvement (Ongoing)

**Objectives**:
- Monitor control effectiveness
- Respond to emerging threats
- Optimize cost and performance

**Activities**:
- Quarterly control reviews
- Incident response drills
- Threat intelligence integration
- Cost-benefit optimization

---

## 7. Case Studies and Examples

### Case Study 1: Financial Services Customer Support Agent

**Context**:
- Bank deploys MCP-based agent for customer account inquiries
- Accesses account balances, transaction history, profile information
- Cannot execute transactions or modify accounts
- Must comply with PCI-DSS, SOX, GDPR

**Architecture**:
```
[Customer] → [Web App with MCP Client]
    ↓ (OAuth 2.1)
[API Gateway] ← AIR-PREV-018 (Endpoint restrictions), AIR-PREV-012 (RBAC)
    ↓
[MCP Proxy] ← AIR-PREV-020 (Tier 2: Centralized, Internal servers only)
    ↓
[Customer Service MCP Server] ← AIR-PREV-018 (Tool restrictions), AIR-DET-021 (Tier 2)
    ↓
[Banking APIs] ← AIR-PREV-002 (Data filtering: PII, PCI data)
```

**Control Configuration**:
- **MI-18**: Agent cannot access fund transfer or account modification tools
- **MI-20**: Tier 2 with centralized proxy, only internal MCP servers approved
- **MI-21**: Tier 2 explicit reasoning for all customer interactions (GDPR compliance)

**Outcome**:
- Successful deployment with regulatory approval
- 95% reduction in human customer service time for account inquiries
- Zero security incidents in 6 months
- Full audit trail for regulatory examination

### Case Study 2: Software Development AI Assistant

**Context**:
- Tech company deploys MCP-based coding assistant
- Accesses code repositories, documentation, build systems
- Can suggest code changes but requires developer approval
- Emphasis on preventing data leakage over audit

**Architecture**:
```
[Developer IDE] → [MCP Client Plugin]
    ↓
[MCP Proxy] ← AIR-PREV-020 (Tier 1: HITL before actions)
    ↓
[Code Assistant MCP Server] ← AIR-PREV-018, AIR-DET-021 (Tier 0: Zero retention)
    ↓
[GitHub, Build Systems, Docs]
```

**Control Configuration**:
- **MI-18**: Agent can read code, suggest changes, cannot commit directly
- **MI-20**: Tier 1 with human approval before any action execution
- **MI-21**: Tier 0 with minimal retention (ADR documents data leakage risk prioritization)

**Outcome**:
- Developer productivity increase of 40%
- Zero unauthorized code commits
- Minimal data retention reduces IP leakage risk
- Human approval maintains code quality standards

### Case Study 3: Autonomous Trading System (High-Risk)

**Context**:
- Trading firm deploys MCP-based agents for algorithmic trading
- Executes trades autonomously within risk parameters
- Subject to SEC, FINRA, MiFID II regulations
- Extremely high-risk due to financial and reputational impact

**Architecture**:
```
[Trading Strategy Engine] → [Trading Agent MCP Client]
    ↓
[API Gateway] ← AIR-PREV-018, AIR-PREV-012
    ↓
[MCP Proxy] ← AIR-PREV-020 (Tier 3: Distributed with full security)
    ↓
[Trading Agent A: Market Analysis] ←→ [Trading Agent B: Risk Assessment]
    ↓                                    ↓
[Trading Agent C: Execution] (requires approval from both A and B)
    ↓
[Trading APIs] ← AIR-PREV-002, AIR-PREV-018 (position limits enforced)
```

**Control Configuration**:
- **MI-18**: Strict separation of duties, multi-agent approval for trades > $10K
- **MI-20**: Tier 3 with comprehensive supply chain governance
- **MI-21**: Tier 3 comprehensive audit with full decision reasoning, cryptographic protection

**Outcome**:
- Regulatory approval after comprehensive security review
- Zero unauthorized trades in 12 months
- Full audit trail for SEC examination
- Successful incident response drill with rapid agent isolation

---

## 8. References and Additional Resources

### FINOS AI Governance Framework
- **Main Repository**: https://github.com/finos/ai-governance-framework
- **PR #218 (New MCP Controls)**: https://github.com/finos/ai-governance-framework/pull/218
- **MI-18 Documentation**: https://github.com/finos/ai-governance-framework/blob/main/docs/_mitigations/mi-18_agent-authority-least-privilege-framework.md
- **MI-20 Documentation**: https://github.com/finos/ai-governance-framework/blob/main/docs/_mitigations/mi-20_mcp-server-security-governance.md
- **MI-21 Documentation**: https://github.com/finos/ai-governance-framework/blob/main/docs/_mitigations/mi-21_agent-decision-audit-and-explainability.md

### CALM (Common Architecture Language Model)
- **CALM Specification**: https://calm.finos.org/
- **CALM CLI**: https://www.npmjs.com/package/@finos/calm-cli
- **CALM MCP Demo**: https://github.com/jpgough-ms/mcp-calm-demo
- **Architecture as Code**: https://github.com/finos/architecture-as-code

### Model Context Protocol (MCP)
- **MCP Specification**: https://modelcontextprotocol.io/specification/
- **MCP Security Best Practices**: https://github.com/Puliczek/awesome-mcp-security
- **GitHub Copilot MCP Configuration**: https://docs.github.com/en/copilot/how-tos/administer-copilot/configure-mcp-server-access

### Related Standards and Frameworks
- **NIST AI Risk Management Framework**: https://www.nist.gov/itl/ai-risk-management-framework
- **ISO 42001 (AI Management Systems)**: https://www.iso.org/standard/81230.html
- **EU AI Act**: https://eur-lex.europa.eu/eli/reg/2024/1689/oj
- **GDPR Article 22 (Automated Decision-Making)**: https://gdpr-info.eu/art-22-gdpr/

### OAuth 2.1 and OIDC
- **OAuth 2.1**: https://oauth.net/2.1/
- **RFC 8414 (OIDC Discovery)**: https://www.rfc-editor.org/rfc/rfc8414
- **RFC 8725 (JWT Best Practices)**: https://www.rfc-editor.org/rfc/rfc8725

---

## Appendix A: Control Quick Reference

| Control ID | Name | Type | When to Use | CALM Embedding Location |
|------------|------|------|-------------|-------------------------|
| AIR-PREV-001 | AI System Risk Assessment | PREV | Before any deployment | Metadata / Documentation |
| AIR-PREV-002 | Data Filtering | PREV | Data retrieval nodes | Backend API nodes, MCP servers |
| AIR-PREV-003 | User/App/Model Firewalling | PREV | Client interfaces | API Gateway, MCP Client |
| AIR-DET-004 | AI System Observability | DET | All MCP servers | MCP Server, Metrics service |
| AIR-DET-005 | AI System Audit Trail | DET | All regulated systems | Logging service, MCP servers |
| AIR-CORR-001 | Incident Response | CORR | All deployments | MCP Server, Operations nodes |
| AIR-PREV-007 | Legal Frameworks | PREV | External MCP servers | Contract metadata, OIDC |
| AIR-PREV-012 | RBAC for AI Data | PREV | All access points | API Gateway, PDP, MCP Server |
| **AIR-PREV-018** | **Agent Authority Least Privilege** | **PREV** | **All MCP servers** | **API Gateway, MCP Server (tool manager)** |
| **AIR-PREV-020** | **MCP Server Security Governance** | **PREV** | **Multiple MCP servers or external servers** | **MCP Proxy node, MCP Server** |
| **AIR-DET-021** | **Agent Decision Audit** | **DET** | **Autonomous agents, regulated activities** | **MCP Server** |

---

## Appendix B: Glossary

**Agent**: An autonomous AI system that makes decisions and takes actions on behalf of users

**Agent-to-Agent Communication**: Direct interactions between multiple AI agents, often through MCP

**CALM**: Common Architecture Language Model - a JSON-based specification for describing system architectures

**Control**: A security, governance, or compliance measure implemented to mitigate risks

**MCP (Model Context Protocol)**: An open standard for connecting AI assistants to data systems

**MCP Client**: An application that consumes MCP services (e.g., Claude Desktop, custom AI app)

**MCP Server**: A service that implements MCP protocol and provides tools/resources to clients

**MCP Proxy**: A centralized intermediary that enforces governance policies for MCP server access

**Tool Manager**: The component within an MCP server that mediates between agents and external APIs/tools

**Tiered Control Implementation**: Graduated levels of control rigor (Tier 0-3) based on risk and requirements

---

**Document History**:
- Version 1.0 (2025-10-16): Initial draft for OSFF Workshop
- Created for FINOS Open Source in Finance Forum Workshop on AI Governance and MCP Architecture

**Contributing**:
This is a living document. Feedback and contributions welcome via FINOS AI Governance Working Group.

**License**:
This document is provided under CC BY 4.0 - https://creativecommons.org/licenses/by/4.0/
