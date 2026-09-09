import { HTTPFacilitatorClient } from "@x402/core/server";
import { x402ResourceServer } from "@x402/core/server";
import { ExactHederaScheme } from "@x402/hedera/exact/server";

const FACILITATOR_URL =
  process.env.BLOCKY402_FACILITATOR_URL ??
  "https://api.testnet.blocky402.com";

export const HEDERA_NETWORK = "hedera:testnet" as const;

const providerAccountId =
  process.env.HEDERA_PROVIDER_ACCOUNT_ID;

if (!providerAccountId) {
  throw new Error(
    "HEDERA_PROVIDER_ACCOUNT_ID is not configured.",
  );
}

export const PIXELFORGE_PAY_TO: string =
  providerAccountId;

const facilitator = new HTTPFacilitatorClient({
  url: FACILITATOR_URL,
});

export const x402Server = new x402ResourceServer(
  facilitator,
).register(
  "hedera:*",
  new ExactHederaScheme(),
);