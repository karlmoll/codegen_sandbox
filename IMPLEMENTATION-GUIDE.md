# Agentic AI Reference Architecture - Implementation Guide

## Quick Start

This guide helps you adapt the FINOS Agentic AI Reference Architecture to your specific implementation.

## Understanding the Architecture

### What is This?

This is a **reference architecture**, not a prescriptive implementation. It provides:

1. **High-level patterns** for agentic AI systems
2. **Embedded governance controls** from FINOS AIR framework
3. **Flexibility** to choose your own tech stack
4. **Modularity** through multi-document CALM structure

### What Can You Customize?

✅ **Everything marked with `"tech-stack-flexibility"`**

Examples:
- Agent framework (LangChain, AutoGen, CrewAI, custom)
- LLM provider (OpenAI, Anthropic, AWS, Azure, self-hosted)
- Vector database (Pinecone, Weaviate, Chroma, pgvector)
- Deployment model (cloud, hybrid, on-prem)
- Authentication system (OAuth, SPIFFE, custom)

## Implementation Paths

### Path 1: Start Simple (Single Agent)

**Step 1**: Implement basic components
```
1. Human Interface → API Gateway → Auth Service
2. Single Planning Agent → LLM Service
3. Basic audit logging
```

**Step 2**: Add AIR controls
```
- AIR-PREV-003: Input validation
- AIR-DET-004: Basic monitoring
- AIR-DET-005: Audit logs
```

**Step 3**: Add human-in-the-loop
```
- Human Approval Service for all actions
- AIR-PREV-014: Human approval control
```

**Autonomy Level**: Level 1 (suggest only)

---

### Path 2: Multi-Agent with Tools (Recommended)

**Step 1**: Implement core agents
```
1. Agent Orchestrator
2. Planning Agent
3. Execution Agent
4. Validation Agent
```

**Step 2**: Add MCP for tool access
```
- MCP Server (use existing component spec)
- Tool Authorization Service
- AIR-PREV-012: Tool RBAC
```

**Step 3**: Add full governance
```
- Observability Platform
- Audit Service
- Human Approval Service
- Coordination Service
```

**Autonomy Level**: Level 2 (bounded execution)

---

### Path 3: Production Multi-Agent (Full Implementation)

Implement all components with:
- Full AIR governance controls
- Multi-agent coordination
- Agent-to-agent communication
- Circuit breakers and safety controls
- Complete observability

**Autonomy Level**: Configurable (Level 0-3)

---

## Tech Stack Selection Guide

### Question 1: Where will you deploy?

**Cloud (AWS, Azure, GCP)**
- ✅ Use managed services
- ✅ Cloud-native observability
- ✅ Serverless options
- Example: AutoGen + Azure OpenAI + Azure AI Search

**On-Premise**
- ✅ Self-hosted models
- ✅ Local vector databases
- ✅ Enterprise SSO integration
- Example: Custom agents + Llama 3 + Weaviate

**Hybrid**
- ✅ Best of both worlds
- ✅ Sensitive data on-prem
- ✅ LLMs via cloud API
- Example: LangChain + Azure OpenAI (private) + On-prem Chroma

---

### Question 2: What's your agent framework?

**LangChain / LangGraph**
- ✅ Most mature ecosystem
- ✅ Strong community support
- ✅ Built-in observability (LangSmith)
- Map to: `agent-orchestrator`, all agent nodes

**Microsoft AutoGen**
- ✅ Multi-agent coordination built-in
- ✅ Group chat patterns
- ✅ Great for conversational agents
- Map to: `agent-orchestrator`, `coordination-service`

**CrewAI**
- ✅ Role-based agents
- ✅ Task delegation
- ✅ Simpler than AutoGen
- Map to: `agent-orchestrator`, agent nodes

**Custom**
- ✅ Full control
- ✅ Optimized for your use case
- ⚠️ More implementation work
- Map to: All agent nodes

---

### Question 3: Which LLM provider?

**OpenAI**
- ✅ Best performance (GPT-4)
- ✅ Function calling
- ⚠️ Data privacy concerns
- Node: `llm-service` with `"modelProvider": "openai"`

**Anthropic (Claude)**
- ✅ Long context windows
- ✅ Strong reasoning
- ✅ Constitutional AI
- Node: `llm-service` with `"modelProvider": "anthropic"`

**Azure OpenAI**
- ✅ Enterprise-ready
- ✅ Private endpoints
- ✅ Compliance certifications
- Node: `llm-service` with `"modelProvider": "azure-openai"`

**AWS Bedrock**
- ✅ Multiple models
- ✅ AWS ecosystem
- ✅ Compliance
- Node: `llm-service` with `"modelProvider": "aws-bedrock"`

**Self-Hosted (Llama, Mistral, etc.)**
- ✅ Full data control
- ✅ No API costs
- ⚠️ Infrastructure overhead
- Node: `llm-service` with `"deployment": "on-prem"`

---

### Question 4: Vector database for RAG?

**Pinecone**
- ✅ Managed service
- ✅ Fast and scalable
- ⚠️ Cost
- Node: `vector-database` with `"technology": "pinecone"`

**Weaviate**
- ✅ Open source
- ✅ Self-hostable
- ✅ Hybrid search
- Node: `vector-database` with `"technology": "weaviate"`

**Chroma**
- ✅ Simple setup
- ✅ Good for development
- ⚠️ Scaling limitations
- Node: `vector-database` with `"technology": "chroma"`

**pgvector (PostgreSQL)**
- ✅ Use existing PostgreSQL
- ✅ ACID guarantees
- ⚠️ Performance at scale
- Node: `vector-database` with `"technology": "pgvector"`

---

## AIR Control Implementation

### Critical Controls (Must Implement)

#### 1. AIR-PREV-013: Agent Autonomy Limits

**Implementation**:
```python
# In Agent Orchestrator
class AutonomyLevel(Enum):
    LEVEL_0 = "no_autonomy"
    LEVEL_1 = "suggest_only"
    LEVEL_2 = "bounded_execution"
    LEVEL_3 = "full_autonomy"

def check_autonomy(agent: Agent, action: Action):
    if action.risk_level == "high":
        if agent.autonomy_level < AutonomyLevel.LEVEL_2:
            return "require_human_approval"
    # ... additional logic
```

**CALM Mapping**: `agent-orchestrator` node, `agent-autonomy-controls` control

---

#### 2. AIR-PREV-014: Human-in-the-Loop Checkpoints

**Implementation**:
```python
# In Human Approval Service
async def request_approval(action: Action, timeout: int = 300):
    approval_request = create_approval_request(action)
    # Send to approval UI
    # Wait for human response or timeout
    response = await wait_for_approval(approval_request, timeout)
    log_approval_decision(response)
    return response
```

**CALM Mapping**: `human-approval-service` node, `orchestrator-to-human-approval` relationship

---

#### 3. AIR-DET-005: AI System Audit Trail

**Implementation**:
```python
# In all agent nodes
def log_agent_action(agent_id, action, input, output, reasoning):
    audit_log = {
        "timestamp": datetime.utcnow(),
        "agent_id": agent_id,
        "action": action,
        "input": redact_pii(input),
        "output": redact_pii(output),
        "reasoning": reasoning,
        "approved_by": get_approver() if requires_approval else None
    }
    audit_service.log(audit_log)  # Immutable storage
```

**CALM Mapping**: `audit-service` node, `agents-to-audit` relationship

---

### High Priority Controls

#### 4. AIR-PREV-003: Prompt Injection Protection

**Implementation**:
```python
# In AI Gateway
def check_prompt_injection(user_input: str) -> bool:
    # Multiple techniques
    if contains_instruction_override(user_input):
        return False
    if contains_delimiter_bypass(user_input):
        return False
    if ai_firewall_detects_attack(user_input):
        return False
    return True
```

**CALM Mapping**: `ai-gateway` node, `prompt-injection-protection` control

---

#### 5. AIR-PREV-012: Role-Based Access Control

**Implementation**:
```python
# In Tool Authorization Service
def authorize_tool_access(agent_id: str, tool: str, action: str):
    agent_role = get_agent_role(agent_id)
    policy_result = policy_engine.evaluate({
        "agent": agent_id,
        "role": agent_role,
        "tool": tool,
        "action": action
    })
    log_authorization_decision(policy_result)
    return policy_result.allowed
```

**CALM Mapping**: `tool-authorization-service` node, `mcp-to-tool-authz` relationship

---

## MCP Integration

### Using the Existing MCP Component

The architecture references the existing MCP server specification:

**File**: `components/mcp-server.calm.json`

**Integration Points**:

1. **Execution Agent → MCP Server**
   - Relationship: `execution-agent-to-mcp`
   - Protocol: HTTPS with mTLS + JWT
   - Authentication: SPIFFE-based identity

2. **MCP Server → Tool Authorization**
   - Relationship: `mcp-to-tool-authz`
   - Check permissions before tool execution

3. **MCP Server → Audit Service**
   - Log all tool invocations
   - Include agent identity, tool used, result

### Example MCP Tool Call Flow

```
1. Execution Agent decides to call tool
2. Agent → MCP Server (authenticated via SPIFFE)
3. MCP → Tool Authorization Service (policy check)
4. MCP → External Tool (if authorized)
5. MCP → Audit Service (log invocation)
6. MCP → Execution Agent (return result)
7. Agent → Validation Agent (validate result)
```

---

## Agent-to-Agent Communication

### Pattern 1: Via Orchestrator (Recommended)

```
Planning Agent → Orchestrator → Execution Agent
```

**Pros**: Central control, easier to monitor
**Cons**: Added latency

**Implementation**: Use `orchestrator-to-planning-agent` and `orchestrator-to-execution-agent` relationships

---

### Pattern 2: Direct Communication

```
Planning Agent → (direct) → Execution Agent
```

**Pros**: Lower latency
**Cons**: More complex coordination

**Implementation**: Use `agent-to-agent-planning-to-execution` relationship with SPIFFE authentication

**Future**: See `components/agent-communication.calm.json` (to be created)

---

## Observability Implementation

### Metrics to Track

```python
# Agent metrics
agent_invocations_total = Counter('agent_invocations_total', ['agent_id'])
agent_errors_total = Counter('agent_errors_total', ['agent_id', 'error_type'])
agent_latency_seconds = Histogram('agent_latency_seconds', ['agent_id'])

# Tool metrics
tool_calls_total = Counter('tool_calls_total', ['tool_name', 'agent_id'])
tool_costs_usd = Gauge('tool_costs_usd', ['tool_name'])

# Coordination metrics
agent_coordination_conflicts = Counter('agent_coordination_conflicts')
```

### Traces to Capture

```python
# Using OpenTelemetry
with tracer.start_as_current_span("agent_execution") as span:
    span.set_attribute("agent.id", agent_id)
    span.set_attribute("agent.type", "execution")
    
    # Child spans
    with tracer.start_as_current_span("llm_call"):
        result = llm.generate(prompt)
    
    with tracer.start_as_current_span("tool_call"):
        tool_result = mcp_client.call_tool(tool_name, params)
```

---

## Autonomy Level Configuration

### Level 0: No Autonomy
```json
{
  "agent": "execution-agent",
  "autonomy_level": 0,
  "require_human_approval": "always",
  "allowed_actions": []
}
```

**Use Case**: High-risk financial transactions

---

### Level 1: Suggest Only
```json
{
  "agent": "planning-agent",
  "autonomy_level": 1,
  "require_human_approval": "always",
  "allowed_actions": ["analyze", "suggest", "recommend"]
}
```

**Use Case**: Investment advisory, legal analysis

---

### Level 2: Bounded Execution
```json
{
  "agent": "execution-agent",
  "autonomy_level": 2,
  "require_human_approval": "high_risk_only",
  "allowed_actions": ["read", "analyze", "generate_report"],
  "forbidden_actions": ["delete", "modify", "external_api_write"],
  "cost_limit_usd": 10.0
}
```

**Use Case**: Customer service, data analysis

---

### Level 3: Full Autonomy
```json
{
  "agent": "monitoring-agent",
  "autonomy_level": 3,
  "require_human_approval": "never",
  "allowed_actions": ["monitor", "alert", "auto_remediate"],
  "notification_channels": ["slack", "pagerduty"]
}
```

**Use Case**: System monitoring, DevOps automation (non-prod)

---

## Testing Your Implementation

### Unit Tests

Test each agent independently:

```python
def test_planning_agent_with_autonomy_limits():
    agent = PlanningAgent(autonomy_level=1)
    action = agent.plan("high_risk_task")
    assert action.requires_approval == True

def test_prompt_injection_detection():
    gateway = AIGateway()
    malicious_input = "Ignore previous instructions..."
    assert gateway.check_prompt_injection(malicious_input) == False
```

### Integration Tests

Test agent workflows:

```python
def test_multi_agent_workflow_with_approval():
    # Start workflow
    result = orchestrator.execute_workflow(
        planning_agent, execution_agent, validation_agent,
        human_approval_service
    )
    
    # Verify human approval was requested
    assert human_approval_service.approval_requested == True
    
    # Verify audit log
    assert audit_service.contains_log(agent_id, action)
```

### AIR Control Tests

Test governance controls:

```python
def test_agent_autonomy_limits():
    agent = ExecutionAgent(autonomy_level=2)
    high_risk_action = Action(risk_level="high")
    
    result = agent.execute(high_risk_action)
    
    assert result.status == "pending_approval"

def test_tool_authorization():
    result = tool_authz.authorize(
        agent_id="execution-agent-1",
        tool="database_delete"
    )
    
    assert result.allowed == False  # Should be denied
```

---

## Compliance Checklists

### EU AI Act (High-Risk Systems)

- [ ] Risk assessment completed (AIR-PREV-001)
- [ ] Data governance in place (AIR-PREV-002)
- [ ] Human oversight implemented (AIR-PREV-014)
- [ ] Transparency and explainability
- [ ] Audit trails with 7-year retention (AIR-DET-005)
- [ ] Accuracy and robustness testing
- [ ] Cybersecurity controls
- [ ] Documentation and record-keeping

### Financial Services

- [ ] Model validation process (AIR-PREV-001)
- [ ] Immutable audit trails (AIR-DET-005)
- [ ] Human approval for critical decisions (AIR-PREV-014)
- [ ] Explainable AI outputs
- [ ] Continuous monitoring (AIR-DET-004)
- [ ] Incident response procedures (AIR-CORR-001)

---

## Common Pitfalls

### ❌ Pitfall 1: Over-Autonomy

**Problem**: Giving agents Level 3 autonomy without proper testing

**Solution**:
- Start with Level 1 (suggest only)
- Gradually increase autonomy as confidence grows
- Always implement circuit breakers

### ❌ Pitfall 2: Insufficient Monitoring

**Problem**: Not tracking agent behavior in production

**Solution**:
- Implement AIR-DET-004 (Observability)
- Use AIR-DET-007 (Anomaly Detection)
- Set up alerts for unusual behavior

### ❌ Pitfall 3: Weak Tool Authorization

**Problem**: Allowing agents access to all tools

**Solution**:
- Implement AIR-PREV-012 (RBAC)
- Use principle of least privilege
- Audit tool access regularly

### ❌ Pitfall 4: Missing Human Oversight

**Problem**: No human-in-the-loop for high-risk actions

**Solution**:
- Implement AIR-PREV-014
- Define clear risk thresholds
- Set reasonable approval timeouts

---

## Next Steps

1. **Choose your tech stack** using the selection guide above
2. **Select an implementation path** (Simple, Multi-Agent, or Production)
3. **Start with Level 1 autonomy** and scale up
4. **Implement critical AIR controls** first
5. **Test thoroughly** before production
6. **Monitor continuously** in production

## Getting Help

- Review the full architecture: `agentic-ai-reference-architecture.calm.json`
- Read the documentation: `AGENTIC-AI-REFERENCE-ARCHITECTURE.md`
- Check MCP component: `components/mcp-server.calm.json`
- FINOS AIR Framework: https://air-governance-framework.finos.org/

## Contributing

Share your implementation experience:
- Document your tech stack choices
- Share lessons learned
- Contribute implementation patterns
- Help build sub-component specifications
