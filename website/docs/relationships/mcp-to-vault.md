---
id: mcp-to-vault
title: Mcp To Vault
---

## Details
<div className="table-container">
| Field               | Value                    |
|---------------------|--------------------------|
| **Unique ID**       | mcp-to-vault                   |
| **Description**      |  MCP service retrieves secrets at startup and on demand.   |
</div>

## Related Nodes
```mermaid
graph TD;
mcp-service -- Connects --> secrets-vault;

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
                  <b>Authentication</b>
              </td>
              <td>
                  SPIFFE/mTLS
                      </td>
          </tr>
          <tr>
              <td>
                  <b>Air</b>
              </td>
              <td>
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
                                  <b>Threats</b>
                              </td>
                              <td>
                                  <ul>
                                      <li>AIR-SEC-001</li>
                                      <li>AIR-SEC-002</li>
                                  </ul>
                              </td>
                          </tr>
                          <tr>
                              <td>
                                  <b>Controls</b>
                              </td>
                              <td>
                                  <ul>
                                      <li>AIR-PREV-001</li>
                                      <li>AIR-PREV-002</li>
                                  </ul>
                              </td>
                          </tr>
                          </tbody>
                      </table>
                  </div>
              </td>
          </tr>
          </tbody>
      </table>
  </div>
