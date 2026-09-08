import { NextRequest, NextResponse } from "next/server";
import { services } from "@/data/services";
import { approveDemoPayment } from "@/lib/payments/paymentService";
import { executeService } from "@/lib/services/executeService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const serviceId = body.serviceId;
    const input = body.input;

    if (!serviceId || !input) {
      return NextResponse.json(
        {
          success: false,
          error: "serviceId and input are required.",
        },
        { status: 400 },
      );
    }

    const service = services.find((item) => item.id === serviceId);

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          error: "Service not found.",
        },
        { status: 404 },
      );
    }

    const payment = await approveDemoPayment({
      serviceId: service.id,
      payment: service.payment,
    });

    const execution = await executeService({
      service,
      input,
      payment,
    });

    return NextResponse.json({
      success: execution.success,
      service: service.name,
      provider: service.provider,
      price: service.price,
      unit: service.unit,
      payment: execution.payment,
      result: execution.output,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Unable to process demo payment.",
      },
      { status: 500 },
    );
  }
}