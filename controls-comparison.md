# CALM Controls Format Comparison

## Original Format vs. New Format - Why the New Format is More Correct

### Key Architectural Differences

## 1. **Location of Controls Declaration**

### Original Format (Incorrect):
```json
{
  "$schema": "https://calm.finos.org/release/1.0/meta/calm.json",
  "metadata": { ... },
  "controls": {
    "oauth-authorization": {
      "description": "OAuth 2.1 Authorization Code + PKCE...",
      "requirements": [
        {
          "requirement-url": "https://controls.company.example/security/oauth-authorization",
          "config": {
            "appliesTo": {
              "nodes": ["mcp-service", "oidc-provider", "external-client", "api-gateway"],
              "relationships": ["client-to-gateway", "gateway-validates-jwt"]
            },
            "scopes": ["mcp:connect", "mcp:tools:read"],
            "pkce": "S256"
          }
        }
      ],
      "air-controls": ["AIR-PREV-012", "AIR-PREV-003"]
    }
  },
  "nodes": [
    {
      "unique-id": "api-gateway",
      "metadata": {
        "air": {
          "threats": ["AIR-SEC-010"],
          "controls": [
            { "category": "Preventative", "name": "...", "id": "AIR-PREV-003" }
          ],
          "risk-level": "critical"
        }
      }
    }
  ]
}
```

### New Format (Correct - Following CALM MCP Demo):
```json
{
  "$schema": "https://calm.finos.org/release/1.0/meta/calm.json",
  "metadata": { ... },
  "nodes": [
    {
      "unique-id": "api-gateway",
      "node-type": "service",
      "name": "Enterprise API Gateway",
      "controls": {
        "oauth-authorization": {
          "description": "OAuth 2.1 Authorization Code + PKCE with OIDC metadata",
          "requirements": [
            {
              "requirement-url": "https://controls.company.example/security/oauth-authorization.requirement.json",
              "config-url": "https://controls.company.example/security/oauth-authorization.config.json"
            }
          ]
        },
        "ai-access-control": {
          "description": "Role-Based Access Control for AI Data and Model Access",
          "requirements": [
            {
              "requirement-url": "https://air-governance-framework.finos.org/mitigations/mi-12_role-based-access-control-for-ai-data.html",
              "config-url": "https://controls.company.example/air/rbac-ai-data.config.json"
            }
          ]
        }
      }
    }
  ]
}
```

---

## 2. **Configuration Reference Pattern**

### Original Format:
- **Inline `config` objects** with complex nested structures
- Contains `appliesTo` with arrays of nodes and relationships
- Mixes control definition with application mapping
- Creates maintenance burden (duplicated configs)

```json
"requirements": [
  {
    "requirement-url": "...",
    "config": {
      "appliesTo": { "nodes": ["node1", "node2"], "relationships": ["rel1"] },
      "scopes": ["mcp:connect"],
      "pkce": "S256"
    }
  }
]
```

### New Format:
- **External `config-url` references** (separation of concerns)
- Config is externalized to dedicated files
- Enables config reuse and versioning
- Follows the segmented-mcp demo pattern exactly

```json
"requirements": [
  {
    "requirement-url": "https://controls.company.example/security/oauth-authorization.requirement.json",
    "config-url": "https://controls.company.example/security/oauth-authorization.config.json"
  }
]
```

---

## 3. **Control-to-Node Relationship**

### Original Format Problems:
```json
"controls": {
  "oauth-authorization": {
    "requirements": [{
      "config": {
        "appliesTo": {
          "nodes": ["mcp-service", "oidc-provider", "external-client", "api-gateway"]
        }
      }
    }]
  }
}
```
❌ **Global controls** with `appliesTo` mapping
❌ **Indirection** - must trace which nodes use which controls
❌ **Violates single responsibility** - control definition also contains application logic
❌ **Not how CALM spec works** - controls should be node properties

### New Format Advantages:
```json
{
  "unique-id": "api-gateway",
  "controls": {
    "oauth-authorization": { ... }
  }
}
```
✅ **Explicit node-control binding** - controls declared where they apply
✅ **Clear ownership** - each node declares its own controls
✅ **Follows CALM architecture** - controls are node properties
✅ **Matches reference demo** - exactly how segmented-mcp does it

---

## 4. **Metadata vs. Controls**

### Original Format:
- Mixed AIR information in two places:
  1. Top-level `metadata.air-governance` (framework definitions)
  2. Top-level `controls` (control requirements with `air-controls` arrays)
  3. Node-level `metadata.air` (threat/control IDs only)

```json
"metadata": {
  "air-governance": {
    "controls": [
      { "id": "AIR-PREV-001", "name": "...", "description": "..." }
    ]
  }
},
"controls": {
  "oauth-authorization": {
    "air-controls": ["AIR-PREV-012", "AIR-PREV-003"]
  }
},
"nodes": [{
  "metadata": {
    "air": {
      "controls": [{ "id": "AIR-PREV-003", "name": "..." }]
    }
  }
}]
```

### New Format:
- **Clear separation**:
  1. `metadata.air-governance-framework` = Framework reference only
  2. Node `controls` = Actual control requirements with AIR references
  3. Relationship `metadata.air-threats-addressed` = Context-specific threat info

```json
"metadata": {
  "air-governance-framework": {
    "framework": "FINOS AIR",
    "version": "1.0",
    "reference": "https://air-governance-framework.finos.org/"
  }
},
"nodes": [{
  "controls": {
    "ai-system-risk-assessment": {
      "description": "Comprehensive AI System Risk Assessment",
      "requirements": [{
        "requirement-url": "https://air-governance-framework.finos.org/mitigations/mi-1_ai-system-risk-assessment.html",
        "config-url": "https://controls.company.example/air/risk-assessment.config.json"
      }]
    }
  }
}]
```

---

## 5. **Why the New Format is More Correct**

### Architectural Principles:

#### **1. Follows CALM Specification Intent**
- CALM nodes have a `controls` property for a reason
- Controls are **node attributes**, not global mappings
- Reference demo (segmented-mcp) validates this pattern

#### **2. Separation of Concerns**
- **Requirement definition** → External requirement-url
- **Configuration** → External config-url
- **Application** → Node's controls property
- **Framework reference** → Metadata only

#### **3. Maintainability**
```
Original: Change a control → Update global controls + update all node metadata
New:      Change a control → Update node's controls section only
```

#### **4. Clarity & Readability**
```
Original: "Which nodes use oauth-authorization?"
          → Search controls.oauth-authorization.requirements.config.appliesTo.nodes

New:      "Which nodes use oauth-authorization?"
          → Search nodes[*].controls.oauth-authorization (direct query)
```

#### **5. Scalability**
- **Original**: Global controls grow linearly with architecture complexity
- **New**: Controls distributed across nodes (bounded growth per node)

#### **6. Reusability**
- External config-url enables:
  - Config versioning (e.g., `v1/oauth.config.json`, `v2/oauth.config.json`)
  - Environment-specific configs (dev, staging, prod)
  - Cross-architecture config reuse

---

## 6. **CALM MCP Best Practices Alignment**

The new format directly mirrors the **segmented-mcp.architecture.json** demo:

```json
// From FINOS CALM MCP Demo
{
  "unique-id": "secret-api",
  "controls": {
    "security": {
      "description": "Lock down an individual POD workload",
      "requirements": [
        {
          "requirement-url": "https://calm.finos.org/workshop/controls/micro-segmentation.requirement.json",
          "config-url": "https://calm.finos.org/workshop/controls/micro-segmentation.config.json"
        }
      ]
    }
  }
}
```

This is the **canonical pattern** from FINOS for embedding controls in CALM specifications.

---

## Summary Table

| Aspect | Original Format | New Format | Winner |
|--------|----------------|------------|--------|
| **Control Location** | Global `controls` object | Node-level `controls` property | ✅ New |
| **Config Pattern** | Inline `config` objects | External `config-url` references | ✅ New |
| **Node-Control Mapping** | Indirect via `appliesTo` | Direct declaration in node | ✅ New |
| **Separation of Concerns** | Mixed (definition + application) | Clean (separated) | ✅ New |
| **Matches CALM Demo** | ❌ No | ✅ Yes | ✅ New |
| **Maintainability** | Low (global changes) | High (localized changes) | ✅ New |
| **Queryability** | Indirect (requires mapping) | Direct (node properties) | ✅ New |
| **Scalability** | Poor (monolithic controls) | Good (distributed) | ✅ New |

---

## Conclusion

The **new format is architecturally superior** because it:

1. ✅ **Follows the FINOS CALM MCP reference demo exactly**
2. ✅ **Aligns with CALM specification design** (controls as node properties)
3. ✅ **Implements separation of concerns** (config externalization)
4. ✅ **Improves maintainability** (localized control declarations)
5. ✅ **Enhances clarity** (direct node-to-control relationship)
6. ✅ **Enables better tooling** (config versioning, reuse, environments)

The original format attempted to centralize controls globally with `appliesTo` mappings, which violates CALM's node-centric architecture. The new format correctly embeds controls as **first-class node properties** with externalized configurations, matching both the CALM specification intent and the FINOS reference implementation.
