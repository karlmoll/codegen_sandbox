module.exports = {
    docs: [
        {
            type: 'doc',
            id: 'index',
            label: 'Home',
        },
        {
            type: 'category',
            label: 'Nodes',
            items: [
                'nodes/external-client',
                'nodes/api-gateway',
                'nodes/oidc-provider',
                'nodes/entitlements-pdp',
                'nodes/secrets-vault',
                'nodes/mcp-service',
                'nodes/logging-service',
                'nodes/metrics-tracing-service'
            ],
        },
        {
            type: 'category',
            label: 'Relationships',
            items: [
                'relationships/client-to-gateway',
                'relationships/gateway-validates-jwt',
                'relationships/gateway-to-pdp',
                'relationships/gateway-to-mcp',
                'relationships/mcp-to-vault',
                'relationships/gateway-to-logging',
                'relationships/mcp-to-logging',
                'relationships/gateway-to-metrics',
                'relationships/mcp-to-metrics',
                'relationships/mcp-to-pdp',
                'relationships/mcp-validates-jwks'
            ],
        },
        {
            type: 'category',
            label: 'Flows',
            items: [
                'flows/end-to-end-secure-and-observable'
            ],
        }
    ]
};
