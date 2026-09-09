import { NextRequest, NextResponse } from "next/server";
import { decodePaymentResponseHeader } from "@x402/fetch";
import { paidFetch } from "@/lib/payments/hederaX402Client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.input || typeof body.input !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "input is required.",
        },
        { status: 400 },
      );
    }

    const response = await paidFetch(
      "http://localhost:3000/api/services/pixelforge",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: body.input,
        }),
      },
    );

    const result = await response.json();

    return NextResponse.json(
      {
        success: response.ok,
        status: response.status,
        result,
        paymentSettlement: response.headers.get("PAYMENT-RESPONSE")
          ? decodePaymentResponseHeader(
            response.headers.get("PAYMENT-RESPONSE")!,
          )
          : null,
      },
      {
        status: response.ok ? 200 : response.status,
      },
    );
  } catch (error) {
    console.error(
      "Agent x402 request failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to execute paid agent request.",
      },
      { status: 500 },
    );
  }
}