```json
{
  "id": "AIR-PREV-002",
  "description": "Sanitize and filter data from external sources to prevent sensitive information leakage.",
  "domain": "data-governance",
  "scope": "Node",
  "appliedTo": "logging-service",
  "content": {
    "$id": "https://air-governance-framework.finos.org/calm/AIR-PREV-002",
    "control-id": "AIR-PREV-002",
    "control-name": "Data Filtering From External Knowledge Bases",
    "category": "Preventative",
    "description": "Sanitize and filter data from external sources to prevent sensitive information leakage.",
    "reference-url": "https://air-governance-framework.finos.org/mitigations/mi-2_data-filtering-from-external-knowledge-bases.html",
    "threats-mitigated": [
      "AIR-SEC-002"
    ],
    "implementation-requirements": {
      "data-governance": {
        "classification": [
          "public",
          "internal",
          "confidential",
          "restricted"
        ],
        "default-classification": "internal",
        "purpose-limitation": true,
        "data-minimization": true,
        "access-review-days": 90,
        "retention-policy": {
          "internal": 365,
          "confidential": 180,
          "restricted": 90
        }
      }
    }
  }
}