import { APIService } from "@/types/service";
import {
  PaymentResult,
  requestPayment,
} from "@/lib/payments/paymentService";

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

  // Provider execution will eventually happen here.
  // In the real implementation, this request will only
  // reach the provider after x402 payment verification.

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