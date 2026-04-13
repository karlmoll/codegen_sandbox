# Visual Side-by-Side Controls Format Comparison

## Critical Structural Differences

---

## 1. 🎯 **Control Declaration Location**

### ❌ Original Format (Anti-Pattern)
```json
{
  "$schema": "https://calm.finos.org/release/1.0/meta/calm.json",
  
  "controls": {                           ← ⚠️ WRONG: Global controls object
    "oauth-authorization": {              ← Controls defined at root level
      "description": "...",
      "requirements": [{
        "requirement-url": "...",
        "config": {                       ← ⚠️ Inline config with appliesTo mapping
          "appliesTo": {
            "nodes": ["api-gateway", "mcp-service", "oidc-provider"],
            "relationships": ["client-to-gateway"]
          },
          "scopes": ["mcp:connect"],
          "pkce": "S256"
        }
      }],
      "air-controls": ["AIR-PREV-012"]    ← ⚠️ Reference to AIR controls
    }
  },
  
  "nodes": [{
    "unique-id": "api-gateway",
    "node-type": "service",
    "metadata": {                         ← ⚠️ WRONG: AIR data in metadata only
      "air": {
        "threats": ["AIR-SEC-010"],
        "controls": [
          {"id": "AIR-PREV-003", "name": "..."}
        ]
      }
    }
  }]
}
```

**Problems:**
- ❌ Controls are **global** with indirect `appliesTo` mappings
- ❌ Violates CALM's node-centric architecture
- ❌ AIR controls are just **metadata** (not enforceable requirements)
- ❌ Does **NOT** match the FINOS CALM MCP demo pattern

---

### ✅ New Format (Correct Pattern from CALM MCP Demo)
```json
{
  "$schema": "https://calm.finos.org/release/1.0/meta/calm.json",
  
  "metadata": {
    "air-governance-framework": {         ← Framework reference only
      "framework": "FINOS AIR",
      "version": "1.0",
      "reference": "https://air-governance-framework.finos.org/"
    }
  },
  
  "nodes": [{
    "unique-id": "api-gateway",
    "node-type": "service",
    "controls": {                         ← ✅ CORRECT: Controls as node property
      "oauth-authorization": {            ← Control declared where it applies
        "description": "OAuth 2.1 Authorization Code + PKCE",
        "requirements": [{
          "requirement-url": "https://controls.company.example/security/oauth-authorization.requirement.json",
          "config-url": "https://controls.company.example/security/oauth-authorization.config.json"
        }]                                ← ✅ Externalized config
      },
      "ai-access-control": {              ← ✅ AIR control as enforceable requirement
        "description": "Role-Based Access Control for AI Data",
        "requirements": [{
          "requirement-url": "https://air-governance-framework.finos.org/mitigations/mi-12_role-based-access-control-for-ai-data.html",
          "config-url": "https://controls.company.example/air/rbac-ai-data.config.json"
        }]
      }
    }
  }]
}
```

**Advantages:**
- ✅ Controls are **node properties** (direct, not mapped)
- ✅ Follows CALM specification design principles
- ✅ AIR controls are **enforceable requirements** with URLs
- ✅ **Exactly matches** the segmented-mcp.architecture.json demo

---

## 2. 🔗 **Configuration Pattern**

### ❌ Original: Inline Config with Mapping Logic
```json
"requirements": [{
  "requirement-url": "https://controls.company.example/security/oauth-authorization",
  "config": {                             ← ⚠️ Inline configuration object
    "appliesTo": {                        ← ⚠️ Mapping logic inside control
      "nodes": ["mcp-service", "oidc-provider", "external-client", "api-gateway"],
      "relationships": ["client-to-gateway", "gateway-validates-jwt"]
    },
    "scopes": ["mcp:connect", "mcp:tools:read", "mcp:resources:read"],
    "pkce": "S256",
    "rotationDays": 30,
    "brokeredIdentity": true
  }
}]
```

**Problems:**
- ❌ Config is **hardcoded** in the architecture spec
- ❌ No versioning or environment-specific configs
- ❌ Contains `appliesTo` logic (application + definition mixed)
- ❌ Cannot reuse configs across architectures
- ❌ Changes require editing the entire CALM spec

---

### ✅ New: External Config Reference (Separation of Concerns)
```json
"requirements": [{
  "requirement-url": "https://controls.company.example/security/oauth-authorization.requirement.json",
  "config-url": "https://controls.company.example/security/oauth-authorization.config.json"
}]                                        ← ✅ Clean, simple, externalized
```

**Referenced files (externalized):**

`oauth-authorization.requirement.json`:
```json
{
  "control-id": "oauth-authorization",
  "name": "OAuth 2.1 Authorization",
  "description": "OAuth 2.1 with PKCE and OIDC",
  "framework": "IETF RFC 8414, RFC 8725",
  "validation-rules": [
    "PKCE required",
    "S256 code challenge method",
    "Token expiration <= 3600s"
  ]
}
```

`oauth-authorization.config.json`:
```json
{
  "scopes": ["mcp:connect", "mcp:tools:read", "mcp:resources:read"],
  "pkce": "S256",
  "token-ttl-seconds": 3600,
  "refresh-enabled": true,
  "environment": "production"
}
```

**Advantages:**
- ✅ **Separation**: Architecture (CALM) vs. Config (external)
- ✅ **Versioning**: Can reference `v1/config.json`, `v2/config.json`
- ✅ **Environments**: `dev.config.json`, `prod.config.json`
- ✅ **Reusability**: Same config across multiple architectures
- ✅ **Governance**: Config changes don't require spec changes

---

## 3. 🏗️ **Architecture: Global vs. Node-Centric**

### ❌ Original: Centralized "Database" Pattern
```
Architecture:
┌─────────────────────────────────────────────────────────┐
│ CALM Spec                                               │
│                                                         │
│  controls: {                  ← Global Controls Registry│
│    oauth-authorization: {...}                           │
│    fine-grained-authz: {...}                            │
│    secrets-mgmt: {...}                                  │
│  }                                                      │
│                                                         │
│  nodes: [                                               │
│    { id: "gateway",                                     │
│      metadata: { air: { controls: ["AIR-PREV-003"] }}   │
│    },                          ↑                        │
│    { id: "mcp-service",        │ Indirection           │
│      metadata: { air: { ... }} │ (must resolve)        │
│    }                           │                        │
│  ]                             │                        │
│                                │                        │
│  controls.oauth-authorization  │                        │
│    .config.appliesTo.nodes ────┘                        │
│    = ["gateway", "mcp-service"]                         │
└─────────────────────────────────────────────────────────┘

Query: "What controls does api-gateway have?"
Answer: Search controls[*].config.appliesTo.nodes for "api-gateway"
        Then collect matching controls
        Then check node.metadata.air.controls
        Then merge results
```

---

### ✅ New: Distributed Node-Centric Pattern (CALM Design)
```
Architecture:
┌─────────────────────────────────────────────────────────┐
│ CALM Spec                                               │
│                                                         │
│  metadata: {                  ← Framework reference only│
│    air-governance-framework: {...}                      │
│  }                                                      │
│                                                         │
│  nodes: [                                               │
│    {                                                    │
│      id: "api-gateway",                                 │
│      controls: {              ← ✅ Controls HERE        │
│        oauth-authorization: {                           │
│          requirements: [{                               │
│            requirement-url: "...",                      │
│            config-url: "..."                            │
│          }]                                             │
│        },                                               │
│        ai-access-control: {                             │
│          requirements: [...]                            │
│        }                                                │
│      }                                                  │
│    },                                                   │
│    {                                                    │
│      id: "mcp-service",                                 │
│      controls: {              ← ✅ Controls HERE        │
│        ai-hallucination-mitigation: {...},              │
│        ai-observability: {...}                          │
│      }                                                  │
│    }                                                    │
│  ]                                                      │
└─────────────────────────────────────────────────────────┘

Query: "What controls does api-gateway have?"
Answer: nodes["api-gateway"].controls
        Done. ✅ Direct access.
```

---

## 4. 📊 **AIR Controls: Metadata vs. Requirements**

### ❌ Original: AIR as Decorative Metadata

```json
{
  "metadata": {
    "air-governance": {
      "controls": [
        {
          "id": "AIR-PREV-001",
          "name": "AI System Risk Assessment",
          "description": "...",
          "category": "Preventative"
        }
      ]
    }
  },
  
  "controls": {
    "oauth-authorization": {
      "air-controls": ["AIR-PREV-012", "AIR-PREV-003"]  ← ⚠️ Just IDs
    }
  },
  
  "nodes": [{
    "metadata": {
      "air": {
        "threats": ["AIR-SEC-010"],
        "controls": [
          { "id": "AIR-PREV-003", "name": "..." }      ← ⚠️ Metadata only
        ]
      }
    }
  }]
}
```

**Problem:** AIR controls are **documentation only** - no enforcement mechanism!

---

### ✅ New: AIR as Enforceable Requirements

```json
{
  "nodes": [{
    "unique-id": "mcp-service",
    "controls": {
      "ai-system-risk-assessment": {                    ← ✅ Named control
        "description": "Comprehensive AI System Risk Assessment",
        "requirements": [{                              ← ✅ Enforceable
          "requirement-url": "https://air-governance-framework.finos.org/mitigations/mi-1_ai-system-risk-assessment.html",
          "config-url": "https://controls.company.example/air/risk-assessment.config.json"
        }]
      },
      "ai-hallucination-mitigation": {
        "description": "Controls to detect and mitigate LLM hallucinations",
        "requirements": [{
          "requirement-url": "https://air-governance-framework.finos.org/threats/air-op-004_hallucination-inaccurate-outputs.html",
          "config-url": "https://controls.company.example/air/hallucination-detection.config.json"
        }]
      }
    }
  }],
  
  "relationships": [{
    "metadata": {
      "air-threats-addressed": [                        ← ✅ Contextual metadata
        "AIR-OP-004 (Hallucination and Inaccurate Outputs)"
      ],
      "air-controls-applied": [
        "AIR-DET-004 (AI System Observability)"
      ]
    }
  }]
}
```

**Advantage:** AIR controls are **first-class requirements** with validation URLs!

---

## 5. 🎨 **FINOS CALM MCP Demo Alignment**

### Reference Demo Pattern (segmented-mcp.architecture.json):
```json
{
  "unique-id": "secret-api",
  "name": "Secret API",
  "description": "Deployed API that should not be available to the MCP Server",
  "node-type": "service",
  "controls": {                                         ← Controls in node
    "security": {                                       ← Control name
      "description": "Lock down an individual POD workload",
      "requirements": [                                 ← Requirements array
        {
          "requirement-url": "https://calm.finos.org/workshop/controls/micro-segmentation.requirement.json",
          "config-url": "https://calm.finos.org/workshop/controls/micro-segmentation.config.json"
        }
      ]
    }
  }
}
```

### ✅ Our New Format (Matches Demo Exactly):
```json
{
  "unique-id": "api-gateway",
  "name": "Enterprise API Gateway",
  "node-type": "service",
  "controls": {                                         ← ✅ Controls in node
    "oauth-authorization": {                            ← ✅ Control name
      "description": "OAuth 2.1 Authorization Code + PKCE",
      "requirements": [                                 ← ✅ Requirements array
        {
          "requirement-url": "https://controls.company.example/security/oauth-authorization.requirement.json",
          "config-url": "https://controls.company.example/security/oauth-authorization.config.json"
        }
      ]
    }
  }
}
```

### ❌ Original Format (Does NOT Match):
```json
{
  "controls": {                                         ← ❌ Wrong location
    "oauth-authorization": {
      "requirements": [{
        "requirement-url": "...",
        "config": { "appliesTo": {...} }                ← ❌ Inline config
      }],
      "air-controls": ["AIR-PREV-012"]                  ← ❌ Not in demo
    }
  }
}
```

---

## 📋 Summary: Why New Format is Architecturally Superior

| Principle | Original ❌ | New ✅ | CALM MCP Demo |
|-----------|------------|--------|---------------|
| **Controls Location** | Global `controls` object | Node `controls` property | ✅ Node property |
| **Node-Control Binding** | Indirect via `appliesTo` | Direct declaration | ✅ Direct |
| **Config Pattern** | Inline `config` object | External `config-url` | ✅ External URL |
| **AIR Integration** | Metadata IDs only | Enforceable requirements | ✅ Requirements |
| **Separation of Concerns** | Mixed (def + app + config) | Clean (separated) | ✅ Separated |
| **Queryability** | Complex (must resolve) | Simple (direct access) | ✅ Direct |
| **Maintainability** | Poor (global changes) | Good (local changes) | ✅ Local |
| **Config Versioning** | Not possible | Fully supported | ✅ Supported |
| **CALM Compliance** | Violates node-centric design | Follows CALM design | ✅ Compliant |

---

## 🎯 The Fundamental Difference

### Original Approach:
> "Let's create a **global registry** of controls and map them to nodes using `appliesTo`"

**Result:** Violates CALM's node-centric architecture, creates indirection, mixes concerns.

### New Approach (CALM MCP):
> "Let's declare controls as **node properties**, exactly like interfaces, because that's how CALM is designed"

**Result:** Follows CALM specification, matches reference demo, enables proper tooling.

---

## ✅ Validation: The "Segmented MCP Demo" Test

The **definitive proof** that the new format is correct:

```bash
# FINOS Reference Demo
curl https://raw.githubusercontent.com/jpgough-ms/mcp-calm-demo/main/calm-architecture/src/segmented-mcp.architecture.json

# Shows: controls declared in nodes with requirement-url and config-url
```

Our new format **exactly replicates this proven pattern** while adding comprehensive AIR governance controls as first-class requirements.

---

## 🚀 Conclusion

The new format is more correct because it:

1. ✅ **Follows FINOS CALM MCP reference implementation exactly**
2. ✅ **Respects CALM's node-centric architecture** (controls as node properties)
3. ✅ **Implements proper separation of concerns** (architecture vs. config)
4. ✅ **Makes AIR controls enforceable** (requirements, not just metadata)
5. ✅ **Enables proper tooling** (config versioning, validation, reuse)
6. ✅ **Improves queryability** (direct access vs. resolution)
7. ✅ **Enhances maintainability** (localized changes vs. global updates)

**The original format is an anti-pattern** that tried to centralize controls globally, which is architecturally incompatible with how CALM specifications are designed to work.
