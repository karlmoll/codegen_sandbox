```json
{
  "id": "AIR-DET-004",
  "description": "Implement comprehensive monitoring to detect anomalies and security breaches.",
  "domain": "observability-logging",
  "scope": "Relationship",
  "appliedTo": "mcp-to-logging",
  "content": {
    "$id": "https://air-governance-framework.finos.org/calm/AIR-DET-004",
    "control-id": "AIR-DET-004",
    "control-name": "AI System Observability",
    "category": "Detective",
    "description": "Implement comprehensive monitoring to detect anomalies and security breaches.",
    "reference-url": "https://air-governance-framework.finos.org/mitigations/mi-4_ai-system-observability.html",
    "threats-mitigated": [
      "AIR-OP-004",
      "AIR-OP-015"
    ],
    "implementation-requirements": {
      "logging": {
        "categories": [
          "auth",
          "policy",
          "tool-call",
          "admin",
          "error",
          "request"
        ],
        "format": "json",
        "pii-scrubbing": true,
        "redaction-ruleset": "pii-v1",
        "retention-days": 365
      },
      "metrics": {
        "framework": "OpenTelemetry",
        "standard-metrics": [
          "latency",
          "error_rate",
          "throughput",
          "availability"
        ],
        "slo-targets": {
          "availability": "99.9%",
          "p95-latency-ms": 300
        }
      },
      "tracing": {
        "enabled": true,
        "sampling-rate": 0.2
      }
    }
  }
}