import { services } from "@/data/services";
import { APIService } from "@/types/service";

interface ServiceSelection {
  service: APIService;
  reasoning: string;
  evaluatedServices: number;
}

interface ScoredService {
  service: APIService;
  score: number;
  matches: string[];
}

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "for",
  "from",
  "get",
  "give",
  "i",
  "in",
  "into",
  "me",
  "my",
  "of",
  "on",
  "the",
  "this",
  "to",
  "want",
  "with",
]);

const RELATED_WORDS: Record<string, string[]> = {
  translate: ["translation", "language"],
  translation: ["translate", "language"],
  translating: ["translate", "translation"],

  image: ["images", "imagery", "visual"],
  images: ["image", "imagery", "visual"],
  imagery: ["image", "images", "visual"],
  visual: ["image", "images", "imagery"],

  research: ["researching", "information", "search"],
  researching: ["research", "information", "search"],
  search: ["research", "information"],
  find: ["search", "research", "information"],

  analyze: ["analysis", "analytics", "activity"],
  analysis: ["analyze", "analytics"],
  analytics: ["analyze", "analysis"],

  summarize: ["summary", "summarization"],
  summary: ["summarize", "summarization"],
  summarise: ["summarize", "summary"],

  code: ["coding", "programming", "developer"],
  coding: ["code", "programming"],
  program: ["programming", "code"],
  programming: ["code", "coding"],

  blockchain: ["onchain", "wallet", "protocol"],
  wallet: ["blockchain", "onchain"],
  onchain: ["blockchain", "wallet"],
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(
      (word) =>
        word.length > 2 && !STOP_WORDS.has(word),
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

function scoreService(
  goal: string,
  service: APIService,
): ScoredService {
  const goalWords = tokenize(goal);
  const expandedGoalWords = expandWords(goalWords);

  const nameWords = tokenize(service.name);
  const descriptionWords = tokenize(service.description);
  const categoryWords = tokenize(service.category);
  const capabilityWords = service.capabilities.flatMap(tokenize);

  const matches: string[] = [];
  let score = 0;

  const wantsAgentDiscovery =
    /\b(find|discover|search|look for)\b/i.test(goal) &&
    /\b(agent|agents)\b/i.test(goal);

  if (wantsAgentDiscovery && service.id === "agentscout") {
    score += 20;
  }

  for (const word of goalWords) {
    if (nameWords.includes(word)) {
      score += 5;
      matches.push(word);
    }

    if (descriptionWords.includes(word)) {
      score += 3;
      matches.push(word);
    }

    if (categoryWords.includes(word)) {
      score += 2;
      matches.push(word);
    }

    if (capabilityWords.includes(word)) {
      score += 5;
      matches.push(word);
    }
  }

  // Check related words against service capabilities.
  for (const word of expandedGoalWords) {
    if (capabilityWords.includes(word)) {
      score += 4;
      matches.push(word);
    }

    if (descriptionWords.includes(word)) {
      score += 2;
      matches.push(word);
    }
  }

  // Prefer services that are currently online.
  if (service.status === "online") {
    score += 1;
  }

  return {
    service,
    score,
    matches: [...new Set(matches)],
  };
}

export function selectService(
  goal: string,
): ServiceSelection | null {
  if (!goal.trim()) {
    return null;
  }

  const scoredServices = services
    .map((service) => scoreService(goal, service))
    .sort((a, b) => b.score - a.score);

  const bestMatch = scoredServices[0];

  if (!bestMatch || bestMatch.score === 0) {
    return null;
  }

  const reasoning =
    bestMatch.matches.length > 0
      ? `Selected ${bestMatch.service.name} because it matches the goal through ${bestMatch.matches
        .slice(0, 5)
        .join(", ")}.`
      : `Selected ${bestMatch.service.name} because it is the strongest available service match.`;

  return {
    service: bestMatch.service,
    reasoning,
    evaluatedServices: scoredServices.length,
  };
}