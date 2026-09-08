import { ExactHederaScheme } from "@x402/hedera/exact/client";
import {
  createClientHederaSigner,
  PrivateKey,
} from "@x402/hedera";

const BLOCKY402_URL = "https://api.testnet.blocky402.com";

const HEDERA_NETWORK = "hedera:testnet" as const;

const PAYMENT_AMOUNT_TINYBARS = "200000";

interface BlockySupportedResponse {
  kinds: Array<{
    scheme: string;
    network: string;
    x402Version: number;
    extra?: {
      feePayer?: string;
    };
  }>;
  signers?: Record<string, string[]>;
}

export interface HederaPaymentResult {
  success: boolean;
  payer?: string;
  provider?: string;
  amount?: string;
  transaction?: string;
  network?: string;
  error?: string;
}

export async function makeHederaPayment(): Promise<HederaPaymentResult> {
  const payerAccountId = process.env.HEDERA_ACCOUNT_ID;
  const privateKey = process.env.HEDERA_PRIVATE_KEY;
  const providerAccountId = process.env.HEDERA_PROVIDER_ACCOUNT_ID;

  if (!payerAccountId) {
    throw new Error("HEDERA_ACCOUNT_ID is not configured.");
  }

  if (!privateKey) {
    throw new Error("HEDERA_PRIVATE_KEY is not configured.");
  }

  if (!providerAccountId) {
    throw new Error(
      "HEDERA_PROVIDER_ACCOUNT_ID is not configured.",
    );
  }

  // 1. Discover the facilitator's current Hedera fee payer.
  const supportedResponse = await fetch(
    `${BLOCKY402_URL}/supported`,
  );

  if (!supportedResponse.ok) {
    throw new Error(
      `Unable to read Blocky402 supported networks: ${supportedResponse.status}`,
    );
  }

  const supported =
    (await supportedResponse.json()) as BlockySupportedResponse;

  const hederaKind = supported.kinds.find(
    (kind) => kind.network === HEDERA_NETWORK,
  );

  if (!hederaKind) {
    throw new Error(
      "Blocky402 does not currently advertise Hedera Testnet.",
    );
  }

  const feePayer =
    hederaKind.extra?.feePayer ??
    supported.signers?.["hedera:*"]?.[0];

  if (!feePayer) {
    throw new Error(
      "Blocky402 did not provide a Hedera fee payer.",
    );
  }

  // 2. Build the Hedera signer.
  const signer = createClientHederaSigner(
    payerAccountId,
    PrivateKey.fromStringECDSA(privateKey),
    {
      network: HEDERA_NETWORK,
    },
  );

  // 3. Define the x402 payment.
  const paymentRequirements = {
    scheme: "exact" as const,
    network: HEDERA_NETWORK,
    amount: PAYMENT_AMOUNT_TINYBARS,
    payTo: providerAccountId,
    maxTimeoutSeconds: 300,
    asset: "0.0.0",
    extra: {
      feePayer,
    },
  };

  // 4. Create the signed Hedera payment payload.
  const scheme = new ExactHederaScheme(signer);

  const signed = await scheme.createPaymentPayload(
    2,
    paymentRequirements,
  );

  const paymentPayload = {
    x402Version: 2,
    scheme: "exact",
    network: HEDERA_NETWORK,
    accepted: paymentRequirements,
    payload: signed.payload,
  };

  const requestBody = {
    x402Version: 2,
    paymentPayload,
    paymentRequirements,
  };

  // 5. Ask Blocky402 to verify the payment.
  const verifyResponse = await fetch(
    `${BLOCKY402_URL}/verify`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    },
  );

  const verification = await verifyResponse.json();

  if (!verifyResponse.ok || !verification.isValid) {
    throw new Error(
      `Payment verification failed: ${
        verification.invalidMessage ??
        verification.invalidReason ??
        "Unknown verification error"
      }`,
    );
  }

  // 6. Settle the payment on Hedera.
  const settleResponse = await fetch(
    `${BLOCKY402_URL}/settle`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    },
  );

  const settlement = await settleResponse.json();

  if (!settleResponse.ok || !settlement.success) {
    throw new Error(
      `Payment settlement failed: ${
        settlement.errorMessage ??
        settlement.errorReason ??
        "Unknown settlement error"
      }`,
    );
  }

  return {
    success: true,
    payer: payerAccountId,
    provider: providerAccountId,
    amount: PAYMENT_AMOUNT_TINYBARS,
    transaction: settlement.transaction,
    network: settlement.network,
  };
}