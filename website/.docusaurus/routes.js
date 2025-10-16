import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/search',
    component: ComponentCreator('/search', '044'),
    exact: true
  },
  {
    path: '/',
    component: ComponentCreator('/', 'df3'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', 'fcf'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', 'b17'),
            routes: [
              {
                path: '/control-requirements/control-requirement',
                component: ComponentCreator('/control-requirements/control-requirement', '878'),
                exact: true
              },
              {
                path: '/controls/AIR-CORR-001',
                component: ComponentCreator('/controls/AIR-CORR-001', '433'),
                exact: true
              },
              {
                path: '/controls/AIR-DET-004',
                component: ComponentCreator('/controls/AIR-DET-004', '6df'),
                exact: true
              },
              {
                path: '/controls/AIR-DET-005',
                component: ComponentCreator('/controls/AIR-DET-005', '0f8'),
                exact: true
              },
              {
                path: '/controls/AIR-PREV-001',
                component: ComponentCreator('/controls/AIR-PREV-001', 'cf8'),
                exact: true
              },
              {
                path: '/controls/AIR-PREV-002',
                component: ComponentCreator('/controls/AIR-PREV-002', '7ac'),
                exact: true
              },
              {
                path: '/controls/AIR-PREV-003',
                component: ComponentCreator('/controls/AIR-PREV-003', '75f'),
                exact: true
              },
              {
                path: '/controls/AIR-PREV-012',
                component: ComponentCreator('/controls/AIR-PREV-012', 'ef3'),
                exact: true
              },
              {
                path: '/controls/undefined',
                component: ComponentCreator('/controls/undefined', '3c7'),
                exact: true
              },
              {
                path: '/flows/end-to-end-secure-and-observable',
                component: ComponentCreator('/flows/end-to-end-secure-and-observable', 'f5e'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/nodes/api-gateway',
                component: ComponentCreator('/nodes/api-gateway', '7ec'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/nodes/entitlements-pdp',
                component: ComponentCreator('/nodes/entitlements-pdp', 'd10'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/nodes/external-client',
                component: ComponentCreator('/nodes/external-client', 'f48'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/nodes/logging-service',
                component: ComponentCreator('/nodes/logging-service', '272'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/nodes/mcp-service',
                component: ComponentCreator('/nodes/mcp-service', 'ae0'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/nodes/metrics-tracing-service',
                component: ComponentCreator('/nodes/metrics-tracing-service', 'af8'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/nodes/oidc-provider',
                component: ComponentCreator('/nodes/oidc-provider', 'ed7'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/nodes/secrets-vault',
                component: ComponentCreator('/nodes/secrets-vault', 'a5e'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/relationships/client-to-gateway',
                component: ComponentCreator('/relationships/client-to-gateway', '5ff'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/relationships/gateway-to-logging',
                component: ComponentCreator('/relationships/gateway-to-logging', 'd39'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/relationships/gateway-to-mcp',
                component: ComponentCreator('/relationships/gateway-to-mcp', '5fc'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/relationships/gateway-to-metrics',
                component: ComponentCreator('/relationships/gateway-to-metrics', '824'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/relationships/gateway-to-pdp',
                component: ComponentCreator('/relationships/gateway-to-pdp', '3cc'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/relationships/gateway-validates-jwt',
                component: ComponentCreator('/relationships/gateway-validates-jwt', 'fce'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/relationships/mcp-to-logging',
                component: ComponentCreator('/relationships/mcp-to-logging', 'aad'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/relationships/mcp-to-metrics',
                component: ComponentCreator('/relationships/mcp-to-metrics', '76d'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/relationships/mcp-to-pdp',
                component: ComponentCreator('/relationships/mcp-to-pdp', 'ed9'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/relationships/mcp-to-vault',
                component: ComponentCreator('/relationships/mcp-to-vault', '67e'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/relationships/mcp-validates-jwks',
                component: ComponentCreator('/relationships/mcp-validates-jwks', '7be'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/',
                component: ComponentCreator('/', 'bea'),
                exact: true,
                sidebar: "docs"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
