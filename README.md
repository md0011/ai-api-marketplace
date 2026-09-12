# AgentMarket

### Autonomous AI Service Marketplace with Hedera x402 Payments and The Graph Agent Discovery

AgentMarket is an autonomous AI service marketplace where agents can discover capabilities, choose the right service for a goal, pay per request, and receive the result — without traditional API keys or subscription-based access.

The project combines:

* **Hedera Testnet** for payment settlement
* **x402** for machine-to-machine pay-per-request access
* **Blocky402** as the x402 facilitator
* **The Graph + Agent0** for live ERC-8004 agent discovery and evaluation
* **MCP and x402 capability discovery**
* An autonomous **Agent Playground** that turns a natural-language goal into an executable service request

---

## Live Demo

**Live application:**
https://4gentmarket.vercel.app/

**Agent Playground:**
https://4gentmarket.vercel.app/agent

**GitHub:**
https://github.com/md0011/ai-api-marketplace

---

## The Problem

AI agents are increasingly capable of performing tasks, but accessing external capabilities still commonly requires:

* API keys
* Account registration
* Subscription plans
* Manual service selection
* Human-approved payments
* Custom integrations for every provider

This creates friction for autonomous agents.

An agent should be able to say:

> "I need an image generated."

Then discover an appropriate capability, determine the cost, authorize payment, call the service, and receive the result.

That is the experience AgentMarket is designed to demonstrate.

---

## How AgentMarket Works

```text
                    User / Agent
                         │
                         ▼
                  Natural-language goal
                         │
                         ▼
                  AgentMarket Agent
                         │
                         ▼
                 Discover capabilities
                         │
              ┌──────────┴──────────┐
              │                     │
              ▼                     ▼
        Marketplace            The Graph
         Services             Agent0 / ERC-8004
              │                     │
              └──────────┬──────────┘
                         ▼
                   Rank / Decide
                         │
                         ▼
                 Selected Service
                         │
                         ▼
                   x402 Payment
                         │
                         ▼
                Hedera Testnet
                         │
                         ▼
                    Execution
                         │
                         ▼
                       Result
```

The core flow is:

**Goal → Discover → Decide → Pay → Execute → Result**

---

# Key Features

## Autonomous Service Selection

The Agent Playground accepts a natural-language goal rather than requiring the user to manually select an API.

For example:

```text
Generate a futuristic cyberpunk city at night with neon lights
```

AgentMarket analyzes the goal and selects the service whose capabilities best match the request.

---

## Hedera x402 Pay-Per-Request

AgentMarket demonstrates a real machine-to-machine payment flow using:

* Hedera Testnet
* HBAR
* x402
* Blocky402 facilitator

The current PixelForge service costs:

```text
0.002 HBAR per request
```

The agent can automatically make the payment when the service requires it.

No traditional API key or subscription is required for the demonstrated paid service flow.

Blocky402 supports the x402 v2 payment flow on Hedera Testnet and acts as the facilitator for verification and settlement.

---

## Real Onchain Settlement

The payment is not simulated.

The application has completed real end-to-end requests where:

```text
Agent/Payer
0.0.9822603

        │
        │ 0.002 HBAR
        ▼

PixelForge Provider
0.0.9897003

        │
        ▼

Hedera Testnet
```

The Agent Playground displays the settlement information after a successful request, including:

* Payment amount
* Payer
* Provider
* Hedera transaction identifier
* Execution result

---

# The Graph + Agent0

AgentMarket also integrates The Graph's Agent0 subgraph to discover and evaluate AI agents using live indexed data.

The AgentScout capability can search for agents based on natural-language goals such as:

```text
Find an AI agent for generating ZK proofs that supports x402
```

or:

```text
Find an AI agent for blockchain market analysis that supports x402
```

AgentMarket queries live Agent0 data and uses the returned information to rank relevant agents.

The discovery flow uses information including:

* ERC-8004 agent identity
* Agent descriptions
* MCP endpoints
* MCP versions
* MCP tools
* x402 support
* Feedback counts
* Validation information

The Graph's Agent0 Subgraphs index ERC-8004 identity, reputation, validation and capability information, making this data available through GraphQL queries.

### Important distinction

The current AgentScout implementation uses **The Graph as the live discovery/data layer**.

The demonstrated **HBAR x402 payment flow is implemented for the paid PixelForge service**.

---

# Architecture

```text
src/
├── app/
│   ├── page.tsx
│   ├── agent/
│   │   └── page.tsx
│   ├── how-it-works/
│   │   └── page.tsx
│   ├── developers/
│   │   └── page.tsx
│   ├── services/
│   │   └── [id]/
│   │       └── page.tsx
│   └── api/
│       ├── agent/
│       │   └── run/
│       │       └── route.ts
│       └── services/
│           └── pixelforge/
│               └── route.ts
│
├── components/
│   ├── Header/
│   ├── Hero/
│   ├── ServiceCard/
│   ├── ServiceGrid/
│   └── AgentPlayground/
│
├── data/
│   └── services.ts
│
├── lib/
│   ├── agent/
│   │   ├── selectService.ts
│   │   └── rankAgents.ts
│   │
│   ├── graph/
│   │   └── agentScout.ts
│   │
│   ├── payments/
│   │   ├── paymentService.ts
│   │   ├── hederaX402.ts
│   │   ├── hederaX402Client.ts
│   │   └── x402Server.ts
│   │
│   └── services/
│       └── executeService.ts
│
└── types/
    └── service.ts
```

---

# Payment Architecture

AgentMarket uses the x402 protocol to place a payment boundary around a service.

```text
AgentMarket
     │
     │ HTTP request
     ▼
PixelForge Resource
     │
     │ 402 Payment Required
     ▼
x402 Client
     │
     │ Sign HBAR payment
     ▼
Blocky402 Facilitator
     │
     │ Verify + settle
     ▼
Hedera Testnet
     │
     │ Settlement
     ▼
Provider Account
     │
     ▼
Service execution
     │
     ▼
Result returned to agent
```

The client uses the x402 Hedera SDK to sign the payment.

The facilitator handles verification and settlement.

After settlement, the service response contains payment settlement information which AgentMarket decodes and displays in the Agent Playground.

---

# x402 Payment Flow

The application uses the x402 v2 flow.

### 1. Agent requests the protected service

```text
Agent → PixelForge
```

### 2. Service returns a payment requirement

```text
HTTP 402 Payment Required
```

The requirement identifies:

```text
Network: hedera:testnet
Asset: HBAR
Amount: 200000 tinybars
```

`200000 tinybars = 0.002 HBAR`

### 3. Agent signs the payment

The Hedera client uses the configured payer account and ECDSA private key.

### 4. x402 retries the request

The signed payment is included in the x402 payment header.

### 5. Blocky402 verifies and settles

Blocky402 acts as the facilitator for the Hedera x402 flow.

### 6. Hedera records the settlement

A real Hedera Testnet transaction is produced.

### 7. Service executes

After successful payment, PixelForge executes the requested operation.

### 8. Agent receives the result

AgentMarket displays:

```text
Payment settled
+
Transaction
+
Provider
+
Service result
```

---

# Agent Discovery Architecture

AgentScout uses The Graph's Agent0 subgraph.

```text
Natural-language goal
        │
        ▼
AgentScout
        │
        ▼
The Graph Gateway
        │
        ▼
Agent0 Subgraph
        │
        ├── Agent registrations
        ├── MCP capabilities
        ├── x402 support
        ├── Feedback
        └── Validation data
        │
        ▼
AgentMarket ranking
        │
        ▼
Relevant agents
```

The ranking system considers:

* Goal keywords
* Related concepts
* Agent name
* Agent description
* MCP support
* x402 support
* Feedback
* Validation information
* Intent-specific matches

This allows AgentMarket to move beyond simple keyword filtering.

---

# Example: Paid Service Execution

### User goal

```text
Generate a futuristic cyberpunk city at night with neon lights
```

### Agent decision

```text
Discovered services: 7

Selected:
PixelForge

Reason:
The service matches the goal through image generation capabilities.
```

### Payment

```text
Amount:
0.002 HBAR

Network:
Hedera Testnet

Asset:
HBAR

Payer:
0.0.9822603

Provider:
0.0.9897003
```

### Result

```text
PixelForge service executed successfully.

Execution status:
completed
```

The payment settlement transaction is displayed directly in the Agent Playground.

---

# Example: Agent Discovery

### User goal

```text
Find an AI agent for generating ZK proofs that supports x402
```

AgentMarket:

1. Queries Agent0 data through The Graph
2. Finds active agents with relevant capabilities
3. Evaluates their descriptions and metadata
4. Checks MCP and x402 support
5. Ranks the results
6. Presents the most relevant agents

Example results can include agents such as:

```text
proveragent.eth
Claudy AI
ClawdMint
```

The exact results can change as the live Agent0 data changes.

---

# Technology Stack

### Frontend

* Next.js
* React
* TypeScript
* SCSS Modules
* Lucide Icons

### Blockchain / Payments

* Hedera Testnet
* HBAR
* x402
* `@x402/core`
* `@x402/fetch`
* `@x402/hedera`
* `@x402/next`
* Blocky402

### Agent Discovery

* The Graph
* Agent0
* ERC-8004
* MCP
* GraphQL

### Deployment

* Vercel

---

# Local Development

## Requirements

* Node.js 22+
* npm
* A Hedera Testnet account
* A Hedera ECDSA private key
* The Graph API key

---

## 1. Clone the repository

```bash
git clone https://github.com/md0011/ai-api-marketplace.git

cd ai-api-marketplace
```

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Configure environment variables

Create:

```text
.env.local
```

Add:

```env
HEDERA_ACCOUNT_ID=your_hedera_account_id
HEDERA_PRIVATE_KEY=your_hedera_private_key
HEDERA_PROVIDER_ACCOUNT_ID=your_provider_account_id
BLOCKY402_FACILITATOR_URL=https://api.testnet.blocky402.com
GRAPH_API_KEY=your_graph_api_key
```

### Environment variable descriptions

| Variable                     | Purpose                                       |
| ---------------------------- | --------------------------------------------- |
| `HEDERA_ACCOUNT_ID`          | Hedera account used by the agent as the payer |
| `HEDERA_PRIVATE_KEY`         | ECDSA private key used to sign HBAR payments  |
| `HEDERA_PROVIDER_ACCOUNT_ID` | Hedera account receiving service payments     |
| `BLOCKY402_FACILITATOR_URL`  | Blocky402 Hedera Testnet facilitator          |
| `GRAPH_API_KEY`              | API key for The Graph Gateway                 |

**Never commit `.env.local` or private keys to GitHub.**

---

## 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Agent Playground:

```text
http://localhost:3000/agent
```

---

## 5. Build for production

```bash
npm run build
```

---

# Deployment

The production application is deployed on Vercel.

Production:

```text
https://4gentmarket.vercel.app/
```

The required environment variables are configured in the Vercel project environment.

Every push to the connected `main` branch can trigger a new deployment.

---

# Security

Private keys are used only server-side for the Hedera payment client.

Do not expose:

```text
HEDERA_PRIVATE_KEY
GRAPH_API_KEY
```

in client-side code or public repositories.

The `.env.local` file should remain local and should be included in `.gitignore`.

---

# Why Hedera?

Hedera provides the settlement layer for AgentMarket's autonomous payment flow.

The project uses Hedera Testnet to demonstrate:

* HBAR micropayments
* Agent-controlled payment
* Real transaction settlement
* Machine-to-machine commerce
* x402-based service access

The demonstrated payment is intentionally small:

```text
0.002 HBAR
```

This makes the architecture suitable for pay-per-request services.

---

# Why The Graph?

An autonomous marketplace needs more than a static service list.

Agents need to discover:

* Who provides a capability?
* What can the agent do?
* Does it support MCP?
* Does it support x402?
* What reputation or validation information exists?

The Graph's Agent0 subgraphs provide indexed ERC-8004 agent identity, capability, reputation and validation data through GraphQL.

AgentMarket uses this data to power AgentScout.

---

# Hackathon Track Alignment

## Hedera — AI & Agentic Payments

AgentMarket demonstrates the core Hedera requirements:

* Live x402-gated service on Hedera Testnet
* Blocky402 facilitator
* Agent/platform consuming the service
* Real paid request executed end-to-end
* HBAR settlement
* Public source code
* Demonstrable payment flow

The project also incorporates agent discovery and ERC-8004-related data through The Graph's Agent0 ecosystem.

---

## The Graph — AI / Agent Use Case

The Graph is load-bearing in the AgentScout workflow.

AgentMarket uses live Graph data to:

1. Discover registered agents
2. Identify capabilities
3. Detect MCP support
4. Detect x402 support
5. Retrieve feedback/validation information
6. Rank agents against a natural-language goal

The Graph is therefore part of the application logic rather than only a decorative data source.

---

# Demo Flow

The recommended demonstration is:

```text
1. Open Agent Playground

2. Enter:
   "Generate a futuristic cyberpunk city at night with neon lights"

3. Agent discovers available services

4. Agent selects PixelForge

5. PixelForge requests payment

6. Agent automatically signs the HBAR payment

7. Blocky402 facilitates settlement

8. Hedera Testnet records the transaction

9. PixelForge executes

10. AgentMarket displays the result and payment proof

11. Run AgentScout

12. Enter:
    "Find an AI agent for generating ZK proofs that supports x402"

13. AgentMarket queries The Graph / Agent0

14. Relevant agents are ranked and displayed
```

---

# Project Status

### Working

* Autonomous service discovery
* Natural-language agent goals
* Service ranking
* PixelForge service execution
* Hedera x402 payment flow
* Blocky402 settlement
* Real Hedera Testnet transactions
* Payment settlement decoding
* AgentScout
* The Graph Agent0 integration
* ERC-8004 agent discovery
* MCP capability discovery
* x402 capability discovery
* Vercel deployment
* Responsive UI

---

# Future Directions

Potential future extensions include:

* More real paid services
* Multi-agent negotiation
* A2A / ACP integration
* Service-provider registration
* Automated service onboarding
* ERC-8004 identity creation
* HCS-based payment audit trails
* HTS payment options
* Recurring or streamed agent payments
* More advanced reputation-based service ranking

---

# Built for ETHOnline 2026

AgentMarket was built for **ETHOnline 2026** with the goal of demonstrating autonomous machine-to-machine commerce.

The central idea:

> **Agents should be able to discover capabilities, choose services, pay for them, and receive results without requiring a human to manage every API key, subscription, or payment.**

---

## Links

* **Live Demo:** https://4gentmarket.vercel.app/
* **Agent Playground:** https://4gentmarket.vercel.app/agent
* **GitHub:** https://github.com/md0011/ai-api-marketplace
* **Hedera:** https://hedera.com/
* **Blocky402:** https://blocky402.com/
* **The Graph:** https://thegraph.com/
* **Agent0:** https://thegraph.com/docs/en/subgraphs/existing-subgraphs/agent0/
* **x402:** https://www.x402.org/

---

## License

This project is provided for hackathon and demonstration purposes.
