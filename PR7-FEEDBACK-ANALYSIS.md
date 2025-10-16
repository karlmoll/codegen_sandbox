# PR #7 Feedback Analysis & Restructuring Plan

## Executive Summary

This document analyzes feedback from CALM maintainer on PR #7 and identifies how it applies to the current PR #6 (OSFF Workshop Prep). Key issues identified:

1. **Controls Structure**: Controls should be externalized to `controls/` directory, not embedded inline
2. **Controls Application**: Use `controls[]` array on nodes/relationships, not nested object structure
3. **Protocol Values**: Non-standard protocol values breaking CALM Preview
4. **Mapping File**: Need file-mappings.json for tooling integration
5. **Docusaurus Setup**: Ready for documentation portal generation

---

## PR #7 Maintainer Feedback (Summary)

From: CALM Maintainer
On: Experimental file (`experimental-aigf-embedded-controls-enterprise-mcp-reference.calm.json`)

### Key Points:

1. **Controls Should Be Externalized**
   - ✅ PR #7 created `controls/configurations/` directory with separate config files
   - ✅ PR #7 created `controls/requirements/air-control-requirement.json` schema
   - ❌ Current PR #6 embeds controls inline in nodes (same issue as original)

2. **Controls Application Method**
   - ❌ Old approach: Document-level controls with `appliesTo` property
   - ✅ Correct: Use `controls[]` array directly on nodes and relationships
   - ❌ Current PR #6: Uses nested `controls` object (different but still incorrect)

3. **Protocol Values Breaking CALM Preview**
   - ❌ Values like `HTTPS-JWKS`, `LOG-SHIPPING`, `OTEL`, `WebSocket` not in CALM enum
   - ❌ Both old file and PR #6 have this issue

4. **Mapping File for Tooling**
   - ✅ PR #7 added `file-mappings.json` to map control `$id` to file locations
   - ❌ Current workspace missing this file

5. **Docusaurus Portal**
   - ✅ PR #7 added complete Docusaurus setup via `calm docify`
   - ❌ Current PR #6 doesn't have this integration

---

## Current State Analysis

### PR #6 (OSFF Workshop Prep) - Current Branch
**File**: `OSFF Workshop Prep/enterprise-mcp-with-air-controls-v3-corrected.calm.json`

#### Structure:
```json
{
  "$schema": "https://calm.finos.org/release/1.0-rc1/meta/calm.json",
  "nodes": [
    {
      "unique-id": "external-client",
      "controls": {
        "ai-prompt-injection-prevention": {
          "description": "...",
          "requirements": [{
            "control-requirement-url": "...",
            "control-config": { /* inline config */ }
          }]
        }
      }
    }
  ]
}
```

#### Issues Identified:

1. **Controls Structure** (HIGH PRIORITY)
   - Uses nested object structure: `controls.{control-name}.requirements[]`
   - Should use: `controls[]` array per CALM spec
   - Controls are inline, not externalized to `controls/` directory

2. **Protocol Values** (MEDIUM PRIORITY)
   - Line 137: `"protocol": "HTTPS"` ✅ Valid
   - Line 524, 1311: `"protocol": "HTTPS"` ✅ Valid
   - Line 1488, 1547, 1580, 1605, 1640, 1665, 1797: `"protocol": "HTTPS"` ✅ Valid
   - Line 1517: `"protocol": "HTTPS-JWKS"` ❌ Invalid (should be "HTTPS" with metadata)
   - Line 1689, 1716: `"protocol": "LOG-SHIPPING"` ❌ Invalid (should be in metadata)
   - Line 1745, 1770: `"protocol": "OTEL"` ❌ Invalid (should be "HTTPS" or metadata)

3. **Missing Infrastructure**
   - No `controls/` directory structure
   - No `file-mappings.json`
   - No Docusaurus integration (from PR #7 pattern)

### Old File (experimental-aigf-embedded-controls-enterprise-mcp-reference.calm.json)
**Location**: `/workspace/experimental-aigf-embedded-controls-enterprise-mcp-reference.calm.json`

#### Structure:
```json
{
  "controls": {
    "oauth-authorization": {
      "requirements": [{
        "config": {
          "appliesTo": {
            "nodes": ["..."],
            "relationships": ["..."]
          }
        }
      }]
    }
  }
}
```

#### Issues (Same as PR #7 identified):
- Document-level controls with `appliesTo` ❌
- Protocol issues (HTTPS-JWKS, LOG-SHIPPING, OTEL, WebSocket) ❌

---

## Conflict Detection

### Between PR #7 Feedback and PR #6:

| Issue | PR #7 Feedback | PR #6 Status | Conflict? |
|-------|---------------|--------------|-----------|
| Controls structure | Externalize to `controls/` | Inline in nodes | ⚠️ YES - Different approach |
| Controls application | Use `controls[]` array | Uses `controls{}` object | ⚠️ YES - Wrong format |
| Protocol values | Must be CALM enum | Uses non-standard values | ⚠️ YES - Same issue |
| Mapping file | Required for tooling | Missing | ⚠️ YES - Not present |
| Docusaurus | Setup via `calm docify` | Not present | ℹ️ INFO - Can add |

### Resolution Priority:

1. **CRITICAL**: Restructure controls to use `controls[]` array format
2. **CRITICAL**: Externalize controls to `controls/` directory  
3. **HIGH**: Fix protocol values to CALM-compliant enums
4. **MEDIUM**: Add file-mappings.json for tooling
5. **LOW**: Add Docusaurus setup (nice-to-have for workshop)

---

## Restructuring Plan

### Phase 1: Controls Directory Setup (Based on PR #7 Pattern)

1. Create directory structure:
   ```
   controls/
   ├── requirements/
   │   └── air-control-requirement.json
   └── configurations/
       ├── air-prev-001-config.json
       ├── air-prev-002-config.json
       ├── air-prev-003-config.json
       ├── air-prev-007-config.json
       ├── air-prev-012-config.json
       ├── air-det-004-config.json
       ├── air-det-005-config.json
       ├── air-corr-001-config.json
       ├── air-mi-18-config.json  (NEW from PR #6)
       ├── air-mi-20-config.json  (NEW from PR #6)
       └── air-mi-21-config.json  (NEW from PR #6)
   ```

2. Extract control configs from PR #6 inline definitions to separate files

### Phase 2: CALM File Restructuring

Transform from:
```json
{
  "nodes": [{
    "unique-id": "api-gateway",
    "controls": {
      "oauth-authorization": {
        "description": "...",
        "requirements": [{
          "control-config": { /* ... */ }
        }]
      }
    }
  }]
}
```

To:
```json
{
  "nodes": [{
    "unique-id": "api-gateway",
    "controls": [
      {
        "control-requirement-url": "https://air-governance-framework.finos.org/calm/AIR-PREV-012",
        "control-config-url": "controls/configurations/air-prev-012-config.json"
      },
      {
        "control-requirement-url": "https://air-governance-framework.finos.org/calm/AIR-PREV-003", 
        "control-config-url": "controls/configurations/air-prev-003-config.json"
      }
    ]
  }]
}
```

### Phase 3: Protocol Value Fixes

Replace non-standard protocols:

| Current | CALM-Compliant Approach |
|---------|------------------------|
| `"protocol": "HTTPS-JWKS"` | `"protocol": "HTTPS"` + metadata: `{"purpose": "jwks-validation"}` |
| `"protocol": "LOG-SHIPPING"` | `"protocol": "HTTPS"` + metadata: `{"format": "log-shipping"}` |
| `"protocol": "OTEL"` | `"protocol": "HTTPS"` + metadata: `{"framework": "OpenTelemetry"}` |
| `"protocol": "WebSocket"` | Check if CALM supports, else use metadata |

### Phase 4: File Mappings

Create `file-mappings.json`:
```json
{
  "https://air-governance-framework.finos.org/calm/AIR-PREV-001": "controls/configurations/air-prev-001-config.json",
  "https://air-governance-framework.finos.org/calm/AIR-PREV-002": "controls/configurations/air-prev-002-config.json",
  ...
}
```

### Phase 5: Docusaurus Integration (Optional)

1. Run `calm docify` on restructured CALM file
2. Generate website documentation
3. Update with MCP-specific customizations

---

## New Controls from PR #6 (MI-18, MI-20, MI-21)

These are MCP-specific controls from FINOS AIR PR #218 that need to be added to the controls structure:

1. **MI-18**: MCP Tool Allowlisting
2. **MI-20**: MCP Prompt Injection Defense  
3. **MI-21**: MCP Output Validation

These should follow the same pattern as other controls in separate config files.

---

## Implementation Steps

1. ✅ Analyze PR #7 feedback
2. ✅ Compare with current PR #6 structure
3. ✅ Document conflicts and issues
4. ⏳ Extract all control configurations to separate files
5. ⏳ Restructure CALM file to use `controls[]` array
6. ⏳ Fix protocol values
7. ⏳ Create file-mappings.json
8. ⏳ Validate with CALM tooling
9. ⏳ Generate Docusaurus documentation
10. ⏳ Test in VS Code CALM Preview

---

## Questions for User/Maintainer

1. Should we preserve the detailed inline control configs or simplify to match PR #7 pattern?
2. What's the canonical URL scheme for control-requirement-url (PR #7 uses `https://air-governance-framework.finos.org/calm/`)?
3. Should MI-18, MI-20, MI-21 use AIR-MI-018 naming or keep MI- prefix?
4. Docusaurus generation priority for workshop prep?

---

## References

- PR #6: https://github.com/karlmoll/codegen_sandbox/pull/6
- PR #7: https://github.com/karlmoll/codegen_sandbox/pull/7  
- FINOS CALM Spec: https://github.com/finos/architecture-as-code
- FINOS AIR Framework: https://air-governance-framework.finos.org/
