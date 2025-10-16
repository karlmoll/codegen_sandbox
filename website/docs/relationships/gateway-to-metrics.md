---
id: gateway-to-metrics
title: Gateway To Metrics
---

## Details
<div className="table-container">
| Field               | Value                    |
|---------------------|--------------------------|
| **Unique ID**       | gateway-to-metrics                   |
| **Description**      |  Gateway emits metrics and starts distributed traces.   |
</div>

## Related Nodes
```mermaid
graph TD;
api-gateway -- Connects --> metrics-tracing-service;

```

## Controls
    _No controls defined._

## Metadata
  <div className="table-container">
      <table>
          <thead>
          <tr>
              <th>Key</th>
              <th>Value</th>
          </tr>
          </thead>
          <tbody>
          <tr>
              <td>
                  <b>Framework_note</b>
              </td>
              <td>
                  Implements best practices for OPS-1 (Logging and Monitoring).
                      </td>
          </tr>
          </tbody>
      </table>
  </div>
