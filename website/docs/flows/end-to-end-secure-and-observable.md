---
id: end-to-end-secure-and-observable
title: End-to-end secure, authorized, and observable request
---

## Details
<div className="table-container">
| Field               | Value                    |
|---------------------|--------------------------|
| **Unique ID**       | end-to-end-secure-and-observable                   |
| **Name**            | End-to-end secure, authorized, and observable request                 |
| **Description**     | OAuth, edge protections, token validation, policy decisions, logging, metrics, and tracing with comprehensive AIR governance controls.          |
</div>

## Sequence Diagram
```mermaid
sequenceDiagram
            External Client ->> API Gateway: Client calls API Gateway over HTTPS with bearer token.
            API Gateway ->> OIDC Provider: Gateway validates JWT via JWKS metadata.
            API Gateway ->> Entitlements Service (PDP): Gateway requests authorization decision for the target action.
            API Gateway ->> MCP Service: Gateway forwards authorized request to MCP service.
            MCP Service ->> OIDC Provider: MCP validates token and claims for defense-in-depth.
            MCP Service ->> Entitlements Service (PDP): MCP performs fine-grained policy check for resource and action.
            MCP Service ->> Centralized Logging Service: MCP emits structured logs for trace and audit.
            MCP Service ->> Metrics and Tracing Service: MCP emits metrics and continues distributed trace.
```
## Controls
    _No controls defined._

## Metadata
  _No Metadata defined._
