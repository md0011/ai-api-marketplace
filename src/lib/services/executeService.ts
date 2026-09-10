import { discoverAgents } from "@/lib/graph/agentScout";
import { APIService } from "@/types/service";
import {
  PaymentResult,
  requestPayment,
} from "@/lib/payments/paymentService";
import { paidFetch } from "@/lib/payments/hederaX402Client";
import { decodePaymentResponseHeader } from "@x402/fetch";

interface ExecuteServiceInput {
  service: APIService;
  input: string;
  payment?: PaymentResult;
}

export interface ScoutAgent {
  agentId: string;
  name: string | null;
  description: string | null;
  mcpEndpoint: string | null;
  mcpVersion: string | null;
  x402Support: boolean;
}

export interface ExecuteServiceResult {
  success: boolean;
  output: string;
  payment: PaymentResult;
  agents?: ScoutAgent[];
}

export async function executeService({
  service,
  input,
  payment,
}: ExecuteServiceInput): Promise<ExecuteServiceResult> {
  // AgentScout uses The Graph Agent0 Subgraph
  // to discover live ERC-8004 agents.
  if (service.id === "agentscout") {
    try {
      const agents = await discoverAgents();

      const output = [
        `AgentScout discovered ${agents.length} active MCP agents using The Graph.`,
        "",
        ...agents.slice(0, 5).map((agent, index) => {
          return [
            `${index + 1}. ${agent.name ?? `Agent ${agent.agentId}`}`,
            `Agent ID: ${agent.agentId}`,
            `MCP: ${agent.mcpEndpoint ? "supported" : "not detected"}`,
            `MCP version: ${agent.mcpVersion ?? "unknown"}`,
            `x402: ${agent.x402Support
              ? "supported"
              : "not detected"
            }`,
            `Description: ${agent.description ?? "No description available."
            }`,
          ].join("\n");
        }),
      ].join("\n\n");

      return {
        success: true,
        output,
        agents: agents.slice(0, 10),
        payment: {
          required: false,
          paid: false,
          method: service.payment.method,
          network: service.payment.network,
          asset: service.payment.asset,
          amount: service.payment.amount,
          message: "The Graph query completed successfully.",
        },
      };
    } catch (error) {
      return {
        success: false,
        output: "",
        payment: {
          required: false,
          paid: false,
          method: service.payment.method,
          network: service.payment.network,
          asset: service.payment.asset,
          amount: service.payment.amount,
          message:
            error instanceof Error
              ? error.message
              : "AgentScout Graph query failed.",
        },
      };
    }
  }
  // PixelForge uses the real Hedera x402 payment flow.
  if (service.id === "pixelforge") {
    const response = await paidFetch(
      "http://localhost:3000/api/services/pixelforge",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input,
        }),
      },
    );

    const result = await response.json();

    const paymentResponse =
      response.headers.get("PAYMENT-RESPONSE");

    const settlement = paymentResponse
      ? decodePaymentResponseHeader(paymentResponse)
      : null;

    if (!response.ok || !result.success) {
      return {
        success: false,
        output: result.error ?? "PixelForge execution failed.",
        payment: {
          required: true,
          paid: false,
          method: service.payment.method,
          network: service.payment.network,
          asset: service.payment.asset,
          amount: service.payment.amount,
          message: "PixelForge payment or execution failed.",
        },
      };
    }

    return {
      success: true,
      output: result.result,
      payment: {
        required: true,
        paid: settlement?.success ?? true,
        method: service.payment.method,
        network: service.payment.network,
        asset: service.payment.asset,
        amount: service.payment.amount,
        message: settlement?.success
          ? "Payment settled on Hedera."
          : "Payment completed.",
        transaction: settlement?.transaction,
        payer: settlement?.payer,
      },
    };
  }

  // Existing demo flow for all other services.
  const paymentResult =
    payment ??
    (await requestPayment({
      serviceId: service.id,
      payment: service.payment,
    }));

  if (!paymentResult.paid) {
    return {
      success: false,
      output: "",
      payment: paymentResult,
    };
  }

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
    payment: paymentResult,
  };
}