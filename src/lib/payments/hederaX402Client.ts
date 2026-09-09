import { wrapFetchWithPayment } from "@x402/fetch";
import { x402Client } from "@x402/core/client";
import { ExactHederaScheme } from "@x402/hedera/exact/client";
import {
  createClientHederaSigner,
  PrivateKey,
} from "@x402/hedera";

const HEDERA_NETWORK = "hedera:testnet" as const;

const MAX_PAYMENT_TINYBARS = "200000";

function createHederaPaymentClient() {
  const accountId = process.env.HEDERA_ACCOUNT_ID;
  const privateKey = process.env.HEDERA_PRIVATE_KEY;

  if (!accountId) {
    throw new Error("HEDERA_ACCOUNT_ID is not configured.");
  }

  if (!privateKey) {
    throw new Error("HEDERA_PRIVATE_KEY is not configured.");
  }

  const signer = createClientHederaSigner(
    accountId,
    PrivateKey.fromStringECDSA(privateKey),
    {
      network: HEDERA_NETWORK,
    },
  );

  const client = x402Client.fromConfig({
    schemes: [
      {
        network: HEDERA_NETWORK,
        client: new ExactHederaScheme(signer),
      },
    ],

    spendControls: {
      allowedAssets: [
        {
          network: HEDERA_NETWORK,
          asset: "0.0.0",
          maxAmountPerPayment: MAX_PAYMENT_TINYBARS,
        },
      ],
    },

    policies: [
      (_version, requirements) =>
        requirements.filter(
          (requirement) =>
            requirement.network === HEDERA_NETWORK &&
            requirement.asset === "0.0.0" &&
            requirement.payTo ===
              process.env.HEDERA_PROVIDER_ACCOUNT_ID,
        ),
    ],
  });

  return client;
}

export async function paidFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
) {
  const client = createHederaPaymentClient();

  const fetchWithPayment = wrapFetchWithPayment(
    fetch,
    client,
  );

  return fetchWithPayment(input, init);
}