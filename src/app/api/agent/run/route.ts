import { NextResponse } from "next/server";
import { selectService } from "@/lib/agent/selectService";
import { executeService } from "@/lib/services/executeService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const goal = body.goal;

    if (!goal || typeof goal !== "string") {
      return NextResponse.json(
        { error: "A goal is required." },
        { status: 400 },
      );
    }

    const selection = selectService(goal);

    if (!selection) {
      return NextResponse.json(
        { error: "No suitable service found." },
        { status: 404 },
      );
    }

    const { service, reasoning } = selection;

    const execution = await executeService({
      service,
      input: goal,
    });

    const result = [
      execution.output,
      "",
      "Agent goal:",
      goal,
    ].join("\n");

    return NextResponse.json({
      success: execution.success,
      serviceId: service.id,
      service: service.name,
      provider: service.provider,
      price: service.price,
      unit: service.unit,
      reasoning,
      payment: execution.payment,
      result: execution.output,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 },
    );
  }
}