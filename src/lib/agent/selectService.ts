import { services } from "@/data/services";
import { APIService } from "@/types/service";

interface ServiceSelection {
  service: APIService;
  reasoning: string;
}

export function selectService(goal: string): ServiceSelection | null {
  const normalizedGoal = goal.toLowerCase();

  let serviceId = "summarize";

  let reasoning =
    "The agent selected SummarizeAI for general AI text processing.";

  if (
    normalizedGoal.includes("image") ||
    normalizedGoal.includes("photo") ||
    normalizedGoal.includes("picture") ||
    normalizedGoal.includes("visual")
  ) {
    serviceId = "pixelforge";

    reasoning =
      "The agent identified an image-generation requirement and selected PixelForge.";
  } else if (
    normalizedGoal.includes("search") ||
    normalizedGoal.includes("research") ||
    normalizedGoal.includes("find information") ||
    normalizedGoal.includes("web")
  ) {
    serviceId = "deepsearch";

    reasoning =
      "The agent identified a research requirement and selected DeepSearch.";
  } else if (
    normalizedGoal.includes("translate") ||
    normalizedGoal.includes("translation")
  ) {
    serviceId = "lingua";

    reasoning =
      "The agent identified a translation requirement and selected Lingua.";
  } else if (
    normalizedGoal.includes("code") ||
    normalizedGoal.includes("debug") ||
    normalizedGoal.includes("program")
  ) {
    serviceId = "codepilot";

    reasoning =
      "The agent identified a developer task and selected CodePilot.";
  } else if (
    normalizedGoal.includes("blockchain") ||
    normalizedGoal.includes("wallet") ||
    normalizedGoal.includes("onchain")
  ) {
    serviceId = "chainlens";

    reasoning =
      "The agent identified a blockchain-data requirement and selected ChainLens.";
  }

  const service = services.find(
    (item) => item.id === serviceId,
  );

  if (!service) {
    return null;
  }

  return {
    service,
    reasoning,
  };
}