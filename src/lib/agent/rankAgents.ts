interface RankedAgent {
    agentId: string;
    name: string | null;
    description: string | null;
    mcpEndpoint: string | null;
    mcpVersion: string | null;
    x402Support: boolean;
    totalFeedback?: number;
    validationCount?: number;
    completedValidationCount?: number;
    averageValidationScore?: number;
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

function getFeedbackBonus(
    totalFeedback: number,
): number {
    if (totalFeedback >= 20) {
        return 8;
    }

    if (totalFeedback >= 10) {
        return 6;
    }

    if (totalFeedback >= 5) {
        return 4;
    }

    if (totalFeedback >= 2) {
        return 2;
    }

    if (totalFeedback >= 1) {
        return 1;
    }

    return 0;
}

function getValidationBonus(
    agent: RankedAgent,
): number {
    if (
        !agent.completedValidationCount ||
        agent.completedValidationCount <= 0
    ) {
        return 0;
    }

    const score =
        agent.averageValidationScore ?? 0;

    if (score >= 90) {
        return 8;
    }

    if (score >= 75) {
        return 6;
    }

    if (score >= 50) {
        return 4;
    }

    return 2;
}

function getIntentBonus(goal: string, agent: RankedAgent): number {
    const normalizedGoal = goal.toLowerCase();
    const text = [
        agent.name ?? "",
        agent.description ?? "",
    ]
        .join(" ")
        .toLowerCase();

    let bonus = 0;

    // ZK / proof-generation intent.
    if (
        /\b(zk|zero[- ]knowledge|proof|proofs)\b/.test(
            normalizedGoal,
        )
    ) {
        if (
            /\b(zk|zero[- ]knowledge|proof|proofs)\b/.test(
                text,
            )
        ) {
            bonus += 20;
        }

        if (
            /\b(generate|generating|generation)\b/.test(
                text,
            )
        ) {
            bonus += 10;
        }
    }

    // Blockchain market-analysis intent.
    if (
        /\b(blockchain|onchain|crypto)\b/.test(
            normalizedGoal,
        ) &&
        /\b(market|markets|trading|price|prices)\b/.test(
            normalizedGoal,
        ) &&
        /\b(analysis|analyze|analytics)\b/.test(
            normalizedGoal,
        )
    ) {
        if (
            /\b(blockchain|onchain|crypto)\b/.test(text)
        ) {
            bonus += 8;
        }

        if (
            /\b(market|markets|trading|price|prices)\b/.test(
                text,
            )
        ) {
            bonus += 8;
        }

        if (
            /\b(analysis|analyze|analytics)\b/.test(text)
        ) {
            bonus += 8;
        }
    }

    return bonus;
}

function scoreAgent(
    goal: string,
    agent: RankedAgent,
): number {
    const goalWords = tokenize(goal);
    const expandedGoalWords = expandWords(goalWords);

    const nameWords = tokenize(
        agent.name ?? "",
    );

    const descriptionWords = tokenize(
        agent.description ?? "",
    );

    let score = 0;

    // Direct goal relevance.
    for (const word of goalWords) {
        if (nameWords.includes(word)) {
            score += 8;
        }

        if (descriptionWords.includes(word)) {
            score += 4;
        }
    }

    // Strong bonus for matching multiple distinct goal concepts.
    // This keeps relevance ahead of reputation.
    const matchedGoalWords = goalWords.filter(
        (word) =>
            nameWords.includes(word) ||
            descriptionWords.includes(word),
    );

    const uniqueMatchedWords = new Set(
        matchedGoalWords,
    );

    score += uniqueMatchedWords.size * 5;

    // Related terminology.
    for (const word of expandedGoalWords) {
        if (nameWords.includes(word)) {
            score += 2;
        }

        if (descriptionWords.includes(word)) {
            score += 1;
        }
    }

    // Intent-specific capability matching.
    score += getIntentBonus(goal, agent);

    // Technical capability bonuses.
    if (agent.mcpEndpoint) {
        score += 2;
    }

    if (agent.mcpVersion) {
        score += 1;
    }

    if (agent.x402Support) {
        score += 2;
    }

    // Reputation is a secondary trust signal.
    score += Math.min(
        getFeedbackBonus(agent.totalFeedback ?? 0),
        4,
    );

    // Validation is also secondary.
    score += Math.min(
        getValidationBonus(agent),
        4,
    );

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