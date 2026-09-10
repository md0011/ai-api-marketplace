interface RankedAgent {
    agentId: string;
    name: string | null;
    description: string | null;
    mcpEndpoint: string | null;
    mcpVersion: string | null;
    x402Support: boolean;
}

const STOP_WORDS = new Set([
    "a",
    "an",
    "and",
    "for",
    "find",
    "get",
    "i",
    "in",
    "me",
    "my",
    "of",
    "on",
    "that",
    "the",
    "to",
    "with",
    "supports",
    "support",
]);

const RELATED_WORDS: Record<string, string[]> = {
    generate: ["generating", "generation"],
    generating: ["generate", "generation"],
    generation: ["generate", "generating"],

    proof: ["proofs", "zk", "zero", "knowledge"],
    proofs: ["proof", "zk", "zero", "knowledge"],
    zk: ["proof", "proofs", "zero", "knowledge"],

    blockchain: ["onchain", "on-chain", "crypto"],
    market: ["markets", "trading", "price", "prices"],
    markets: ["market", "trading", "price", "prices"],

    analysis: ["analyze", "analyzing", "analytics"],
    analyze: ["analysis", "analyzing", "analytics"],
    analytics: ["analysis", "analyze"],

    research: ["researching", "analysis"],
    researching: ["research", "analysis"],

    code: ["coding", "programming", "developer"],
    coding: ["code", "programming"],
    programming: ["code", "coding"],
};

function tokenize(text: string): string[] {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, " ")
        .split(/\s+/)
        .filter(
            (word) =>
                word.length > 1 &&
                !STOP_WORDS.has(word),
        );
}

function expandWords(words: string[]): Set<string> {
    const expanded = new Set(words);

    for (const word of words) {
        const relatedWords = RELATED_WORDS[word];

        if (relatedWords) {
            for (const relatedWord of relatedWords) {
                expanded.add(relatedWord);
            }
        }
    }

    return expanded;
}

function scoreAgent(
    goal: string,
    agent: RankedAgent,
): number {
    const goalWords = tokenize(goal);
    const expandedGoalWords = expandWords(goalWords);

    const nameWords = tokenize(agent.name ?? "");
    const descriptionWords = tokenize(
        agent.description ?? "",
    );

    let score = 0;

    for (const word of goalWords) {
        if (nameWords.includes(word)) {
            score += 8;
        }

        if (descriptionWords.includes(word)) {
            score += 4;
        }
    }

    for (const word of expandedGoalWords) {
        if (nameWords.includes(word)) {
            score += 6;
        }

        if (descriptionWords.includes(word)) {
            score += 3;
        }
    }

    if (agent.mcpEndpoint) {
        score += 2;
    }

    if (agent.mcpVersion) {
        score += 1;
    }

    if (agent.x402Support) {
        score += 2;
    }

    return score;
}

export function rankAgents(
    goal: string,
    agents: RankedAgent[],
): RankedAgent[] {
    return [...agents].sort(
        (a, b) =>
            scoreAgent(goal, b) -
            scoreAgent(goal, a),
    );
}