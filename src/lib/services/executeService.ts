import { APIService } from "@/types/service";

interface ExecuteServiceInput {
  service: APIService;
  input: string;
}

export interface ExecuteServiceResult {
  success: boolean;
  output: string;
}

export async function executeService({
  service,
  input,
}: ExecuteServiceInput): Promise<ExecuteServiceResult> {
  // Temporary provider execution.
  // This will later become the x402 payment boundary.

  await new Promise((resolve) => setTimeout(resolve, 1200));

  const output = [
    "Request completed successfully.",
    "",
    `Service: ${service.name}`,
    `Provider: ${service.provider}`,
    "",
    "Input received:",
    input,
    "",
    "Execution status: completed",
  ].join("\n");

  return {
    success: true,
    output,
  };
}