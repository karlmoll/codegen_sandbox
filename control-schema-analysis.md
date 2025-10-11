# CALM 1.0-rc1 Control Schema Analysis

## 🚨 Critical Issues Found in Our Generated Spec

### ❌ **Issue 1: Incorrect Property Names**

**Our Generated Spec (WRONG):**
```json
"requirements": [
  {
    "requirement-url": "https://...",     ← ❌ WRONG property name
    "config-url": "https://..."           ← ❌ WRONG property name
  }
]
```

**Official CALM 1.0-rc1 Schema (CORRECT):**
```json
"requirements": [
  {
    "control-requirement-url": "https://...",   ← ✅ CORRECT
    "control-config-url": "https://..."         ← ✅ CORRECT
  }
]
```

**OR with inline config:**
```json
"requirements": [
  {
    "control-requirement-url": "https://...",
    "control-config": {                         ← ✅ Inline config object
      "control-id": "security-001",
      "name": "OAuth 2.1 Authorization",
      "description": "...",
      // domain-specific properties
    }
  }
]
```

---

### ✅ **What We Got Right**

1. ✅ **Controls as node properties** - Confirmed correct by official schema
2. ✅ **Control structure** - `{ description, requirements }` format is correct
3. ✅ **Multiple control levels** - Architecture, node, relationship, flow levels all supported
4. ✅ **Control grouping** - Named control groups (e.g., "oauth-authorization", "ai-observability")

---

## 📋 Official CALM 1.0-rc1 Control Schema

### Control Detail Schema
```json
"control-detail": {
  "type": "object",
  "properties": {
    "control-requirement-url": {
      "type": "string",
      "description": "The requirement schema that specifies how a control should be defined"
    },
    "control-config-url": {
      "type": "string", 
      "description": "The configuration of how the control requirement schema is met"
    },
    "control-config": {
      "type": "object",
      "description": "Inline configuration of how the control requirement schema is met"
    }
  },
  "required": ["control-requirement-url"],
  "oneOf": [
    { "required": ["control-config-url"] },
    { "required": ["control-config"] }
  ]
}
```

**Key Points:**
- `control-requirement-url` is REQUIRED
- Must have EITHER `control-config-url` OR `control-config` (not both)
- Inline `control-config` must include: `control-id`, `name`, `description` at minimum

---

### Controls Schema
```json
"controls": {
  "type": "object",
  "patternProperties": {
    "^[a-zA-Z0-9-]+$": {
      "type": "object",
      "properties": {
        "description": {
          "type": "string",
          "description": "A description of a control and how it applies to a given architecture"
        },
        "requirements": {
          "type": "array",
          "items": {
            "$ref": "#/defs/control-detail"
          }
        }
      },
      "required": ["description", "requirements"]
    }
  }
}
```

**Key Points:**
- Control names must match `^[a-zA-Z0-9-]+$` (alphanumeric + hyphens)
- Both `description` and `requirements` are REQUIRED
- `requirements` is an array (can have multiple control details)

---

### Control Requirement Schema (Base)
```json
"control-requirement": {
  "type": "object",
  "properties": {
    "control-id": {
      "type": "string",
      "description": "The unique identifier of this control"
    },
    "name": {
      "type": "string", 
      "description": "The name of the control requirement"
    },
    "description": {
      "type": "string",
      "description": "A detailed description of the control"
    }
  },
  "required": ["control-id", "name", "description"]
}
```

**Key Points:**
- All three properties are REQUIRED: `control-id`, `name`, `description`
- Control configs must include these base properties + domain-specific properties

---

## 🔧 Required Fixes for Our Spec

### Fix 1: Update Property Names
```diff
  "requirements": [
    {
-     "requirement-url": "https://air-governance-framework.finos.org/mitigations/mi-1_ai-system-risk-assessment.html",
-     "config-url": "https://controls.company.example/air/risk-assessment.config.json"
+     "control-requirement-url": "https://air-governance-framework.finos.org/mitigations/mi-1_ai-system-risk-assessment.html",
+     "control-config-url": "https://controls.company.example/air/risk-assessment.config.json"
    }
  ]
```

### Fix 2: Consider Inline Configs for AIR Controls
For better clarity, AIR controls could use inline configs:

```json
"ai-system-risk-assessment": {
  "description": "Comprehensive AI System Risk Assessment conducted before deployment",
  "requirements": [
    {
      "control-requirement-url": "https://air-governance-framework.finos.org/mitigations/mi-1_ai-system-risk-assessment.requirement.json",
      "control-config": {
        "control-id": "AIR-PREV-001",
        "name": "AI System Risk Assessment",
        "description": "Conduct comprehensive risk assessments for AI systems before deployment",
        "assessment-frequency": "pre-deployment",
        "risk-categories": ["operational", "security", "regulatory", "reputational"],
        "severity-levels": ["low", "medium", "high", "critical"],
        "mitigation-required": true,
        "approval-required": true,
        "frameworks": ["FINOS AIR 1.0", "NIST AI RMF"]
      }
    }
  ]
}
```

---

## 📊 Comparison: External vs Inline Configs

### External Config (Best for Reuse)
```json
"requirements": [
  {
    "control-requirement-url": "https://calm.finos.org/workshop/controls/micro-segmentation.requirement.json",
    "control-config-url": "https://calm.finos.org/workshop/controls/micro-segmentation.config.json"
  }
]
```

**Advantages:**
- ✅ Reusable across architectures
- ✅ Versioned independently
- ✅ Environment-specific configs (dev, prod)
- ✅ Centralized management

**Use When:**
- Control is shared across multiple architectures
- Configuration changes frequently
- Multiple environments need different configs

---

### Inline Config (Best for Clarity)
```json
"requirements": [
  {
    "control-requirement-url": "https://calm.finos.org/workshop/controls/api-security.requirement.json",
    "control-config": {
      "control-id": "api-001",
      "name": "API Authentication and Authorization",
      "description": "Secure API access with OAuth2 and rate limiting",
      "authentication": {
        "type": "OAuth2",
        "scopes": ["trade:read", "trade:write"],
        "token-expiry": "1h"
      },
      "rate-limiting": {
        "requests-per-minute": 1000,
        "burst-limit": 100
      }
    }
  }
]
```

**Advantages:**
- ✅ Self-contained (all info in one file)
- ✅ Easy to review in context
- ✅ No external dependencies
- ✅ Easier to understand at a glance

**Use When:**
- Control is architecture-specific
- Configuration is stable
- Reviewing the architecture as a complete document

---

## 🎯 Recommendations for Our AIR Controls Spec

### Option A: Keep External Configs (Current Approach)
**Good for:** Enterprise governance, config management, reuse

```json
"ai-hallucination-mitigation": {
  "description": "Controls to detect and mitigate LLM hallucinations",
  "requirements": [
    {
      "control-requirement-url": "https://air-governance-framework.finos.org/mitigations/mi-hallucination-detection.requirement.json",
      "control-config-url": "https://controls.company.example/air/hallucination-detection.config.json"
    }
  ]
}
```

### Option B: Use Inline Configs for AIR (Better for Demos/Examples)
**Good for:** Documentation, examples, self-contained specs

```json
"ai-hallucination-mitigation": {
  "description": "Controls to detect and mitigate LLM hallucinations",
  "requirements": [
    {
      "control-requirement-url": "https://air-governance-framework.finos.org/mitigations/mi-hallucination-detection.requirement.json",
      "control-config": {
        "control-id": "AIR-OP-004",
        "name": "Hallucination Detection and Mitigation",
        "description": "Detect and mitigate LLM hallucinations through confidence scoring, grounding, and human-in-the-loop validation",
        "detection-methods": ["confidence-scoring", "fact-checking", "source-grounding"],
        "confidence-threshold": 0.85,
        "human-review-required": true,
        "mitigation-strategies": ["response-filtering", "uncertainty-acknowledgment", "source-citation"],
        "monitoring": {
          "enabled": true,
          "alert-on-low-confidence": true,
          "log-all-outputs": true
        }
      }
    }
  ]
}
```

### Option C: Hybrid Approach (Best of Both)
- **External configs** for common security controls (OAuth, TLS, etc.)
- **Inline configs** for AIR-specific controls (domain-specific, self-documenting)

---

## ✅ Action Items

1. **MUST FIX:** Update property names from `requirement-url`/`config-url` to `control-requirement-url`/`control-config-url`

2. **SHOULD CONSIDER:** Add inline `control-config` for AIR controls to make them more self-documenting

3. **VALIDATE:** Ensure all control configs include required properties:
   - `control-id`
   - `name`
   - `description`

4. **ENHANCE:** Add domain-specific properties to AIR control configs:
   - Risk levels, mitigation strategies, monitoring configs, etc.

---

## 📚 Official CALM MCP Examples

The ControlCreationTool provides these official examples:

### Architecture-Level Control
```json
{
  "controls": {
    "network-security": {
      "description": "Network-level security controls for the trading platform",
      "requirements": [
        {
          "control-requirement-url": "https://calm.finos.org/workshop/controls/micro-segmentation.requirement.json",
          "control-config": {
            "control-id": "security-001",
            "name": "Micro-segmentation of Trading Network",
            "description": "Network micro-segmentation to prevent lateral movement",
            "permit-ingress": true,
            "permit-egress": false,
            "network-zones": ["trading", "settlement", "reporting"]
          }
        }
      ]
    }
  }
}
```

### Node-Level Control
```json
{
  "unique-id": "trading-api",
  "node-type": "service",
  "controls": {
    "api-security": {
      "description": "API-specific security controls",
      "requirements": [
        {
          "control-requirement-url": "https://calm.finos.org/workshop/controls/api-security.requirement.json",
          "control-config": {
            "control-id": "api-001",
            "name": "API Authentication and Authorization",
            "description": "Secure API access with OAuth2 and rate limiting",
            "authentication": {
              "type": "OAuth2",
              "scopes": ["trade:read", "trade:write"]
            }
          }
        }
      ]
    }
  }
}
```

---

## 🎯 Conclusion

Our generated spec is **architecturally correct** (controls as node properties) but needs:

1. ✅ Property name fixes: `control-requirement-url` and `control-config-url`
2. ✅ Optional enhancement: Inline `control-config` for AIR controls with full metadata

The official schema confirms that our approach of embedding controls in nodes is correct, we just need to use the proper property names!
