import { NextResponse } from "next/server";

import { services } from "@/data/services";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const serviceId = body.serviceId;
    const input = body.input;

    if (!serviceId || !input) {
      return NextResponse.json(
        {
          error: "serviceId and input are required.",
        },
        {
          status: 400,
        },
      );
    }

    const service = services.find(
      (item) => item.id === serviceId,
    );

    if (!service) {
      return NextResponse.json(
        {
          error: "Service not found.",
        },
        {
          status: 404,
        },
      );
    }

    // Temporary simulated execution.
    // Later this layer will handle x402 payment
    // before executing the actual provider service.

    await new Promise((resolve) =>
      setTimeout(resolve, 1200),
    );

    const result = [
      `Request completed successfully.`,
      ``,
      `Service: ${service.name}`,
      `Provider: ${service.provider}`,
      ``,
      `Input received:`,
      input,
      ``,
      `Execution status: completed`,
    ].join("\n");

    return NextResponse.json({
      success: true,
      service: service.name,
      result,
    });
  } catch {
    return NextResponse.json(
      {
        error: "Invalid request.",
      },
      {
        status: 400,
      },
    );
  }
}