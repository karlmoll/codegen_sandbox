# OSFF Workshop Preparation Materials
## FINOS CALM MCP Architecture with AI Governance Framework Controls

**Date**: 2025-10-16  
**Purpose**: Materials prepared for FINOS Open Source in Finance Forum Workshop on AI Governance and MCP Architecture

---

## Contents

This folder contains validated and corrected FINOS CALM representations of MCP servers with embedded AI Governance Framework controls, along with comprehensive documentation for implementing these patterns in enterprise environments.

### 📄 Files

1. **`enterprise-mcp-with-air-controls-v2-corrected.calm.json`**
   - Original CALM file from source repository
   - Version 2.1
   - Contains baseline AIR controls (MI-1 through MI-12)

2. **`enterprise-mcp-with-air-controls-v3-corrected.calm.json`** ⭐ **PRIMARY OUTPUT**
   - **Corrected and enhanced version**
   - Version 3.0
   - **Adds three new MCP-specific controls from PR #218**:
     - **MI-18 (AIR-PREV-018)**: Agent Authority Least Privilege Framework
     - **MI-20 (AIR-PREV-020)**: MCP Server Security Governance
     - **MI-21 (AIR-DET-021)**: Agent Decision Audit and Explainability
   - Includes new "MCP Proxy" node for centralized governance
   - Updated flows and relationships

3. **`control-validation-analysis.md`**
   - Detailed analysis of all embedded controls
   - Validation against FINOS AI Governance Framework
   - Mapping of control IDs to mitigations
   - Assessment of CALM specification correctness
   - Recommendations for enhancements

4. **`MCP-Architecture-Augmentation-Guide.md`** ⭐ **PRIMARY DOCUMENTATION**
   - **Comprehensive 40+ page guide** on augmenting MCP architectures
   - Integration of architecture patterns with embedded controls
   - **Detailed agent-to-agent communication patterns** (Section 4)
   - Tiered implementation approaches
   - Control embedding best practices
   - Implementation roadmap
   - Three real-world case studies

5. **`README.md`** (this file)
   - Overview of workshop materials

---

## Key Findings

### ✅ Control Validation Results

**All existing controls validated successfully:**
- 8 core AIR controls properly referenced (MI-1, MI-2, MI-3, MI-4, MI-5, MI-6/CORR-001, MI-7, MI-12)
- 7 threats/risks correctly identified (AIR-OP-004, AIR-SEC-001, AIR-SEC-002, AIR-OP-015, AIR-OP-020, AIR-REG-001, AIR-SEC-010)
- CALM 1.0-rc1 schema properly used
- No incorrect or non-existent controls found

**Three new MCP-specific controls added:**
- **MI-18**: Critical for controlling agent access to tools and APIs
- **MI-20**: Essential for managing MCP server supply chain risk
- **MI-21**: Required for regulatory compliance and audit trails

### 🏗️ Architecture Enhancements

1. **New MCP Proxy Node**: Implements centralized MCP server governance
2. **Enhanced Agent Authority Controls**: Added at both API Gateway and Tool Manager levels
3. **Comprehensive Decision Audit**: Tier-appropriate logging and explainability
4. **Agent-to-Agent Patterns**: Four detailed patterns for inter-agent communication

---

## Quick Start

### For Workshop Attendees

**If you want to see the corrected CALM architecture:**
```bash
cat enterprise-mcp-with-air-controls-v3-corrected.calm.json | jq
```

**If you want to validate the CALM file:**
```bash
npx @finos/calm-cli validate enterprise-mcp-with-air-controls-v3-corrected.calm.json
```

**If you want to understand the architecture:**
1. Read `control-validation-analysis.md` for control details
2. Read `MCP-Architecture-Augmentation-Guide.md` for comprehensive patterns
3. Review the CALM JSON to see how controls are embedded

### For Architects and Engineers

**Recommended reading order:**

1. **Start here**: `MCP-Architecture-Augmentation-Guide.md`
   - Section 1-2: Understand MCP architecture and new controls
   - Section 3: Review architectural patterns with embedded controls
   - Section 4: Study agent-to-agent communication patterns ⭐
   - Section 5-6: Learn control embedding practices and implementation roadmap

2. **Deep dive**: `control-validation-analysis.md`
   - Understand control IDs and mappings
   - See validation methodology
   - Review recommendations

3. **Implementation**: `enterprise-mcp-with-air-controls-v3-corrected.calm.json`
   - See concrete CALM representation
   - Study control embedding syntax
   - Use as template for your architecture

---

## Key Sections for Different Audiences

### Security Engineers
- **Section 2**: FINOS AI Governance Framework Controls for MCP
- **Section 3.2**: Multiple MCP Servers with Centralized Proxy pattern
- **Section 5**: Control Embedding Best Practices
- **Case Study 1**: Financial Services Customer Support Agent

### Enterprise Architects
- **Section 1**: Introduction to MCP Architecture Patterns
- **Section 3**: All Architectural Patterns with Embedded Controls
- **Section 6**: Implementation Roadmap
- **Case Study 3**: Autonomous Trading System

### Compliance Officers
- **Section 2.2**: New MCP-Specific Controls (MI-18, MI-20, MI-21)
- **Section 5.2**: Control Tiering Decision Framework
- **Section 5.3**: Creating Architecture Decision Records
- **All Case Studies**: Regulatory compliance examples

### Platform Engineers
- **Section 3**: Architectural Patterns
- **Section 4**: Agent-to-Agent Communication Patterns ⭐
- **Section 6**: Implementation Roadmap with phases
- **Case Study 2**: Software Development AI Assistant

---

## Agent-to-Agent Communication Patterns (Section 4)

One of the most valuable sections of the guide is **Section 4: Agent-to-Agent Communication Patterns**, which provides detailed guidance on:

### Pattern 4.A: Sequential Agent Chaining
- Agent handoffs with context preservation
- Identity propagation through agent chains
- Authorization at each hop

### Pattern 4.B: Parallel Agent Orchestration
- Orchestrator agent fanning out to specialists
- Result aggregation with separation of duties
- Preventing orchestrator privilege escalation

### Pattern 4.C: Agent Collaboration with Shared Context
- Multiple agents working on shared session data
- Context poisoning prevention
- Cryptographic integrity protection

### Pattern 4.D: Agent Approval Workflows
- Multi-agent approval for high-risk actions
- Separation of duties enforcement
- Audit trail requirements

Each pattern includes:
- Architecture diagrams
- Security risks and mitigations
- CALM JSON examples
- Embedded control configurations

---

## Workshop Discussion Topics

### Topic 1: Control Tiering Approaches
**Question**: How should organizations choose between Tier 1, 2, and 3 implementations?
- **Reference**: Section 5.2 (Control Tiering Decision Framework)
- **Case Studies**: All three case studies show different tier selections

### Topic 2: Agent-to-Agent Security
**Question**: What are the biggest security risks in agent-to-agent communication?
- **Reference**: Section 4 (all subsections)
- **Key Risks**: Privilege escalation, context poisoning, circular dependencies

### Topic 3: MCP Server Supply Chain
**Question**: How can we ensure third-party MCP servers are secure?
- **Reference**: Section 2.2 (MI-20: MCP Server Security Governance)
- **Pattern**: Section 3.2 (Multiple MCP Servers with Centralized Proxy)

### Topic 4: Regulatory Compliance
**Question**: What audit trail is sufficient for financial services regulators?
- **Reference**: Section 2.2 (MI-21: Agent Decision Audit)
- **Case Study**: Case Study 1 (Financial Services) and Case Study 3 (Trading)

### Topic 5: CALM Control Embedding
**Question**: What's the best way to represent controls in CALM?
- **Reference**: Section 5.1 (CALM Control Embedding Patterns)
- **Examples**: Throughout the corrected CALM JSON file

---

## Changes from Version 2.1 to 3.0

### Additions

1. **New Node**: `mcp-proxy` (MCP Proxy Server)
   - Centralized MCP server governance
   - Allowlist enforcement
   - Security vetting coordination

2. **New Controls on `api-gateway`**:
   - `agent-authority-least-privilege` (MI-18 at gateway level)

3. **New Controls on `mcp-service`**:
   - `agent-authority-tool-manager` (MI-18 at tool manager level)
   - `mcp-server-security-governance` (MI-20)
   - `agent-decision-audit-explainability` (MI-21)

4. **New Relationship**: `mcp-to-proxy`
   - Connects MCP service to MCP proxy
   - Enforces supply chain governance

5. **Updated Flow Summary**:
   - Added three new controls to `controls-applied` list
   - Added three new threats to `threats-mitigated` list

### Metadata Updates
- Version: 2.1 → 3.0
- Last reviewed: 2025-10-10 → 2025-10-16
- Description updated to reference PR #218

---

## Validation and Testing

### CALM Schema Validation
```bash
# Install CALM CLI if needed
npm install -g @finos/calm-cli

# Validate the corrected CALM file
calm-cli validate enterprise-mcp-with-air-controls-v3-corrected.calm.json
```

### Control Coverage Check
All identified threats and risks have corresponding controls:
- ✅ AIR-OP-004 (Hallucination) → MI-4 (Observability)
- ✅ AIR-SEC-010 (Prompt Injection) → MI-3 (Firewalling)
- ✅ AIR-SEC-002 (Vector Store Leakage) → MI-2 (Data Filtering)
- ✅ AIR-SEC-001 (Data Poisoning) → MI-2 (Data Filtering)
- ✅ RI-24 (Authorization Bypass) → MI-18 (Agent Authority)
- ✅ RI-26 (Supply Chain Compromise) → MI-20 (MCP Governance)
- ✅ RI-25 (Tool Chain Manipulation) → MI-21 (Decision Audit)

---

## References

### Primary Sources
- **FINOS AI Governance Framework**: https://github.com/finos/ai-governance-framework
- **PR #218 (New Controls)**: https://github.com/finos/ai-governance-framework/pull/218
- **MCP CALM Demo**: https://github.com/jpgough-ms/mcp-calm-demo
- **CALM Specification**: https://calm.finos.org/
- **MCP Specification**: https://modelcontextprotocol.io/specification/

### Related Standards
- **NIST AI RMF**: https://www.nist.gov/itl/ai-risk-management-framework
- **ISO 42001**: https://www.iso.org/standard/81230.html
- **EU AI Act**: https://eur-lex.europa.eu/eli/reg/2024/1689/oj
- **GDPR Article 22**: https://gdpr-info.eu/art-22-gdpr/

---

## Contributing and Feedback

This is a living document prepared for the OSFF Workshop. Feedback and contributions are welcome:

- **FINOS AI Governance Working Group**: Submit issues or PRs to the AI Governance Framework repository
- **Workshop Feedback**: Share during the workshop discussion sessions
- **Email Contact**: Via FINOS mailing lists

---

## License

These materials are provided under Creative Commons Attribution 4.0 International (CC BY 4.0):
https://creativecommons.org/licenses/by/4.0/

You are free to:
- Share: Copy and redistribute the material
- Adapt: Remix, transform, and build upon the material

Under the following terms:
- Attribution: You must give appropriate credit to FINOS and the AI Governance Working Group

---

## Acknowledgments

**Contributors:**
- FINOS AI Governance Framework Working Group
- FINOS Architecture as Code Community
- MCP Community and Specification Authors

**Source Materials:**
- Enterprise MCP CALM file by karlmoll (codegen_sandbox repository)
- MCP CALM Demo by jpgough-ms
- FINOS AI Governance Framework PR #218 contributors

**Prepared for:**
FINOS Open Source in Finance Forum (OSFF) Workshop - October 2025

---

**Document Version**: 1.0  
**Last Updated**: 2025-10-16  
**Status**: Ready for Workshop Distribution
