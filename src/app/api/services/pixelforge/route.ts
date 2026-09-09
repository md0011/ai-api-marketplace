import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "@x402/next";
import {
  HEDERA_NETWORK,
  PIXELFORGE_PAY_TO,
  x402Server,
} from "@/lib/payments/x402Server";

interface PixelForgeResponse {
  success: boolean;
  serviceId?: string;
  service?: string;
  provider?: string;
  input?: string;
  result?: string;
  payment?: {
    network: typeof HEDERA_NETWORK;
    asset: string;
    payTo: string | undefined;
    amount: string;
    unit: string;
  };
  error?: string;
}

async function handler(
  request: NextRequest,
): Promise<NextResponse<PixelForgeResponse>> {
  try {
    const body = await request.json();
    const input = body.input;

    if (!input || typeof input !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "input is required.",
        },
        { status: 400 },
      );
    }

    // Simulated provider execution.
    // Later this will call the real PixelForge provider.
    await new Promise((resolve) => setTimeout(resolve, 1200));

    return NextResponse.json({
      success: true,
      serviceId: "pixelforge",
      service: "PixelForge",
      provider: "PixelForge Labs",
      input,
      result: [
        "PixelForge service executed successfully.",
        "",
        `Prompt: ${input}`,
        "",
        "Execution status: completed",
      ].join("\n"),
      payment: {
        network: HEDERA_NETWORK,
        asset: "HBAR",
        payTo: PIXELFORGE_PAY_TO,
        amount: "0.002",
        unit: "HBAR / request",
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Unable to execute PixelForge.",
      },
      { status: 500 },
    );
  }
}

export const POST = withX402(
  handler,
  {
    accepts: [
      {
        scheme: "exact",
        network: HEDERA_NETWORK,
        payTo: PIXELFORGE_PAY_TO,
        price: {
          amount: "200000",
          asset: "0.0.0",
        },
        maxTimeoutSeconds: 300,
      },
    ],
    description:
      "PixelForge AI product image generation service",
    mimeType: "application/json",
  },
  x402Server,
);