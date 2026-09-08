import { ServicePayment } from "@/types/service";

export interface PaymentRequest {
  serviceId: string;
  payment: ServicePayment;
}

export interface PaymentResult {
  required: boolean;
  paid: boolean;
  method: ServicePayment["method"];
  network: ServicePayment["network"];
  asset: ServicePayment["asset"];
  amount: string;
  message: string;
}

export async function requestPayment({
  payment,
}: PaymentRequest): Promise<PaymentResult> {
  return {
    required: true,
    paid: false,
    method: payment.method,
    network: payment.network,
    asset: payment.asset,
    amount: payment.amount,
    message: "Payment required before service execution.",
  };
}

export async function approveDemoPayment({
  payment,
}: PaymentRequest): Promise<PaymentResult> {
  return {
    required: true,
    paid: true,
    method: payment.method,
    network: payment.network,
    asset: payment.asset,
    amount: payment.amount,
    message: "Demo payment confirmed.",
  };
}