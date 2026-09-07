import { NextResponse } from "next/server";
import { services } from "@/data/services";
import { executeService } from "@/lib/services/executeService";

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

    const execution = await executeService({
      service,
      input,
    });

    return NextResponse.json({
      success: execution.success,
      service: service.name,
      result: execution.output,
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