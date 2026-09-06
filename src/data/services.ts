import { APIService } from "@/types/service";

export const services: APIService[] = [
  {
    id: "pixelforge",
    name: "PixelForge",
    provider: "PixelForge Labs",
    description:
      "Generate production-ready images from natural language prompts.",
    category: "Media",
    price: "0.002",
    unit: "HBAR / request",
    responseTime: "< 8 sec",
    status: "online",
    capabilities: [
      "Image generation",
      "Text-to-image",
      "Product imagery",
    ],
  },
  {
    id: "deepsearch",
    name: "DeepSearch",
    provider: "Open Intelligence",
    description:
      "Search and structure web information for autonomous research agents.",
    category: "Research",
    price: "0.001",
    unit: "HBAR / request",
    responseTime: "< 3 sec",
    status: "online",
    capabilities: [
      "Web search",
      "Research",
      "Source extraction",
    ],
  },
  {
    id: "summarize",
    name: "SummarizeAI",
    provider: "Context Labs",
    description:
      "Turn long documents and unstructured text into concise summaries.",
    category: "AI",
    price: "0.0005",
    unit: "HBAR / request",
    responseTime: "< 2 sec",
    status: "online",
    capabilities: [
      "Summarization",
      "Document analysis",
      "Key points",
    ],
  },
  {
    id: "lingua",
    name: "Lingua",
    provider: "Lingua Labs",
    description:
      "Translate text between languages with context-aware AI processing.",
    category: "AI",
    price: "0.0005",
    unit: "HBAR / request",
    responseTime: "< 2 sec",
    status: "online",
    capabilities: [
      "Translation",
      "Language detection",
      "Context preservation",
    ],
  },
  {
    id: "chainlens",
    name: "ChainLens",
    provider: "ChainLens",
    description:
      "Query structured blockchain data for autonomous applications.",
    category: "Data",
    price: "0.001",
    unit: "HBAR / request",
    responseTime: "< 4 sec",
    status: "online",
    capabilities: [
      "Blockchain data",
      "Wallet activity",
      "Protocol analytics",
    ],
  },
  {
    id: "codepilot",
    name: "CodePilot",
    provider: "Dev Systems",
    description:
      "Generate and analyze code through an agent-ready developer API.",
    category: "Developer",
    price: "0.0015",
    unit: "HBAR / request",
    responseTime: "< 5 sec",
    status: "online",
    capabilities: [
      "Code generation",
      "Code review",
      "Debugging",
    ],
  },
];