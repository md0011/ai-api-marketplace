const GRAPH_API_KEY = process.env.GRAPH_API_KEY;

const AGENT0_SUBGRAPH_ID =
  "FV6RR6y13rsnCxBAicKuQEwDp8ioEGiNaWaZUmvr1F8k";

const GRAPH_URL =
  `https://gateway.thegraph.com/api/${GRAPH_API_KEY}/subgraphs/id/${AGENT0_SUBGRAPH_ID}`;

interface AgentScoutResult {
  agentId: string;
  name: string | null;
  description: string | null;
  mcpEndpoint: string | null;
  mcpVersion: string | null;
  mcpTools: string[] | null;
  x402Support: boolean;
}

interface GraphResponse {
  data?: {
    agentRegistrationFiles?: AgentScoutResult[];
  };
  errors?: {
    message: string;
  }[];
}

const QUERY = `
  query FindMCPAgents {
    agentRegistrationFiles(
      where: {
        mcpEndpoint_not: null
        x402Support: true
        active: true
      }
      first: 10
    ) {
      agentId
      name
      description
      mcpEndpoint
      mcpVersion
      mcpTools
      x402Support
    }
  }
`;

export async function discoverAgents() {
  if (!GRAPH_API_KEY) {
    throw new Error("GRAPH_API_KEY is not configured.");
  }

  const response = await fetch(GRAPH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: QUERY,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `The Graph request failed with status ${response.status}.`,
    );
  }

  const result =
    (await response.json()) as GraphResponse;

  if (result.errors?.length) {
    throw new Error(result.errors[0].message);
  }

  return result.data?.agentRegistrationFiles ?? [];
}