const GRAPH_API_KEY = process.env.GRAPH_API_KEY;

const AGENT0_SUBGRAPH_ID =
  "FV6RR6y13rsnCxBAicKuQEwDp8ioEGiNaWaZUmvr1F8k";

const GRAPH_URL =
  `https://gateway.thegraph.com/api/${GRAPH_API_KEY}/subgraphs/id/${AGENT0_SUBGRAPH_ID}`;

export interface AgentScoutResult {
  agentId: string;
  name: string | null;
  description: string | null;
  mcpEndpoint: string | null;
  mcpVersion: string | null;
  mcpTools: string[] | null;
  x402Support: boolean;
  totalFeedback: number;
  validationCount: number;
  completedValidationCount: number;
  averageValidationScore: number;
}

interface RegistrationAgent {
  agentId: string;
  name: string | null;
  description: string | null;
  mcpEndpoint: string | null;
  mcpVersion: string | null;
  mcpTools: string[] | null;
  x402Support: boolean;
}

interface Feedback {
  score: number;
  isRevoked: boolean;
}

interface Validation {
  response: number | null;
  status: string;
}

interface GraphRegistrationResponse {
  data?: {
    agentRegistrationFiles?: RegistrationAgent[];
  };
  errors?: {
    message: string;
  }[];
}

interface GraphAgentResponse {
  data?: {
    agents?: Array<{
      id: string;
      totalFeedback: string;
      validations: Validation[];
    }>;
  };
  errors?: {
    message: string;
  }[];
}

const REGISTRATION_QUERY = `
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

const AGENT_QUERY = `
  query GetAgentTrustData($agentIds: [ID!]!) {
    agents(
      where: {
        id_in: $agentIds
      }
    ) {
      id
      totalFeedback

      validations(
        first: 50
      ) {
        response
        status
      }
    }
  }
`;

function calculateAverage(
  values: number[],
): number {
  if (values.length === 0) {
    return 0;
  }

  const total = values.reduce(
    (sum, value) => sum + value,
    0,
  );

  return Math.round(
    (total / values.length) * 10,
  ) / 10;
}

async function graphRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(GRAPH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `The Graph request failed with status ${response.status}.`,
    );
  }

  const result = (await response.json()) as {
    data?: T extends { data?: infer D } ? D : unknown;
    errors?: {
      message: string;
    }[];
  };

  if (result.errors?.length) {
    throw new Error(result.errors[0].message);
  }

  return result as T;
}

export async function discoverAgents(): Promise<
  AgentScoutResult[]
> {
  if (!GRAPH_API_KEY) {
    throw new Error(
      "GRAPH_API_KEY is not configured.",
    );
  }

  const registrationResult =
    await graphRequest<GraphRegistrationResponse>(
      REGISTRATION_QUERY,
    );

  const registrationAgents =
    registrationResult.data?.agentRegistrationFiles ?? [];

  if (registrationAgents.length === 0) {
    return [];
  }

  const agentIds = registrationAgents.map(
    (agent) => agent.agentId,
  );

  const trustResult =
    await graphRequest<GraphAgentResponse>(
      AGENT_QUERY,
      {
        agentIds,
      },
    );

  const trustAgents =
    trustResult.data?.agents ?? [];

  const trustMap = new Map(
    trustAgents.map((agent) => [
      agent.id,
      agent,
    ]),
  );

  return registrationAgents.map((agent) => {
    const trustData = trustMap.get(
      agent.agentId,
    );

    const validations =
      trustData?.validations ?? [];

    const validationScores = validations
      .filter(
        (validation) =>
          validation.response !== null &&
          validation.response > 0,
      )
      .map(
        (validation) =>
          validation.response as number,
      );

    return {
      agentId: agent.agentId,
      name: agent.name,
      description: agent.description,
      mcpEndpoint: agent.mcpEndpoint,
      mcpVersion: agent.mcpVersion,
      mcpTools: agent.mcpTools,
      x402Support: agent.x402Support,

      totalFeedback: Number(
        trustData?.totalFeedback ?? 0,
      ),

      validationCount:
        validations.length,

      completedValidationCount:
        validations.filter(
          (validation) =>
            validation.status === "COMPLETED",
        ).length,

      averageValidationScore:
        calculateAverage(validationScores),
    };
  });
}