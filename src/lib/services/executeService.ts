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

export interface ExecuteServiceResult {
  success: boolean;
  output: string;
  payment: PaymentResult;
}

export async function executeService({
  service,
  input,
  payment,
}: ExecuteServiceInput): Promise<ExecuteServiceResult> {
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