import { NextResponse } from "next/server";
import { makeHederaPayment } from "@/lib/payments/hederaX402";

export async function POST() {
  try {
    const payment = await makeHederaPayment();

    return NextResponse.json(payment);
  } catch (error) {
    console.error("Hedera x402 payment failed:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown Hedera payment error.",
      },
      { status: 500 },
    );
  }
}